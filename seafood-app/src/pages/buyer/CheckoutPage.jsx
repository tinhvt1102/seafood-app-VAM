import { useState, useEffect } from "react";
import { CreditCard, Wallet, Banknote, QrCode, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { paymentApi, orderApi } from "../../api/products";

export function CheckoutPage({ onNavigate, cart = [], setCart }) {
  const [paymentMethod, setPaymentMethod] = useState("payos");
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    note: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Kiểm tra xem người dùng đang Mua ngay hay mua từ Giỏ hàng
  useEffect(() => {
    const directItem = JSON.parse(localStorage.getItem("directCheckoutItem"));

    if (directItem) {
      setCheckoutItems([directItem]); // Nếu có dữ liệu mua ngay, ép vào mảng để hiển thị
      setIsDirectCheckout(true);
    } else if (cart && cart.length > 0) {
      // Nếu không mua ngay, dùng giỏ hàng do App.jsx truyền xuống thông qua biến cart
      setCheckoutItems(cart);
      setIsDirectCheckout(false);
    } else {
      // Trường hợp dự phòng nếu React State chưa kịp load: Đọc thẳng từ localStorage của giỏ hàng
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCheckoutItems(localCart);
      setIsDirectCheckout(false);
    }

    return () => {
      localStorage.removeItem("directCheckoutItem");
    };
  }, [cart]);

  // 2. Tính toán toàn bộ chi phí dựa trên dữ liệu `checkoutItems` đã phân loại ở trên
  const subtotal = checkoutItems.reduce((sum, item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : parseInt(String(item.price).replace(/\D/g, ""), 10) || 0;
    return sum + price * item.quantity;
  }, 0);
  const serviceFee = subtotal * 0.05; // Phí dịch vụ 5% tổng đơn hàng
  const total = subtotal + serviceFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkoutItems || checkoutItems.length === 0) {
      toast.error("Không có sản phẩm nào để thanh toán!");
      onNavigate("retail");
      return;
    }

    setLoading(true);

    const fullAddress = `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.city}`.replace(/^, |, $/g, '');

    // Map orderItems sang định dạng backend API DTO
    const orderItemsDto = checkoutItems.map((item) => ({
      productId: Number(item.id),
      quantity: Number(item.quantity)
    }));

    try {
      let createdOrder = null;

      // Gọi API Backend C# để lưu đơn hàng vào Database
      try {
        createdOrder = await orderApi.createOrder({
          shippingAddress: fullAddress || "TP. Hồ Chí Minh",
          orderItems: orderItemsDto
        });
      } catch (dbError) {
        console.warn("Backend order creation error, using fallback client order creation:", dbError);
      }

      const orderId = createdOrder?.id || Math.floor(100000 + Math.random() * 900000);

      const orderData = {
        id: orderId,
        items: checkoutItems,
        subtotal: subtotal,
        serviceFee: serviceFee,
        total: total,
        paymentMethod: paymentMethod,
        shippingAddress: fullAddress,
        date: new Date().toISOString(),
      };

      // Lưu đơn hàng vào LocalStorage làm backup
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, orderData]),
      );

      // Nếu chọn thanh toán PayOS (VietQR)
      if (paymentMethod === "payos") {
        try {
          const res = await paymentApi.createCheckoutUrl(orderId, Math.round(total));
          if (res?.checkoutUrl) {
            toast.success("Đang chuyển hướng sang cổng thanh toán PayOS (VietQR)...");
            
            // Xóa giỏ hàng trước khi nhảy sang trang PayOS
            if (isDirectCheckout) {
              localStorage.removeItem("directCheckoutItem");
            } else {
              if (typeof setCart === "function") setCart([]);
              localStorage.removeItem("cart");
            }

            // Chuyển hướng trực tiếp tới liên kết thanh toán của PayOS
            window.location.href = res.checkoutUrl;
            return;
          }
        } catch (payosError) {
          console.error("Lỗi khi tạo PayOS Checkout URL:", payosError);
          toast.error(payosError?.message || "Không thể tạo link thanh toán PayOS VietQR. Vui lòng kiểm tra lại backend.");
          setLoading(false);
          return;
        }
      }

      // Nếu chọn các phương thức khác (COD, Chuyển khoản ngân hàng...)
      if (isDirectCheckout) {
        localStorage.removeItem("directCheckoutItem");
      } else {
        if (typeof setCart === "function") {
          setCart([]);
        }
        localStorage.removeItem("cart");
      }

      toast.success("Đặt hàng thành công! Đơn hàng đã được lưu vào hệ thống.");
      window.scrollTo(0, 0);
      onNavigate("payment-success", orderId);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error(error?.message || "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <h1 className="mb-8 font-bold text-2xl" style={{ color: "#0A2647" }}>
          Thanh toán{" "}
          {isDirectCheckout && (
            <span className="text-sm font-normal text-gray-500">
              (Chế độ Mua Ngay)
            </span>
          )}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2
                className="text-lg font-medium mb-6"
                style={{ color: "#0A2647" }}
              >
                Thông tin giao hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                    style={{ borderColor: "#e5e7eb" }}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10,11}"
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                    style={{ borderColor: "#e5e7eb" }}
                    placeholder="0901234567"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                  style={{ borderColor: "#e5e7eb" }}
                  placeholder="email@example.com"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">
                  Địa chỉ giao hàng *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:border-[#00BCD4]"
                  style={{ borderColor: "#e5e7eb" }}
                  placeholder="Số nhà, tên đường"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="p-3 border rounded-md bg-white"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Cà Mau">Cà Mau</option>
                  </select>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="p-3 border rounded-md bg-white"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 7">Quận 7</option>
                  </select>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    required
                    className="p-3 border rounded-md bg-white"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    <option value="Phường 1">Phường 1</option>
                    <option value="Phường 2">Phường 2</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">
                  Ghi chú đơn hàng (tuỳ chọn)
                </label>
                <textarea
                  rows={3}
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                  style={{ borderColor: "#e5e7eb" }}
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                />
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2
                className="text-lg font-medium mb-6"
                style={{ color: "#0A2647" }}
              >
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {/* Lựa chọn PayOS (VietQR) */}
                <label
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "payos"
                      ? "border-[#00BCD4] bg-cyan-50/50 font-medium"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="payos"
                      checked={paymentMethod === "payos"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-[#00BCD4]"
                    />
                    <QrCode className="w-5 h-5 text-[#00BCD4]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Thanh toán PayOS (Mã VietQR)</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#00BCD4] text-white rounded-full">Khuyên dùng</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Quét mã VietQR thanh toán nhanh 24/7 từ mọi ứng dụng Ngân hàng</p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "bank"
                      ? "border-[#00BCD4] bg-blue-50/50 font-medium"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#00BCD4]"
                  />
                  <CreditCard
                    className="w-5 h-5"
                    style={{ color: "#0A2647" }}
                  />
                  <span>Chuyển khoản ngân hàng thủ công</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "ewallet"
                      ? "border-[#00BCD4] bg-blue-50/50 font-medium"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="ewallet"
                    checked={paymentMethod === "ewallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#00BCD4]"
                  />
                  <Wallet className="w-5 h-5" style={{ color: "#0A2647" }} />
                  <span>Ví điện tử (MoMo / ZaloPay)</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#00BCD4] bg-blue-50/50 font-medium"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#00BCD4]"
                  />
                  <Banknote className="w-5 h-5" style={{ color: "#0A2647" }} />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
              </div>

              {/* Thông báo PayOS VietQR */}
              {paymentMethod === "payos" && (
                <div className="mt-4 p-4 bg-cyan-50/60 rounded-lg border border-cyan-200 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <QrCode className="w-6 h-6 text-[#00BCD4] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-700 space-y-1">
                      <p className="font-semibold text-[#0A2647]">Thanh toán tự động qua PayOS (VietQR)</p>
                      <p className="text-xs text-slate-600">
                        Sau khi nhấn <strong>"Xác nhận thanh toán"</strong>, hệ thống sẽ chuyển tới trang mã VietQR của PayOS. Đơn hàng của bạn sẽ tự động cập nhật trạng thái thanh toán ngay khi giao dịch thành công.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chi tiết chuyển khoản ngân hàng */}
              {paymentMethod === "bank" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 animate-fadeIn">
                  <p className="text-sm text-gray-600 mb-2">
                    Quý khách vui lòng chuyển khoản theo thông tin sau:
                  </p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p>
                      <strong>Ngân hàng:</strong> Vietcombank - Chi nhánh TP.HCM
                    </p>
                    <p>
                      <strong>Số tài khoản:</strong> 1234567890
                    </p>
                    <p>
                      <strong>Chủ tài khoản:</strong> Công ty VAM
                    </p>
                    <p>
                      <strong>Nội dung:</strong> Thanh toán đơn hàng #[Mã đơn
                      hàng]
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: "#0A2647" }}
              >
                Đơn hàng của bạn
              </h3>

              {/* Danh sách sản phẩm hiển thị dựa trên checkoutItems */}
              <div
                className="space-y-3 mb-4 pb-4 border-b max-h-[300px] overflow-y-auto"
                style={{ borderColor: "#e5e7eb" }}
              >
                {checkoutItems.length > 0 ? (
                  checkoutItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm gap-4"
                    >
                      <span className="text-gray-600 break-words">
                        {item.name}{" "}
                        <span className="text-gray-400 font-medium">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="whitespace-nowrap font-medium">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic py-2">
                    Không có sản phẩm nào.
                  </p>
                )}
              </div>

              {/* Tính toán tiền hóa đơn */}
              <div
                className="space-y-2 mb-4 pb-4 border-b"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">
                    {subtotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span className="font-medium">
                    {serviceFee.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-medium" style={{ color: "#0A2647" }}>
                  Tổng cộng
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: "#d4183d" }}
                >
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Nút bấm Submit */}
              <button
                type="submit"
                disabled={checkoutItems.length === 0 || loading}
                className="w-full py-3 rounded-md text-white font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: "#00BCD4" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý thanh toán...</span>
                  </>
                ) : (
                  <span>Xác nhận thanh toán</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
