import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Tag,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export function CartPage({ cartItems = [], setCartItems, onNavigate }) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  // 1. Hàm cập nhật số lượng trực tiếp
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // 2. Xóa một sản phẩm khỏi giỏ hàng
  const removeItem = (id) => {
    const targetItem = cartItems.find((item) => item.id === id);
    const itemName = targetItem ? targetItem.name : "sản phẩm";

    setCartItems((items) => items.filter((item) => item.id !== id));
    toast.error(`Đã xóa "${itemName}" khỏi giỏ hàng!`);
  };

  // 3. Xóa sạch giỏ hàng
  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
      setCartItems([]);
      setDiscount(0);
      setAppliedCode("");
      toast.success("Đã làm trống giỏ hàng!");
    }
  };

  // 4. Áp dụng mã giảm giá
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "SEAFOOD10") {
      setDiscount(0.1); // Giảm 10%
      setAppliedCode("SEAFOOD10 (-10%)");
      toast.success("Đã áp dụng mã giảm giá SEAFOOD10!");
    } else if (cleanCode === "FREESHIP") {
      setDiscount(0.05); // Giảm 5%
      setAppliedCode("FREESHIP (-5%)");
      toast.success("Đã áp dụng mã miễn phí vận chuyển!");
    } else {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
    }
    setPromoCode("");
  };

  // 5. Tính toán tổng tiền & tiến độ Miễn phí vận chuyển
  const FREE_SHIPPING_THRESHOLD = 500000;

  const { subtotal, shippingFee, discountAmount, total, totalItemCount } =
    useMemo(() => {
      const sub = cartItems.reduce((sum, item) => {
        const p =
          typeof item.price === "number"
            ? item.price
            : parseInt(String(item.price).replace(/\D/g, ""), 10) || 0;
        return sum + p * item.quantity;
      }, 0);

      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const disc = sub * discount;
      const tot = Math.max(0, sub - disc);

      return {
        subtotal: sub,
        discountAmount: disc,
        total: tot,
        totalItemCount: itemCount,
      };
    }, [cartItems, discount]);

  const freeShipProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Giỏ hàng */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => onNavigate("retail")}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0A2647] font-semibold mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2647] tracking-tight flex items-center gap-3">
              Giỏ hàng của bạn
              {totalItemCount > 0 && (
                <span className="text-sm bg-cyan-100 text-cyan-800 font-bold px-3 py-1 rounded-full">
                  {totalItemCount} kg / sản phẩm
                </span>
              )}
            </h1>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Xóa tất cả
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Trạng thái giỏ hàng trống */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-5 text-[#00BCD4]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-[#0A2647] mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Hãy khám phá ngay các mặt hàng hải sản tươi sống chất lượng cao
              trực tiếp từ hộ nuôi và nhà cung cấp uy tín!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate("retail")}
                className="px-6 py-3 rounded-xl text-white font-bold hover:brightness-110 shadow-md shadow-cyan-200 transition-all cursor-pointer"
                style={{ backgroundColor: "#00BCD4" }}
              >
                Chợ Mua Lẻ Hải Sản
              </button>
              <button
                onClick={() => onNavigate("supply")}
                className="px-6 py-3 rounded-xl font-bold border border-slate-200 text-[#0A2647] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Sản Lượng Nổi Bật
              </button>
            </div>
          </div>
        ) : (
          /* Trạng thái giỏ hàng có sản phẩm */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cột trái: Danh sách sản phẩm & Thanh ưu đãi */}
            <div className="lg:col-span-2 space-y-4">
              {/* Thanh tiến trình Miễn Phí Vận Chuyển */}
              <div className="bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-blue-500/10 border border-cyan-100 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-sm font-semibold text-[#0A2647] mb-2">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-600" />
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "🎉 Bạn đã đủ điều kiện được Miễn Phí Vận Chuyển!"
                      : `Thêm ${formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} để được Miễn Phí Vận Chuyển!`}
                  </span>
                  <span className="font-bold text-cyan-700">
                    {freeShipProgress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShipProgress}%` }}
                  />
                </div>
              </div>

              {/* Danh sách các item trong giỏ */}
              {cartItems.map((item) => {
                const numericPrice =
                  typeof item.price === "number"
                    ? item.price
                    : parseInt(String(item.price).replace(/\D/g, ""), 10) || 0;
                const itemTotal = numericPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Ảnh sản phẩm */}
                      <div className="w-full sm:w-28 h-28 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Chi tiết sản phẩm */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base text-[#0A2647] line-clamp-2 hover:text-cyan-600 transition-colors">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa khỏi giỏ"
                              aria-label={`Xóa ${item.name}`}
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>
                              Xuất xứ:{" "}
                              <strong className="text-slate-700">
                                {item.origin || "Việt Nam"}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Đơn giá:{" "}
                              <strong className="text-slate-700">
                                {formatCurrency(numericPrice)}/kg
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* Số lượng & Tổng tiền dòng */}
                        <div className="flex items-end justify-between gap-4 mt-4 pt-3 border-t border-slate-100">
                          {/* Bộ tăng giảm số lượng */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50 p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-slate-700 font-bold"
                              aria-label="Giảm số lượng"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-extrabold text-sm text-[#0A2647]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors cursor-pointer text-slate-700 font-bold"
                              aria-label="Tăng số lượng"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Tổng giá dòng */}
                          <div className="text-right">
                            <span className="block text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                              Tạm tính
                            </span>
                            <span className="font-extrabold text-lg text-[#d4183d]">
                              {formatCurrency(itemTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cột phải: Tổng quan đơn hàng & Mã giảm giá */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold text-[#0A2647] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  Tóm tắt đơn hàng
                  <span className="text-xs font-normal text-slate-500">
                    {totalItemCount} mục
                  </span>
                </h3>

                {/* Form mã giảm giá */}
                <form onSubmit={handleApplyPromo} className="mb-6">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5"></label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã ưu đãi..."
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase font-semibold text-slate-700 bg-slate-50/50"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {appliedCode && (
                    <div className="mt-2 text-xs font-semibold text-teal-600 flex items-center gap-1">
                      ✓ Mã đang dùng: {appliedCode}
                    </div>
                  )}
                </form>

                {/* Các khoản tính toán */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính tiền hàng</span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {/* <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      Phí vận chuyển
                    </span>
                    <span className="font-bold text-slate-800">
                      {shippingFee === 0 ? (
                        <strong className="text-teal-600 font-bold">
                          Miễn phí
                        </strong>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div> */}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-teal-600 font-medium">
                      <span>Giảm giá</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="font-extrabold text-base text-[#0A2647]">
                      Tổng thanh toán
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#d4183d]">
                        {formatCurrency(total)}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        Đã bao gồm VAT nếu có
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <button
                  onClick={() => onNavigate("checkout")}
                  className="w-full py-4 rounded-xl text-white font-bold text-base hover:brightness-110 bg-[#00BCD4] shadow-lg shadow-cyan-200 transition-all cursor-pointer mb-3 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ShieldCheck className="w-5 h-5" /> Tiến Hành Thanh Toán
                </button>

                <button
                  onClick={() => onNavigate("retail")}
                  className="w-full py-3 rounded-xl border border-slate-200 text-[#0A2647] font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Tiếp Tục Mua Sắm
                </button>

                {/* Cam kết mua hàng */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-500" />
                    <span>Cam kết hải sản tươi sống 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-500" />
                    <span>Giao hàng siêu tốc trong vòng 2H</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
