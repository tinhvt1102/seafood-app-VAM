import { useState } from "react";
import { User, Store, Briefcase, Upload, FileText, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { authApi } from "../api/auth";
import { toast } from "react-hot-toast";

export function RoleSelectionOverlay({ user, onStatusUpdated }) {
  const [step, setStep] = useState("select"); // "select" | "seller-form" | "buyer-form" | "submitted"
  const [loading, setLoading] = useState(false);

  // Form states for Seller
  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [aquacultureType, setAquacultureType] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [sellerCert, setSellerCert] = useState(null);

  // Form states for Buyer / Business
  const [companyName, setCompanyName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessLicense, setBusinessLicense] = useState(null);

  const handleSelectCustomer = async () => {
    setLoading(true);
    try {
      await authApi.updateCustomerStatus(user.id);
      toast.success("Kích hoạt tài khoản người mua lẻ thành công!");
      onStatusUpdated("active", "customer");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể kích hoạt tài khoản. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSeller = async (e) => {
    e.preventDefault();
    if (!farmName.trim()) {
      toast.error("Vui lòng nhập tên trang trại!");
      return;
    }

    if (!bankName.trim() || !accountNumber.trim() || !accountHolderName.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin tài khoản ngân hàng (Tên ngân hàng, Số TK, Chủ TK) để nhận tiền doanh thu tự động!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("FarmName", farmName.trim());
      formData.append("FarmAddress", farmAddress.trim());
      formData.append("AquacultureType", aquacultureType.trim());
      formData.append("BankName", bankName.trim());
      formData.append("AccountNumber", accountNumber.trim());
      formData.append("AccountHolderName", accountHolderName.trim().toUpperCase());
      if (sellerCert) {
        if (sellerCert.type !== "application/pdf" && !sellerCert.name.endsWith(".pdf")) {
          toast.error("Chỉ chấp nhận file định dạng PDF cho tài liệu xác minh!");
          setLoading(false);
          return;
        }
        formData.append("Certificate", sellerCert);
      }

      await authApi.createSellerProfile(formData);
      toast.success("Gửi hồ sơ Người bán thành công!");
      setStep("submitted");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gửi hồ sơ thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBusiness = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !taxCode.trim()) {
      toast.error("Vui lòng điền đầy đủ Tên công ty và Mã số thuế!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("CompanyName", companyName.trim());
      formData.append("TaxCode", taxCode.trim());
      formData.append("Address", businessAddress.trim());
      if (businessLicense) {
        if (businessLicense.type !== "application/pdf" && !businessLicense.name.endsWith(".pdf")) {
          toast.error("Chỉ chấp nhận file định dạng PDF cho tài liệu xác minh!");
          setLoading(false);
          return;
        }
        formData.append("BusinessLicense", businessLicense);
      }

      await authApi.createBusinessProfile(formData);
      toast.success("Gửi hồ sơ Doanh nghiệp thành công!");
      setStep("submitted");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gửi hồ sơ thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    // Dismiss overlay by changing user status locally
    onStatusUpdated("submitted", "customer");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden transition-all duration-300 transform scale-100 my-auto">
        
        {/* Banner Decor */}
        <div className="h-3 bg-gradient-to-r from-cyan-500 via-[#00BCD4] to-[#0A2647] flex-shrink-0" />

        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
          {step === "select" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#0A2647" }}>
                  Chào mừng {user?.name || "bạn"}!
                </h2>
                <p className="text-gray-600 text-sm">
                  Tài khoản của bạn đã được khởi tạo. Vui lòng chọn vai trò để bắt đầu trải nghiệm hệ thống.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Option 1: Customer */}
                <button
                  onClick={handleSelectCustomer}
                  disabled={loading}
                  className="flex items-center gap-5 p-5 border border-gray-200 rounded-xl text-left hover:border-[#00BCD4] hover:bg-sky-50/50 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl group-hover:bg-cyan-100 transition-colors">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-1" style={{ color: "#0A2647" }}>
                      Người mua lẻ (Customer)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Mua hải sản tươi sống trực tiếp từ các hộ nuôi, thanh toán nhanh chóng và tiện lợi.
                    </p>
                  </div>
                </button>

                {/* Option 2: Seller */}
                <button
                  onClick={() => setStep("seller-form")}
                  disabled={loading}
                  className="flex items-center gap-5 p-5 border border-gray-200 rounded-xl text-left hover:border-[#00BCD4] hover:bg-sky-50/50 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-100 transition-colors">
                    <Store className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-1" style={{ color: "#0A2647" }}>
                      Người bán / Hộ nuôi (Seller)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Đăng bán sản lượng hải sản trực tiếp, tiếp cận các doanh nghiệp thu mua lớn toàn quốc.
                    </p>
                  </div>
                </button>

                {/* Option 3: Business/Buyer */}
                <button
                  onClick={() => setStep("buyer-form")}
                  disabled={loading}
                  className="flex items-center gap-5 p-5 border border-gray-200 rounded-xl text-left hover:border-[#00BCD4] hover:bg-sky-50/50 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-1" style={{ color: "#0A2647" }}>
                      Doanh nghiệp thu mua (Buyer)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tìm kiếm nguồn hải sản số lượng lớn, ký kết hợp đồng thương mại minh bạch.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Seller Profile Form */}
          {step === "seller-form" && (
            <form onSubmit={handleSubmitSeller} className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: "#0A2647" }}>
                    Hồ sơ Người bán / Hộ nuôi
                  </h3>
                  <p className="text-xs text-gray-500">Cung cấp thông tin trang trại nuôi trồng của bạn</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Tên trang trại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trang trại hải sản Minh Huy"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all bg-gray-50/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Địa chỉ trang trại
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đất Mũi, Ngọc Hiển, Cà Mau"
                  value={farmAddress}
                  onChange={(e) => setFarmAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all bg-gray-50/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Loại thủy hải sản chính
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tôm sú, Cua cà mau, Cá bớp"
                  value={aquacultureType}
                  onChange={(e) => setAquacultureType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all bg-gray-50/50 text-sm"
                />
              </div>

              {/* Thông tin tài khoản ngân hàng (Bắt buộc cho Payout) */}
              <div className="p-4 bg-cyan-50/50 border border-cyan-100 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <span>💳 Tài khoản nhận doanh thu bán hàng</span>
                  <span className="text-red-500">*</span>
                </h4>
                <p className="text-[11px] text-gray-500">
                  Hệ thống dùng thông tin này để tự động chi hộ 95% tiền bán hàng trực tiếp về tài khoản của bạn qua VietQR.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">
                      Ngân hàng thụ hưởng <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-white text-xs font-medium"
                    >
                      <option value="">-- Chọn ngân hàng --</option>
                      <option value="MB">MBBank (Ngân hàng Quân Đội)</option>
                      <option value="VCB">Vietcombank</option>
                      <option value="TCB">Techcombank</option>
                      <option value="CTG">VietinBank</option>
                      <option value="BIDV">BIDV</option>
                      <option value="VPB">VPBank</option>
                      <option value="VBA">Agribank</option>
                      <option value="ACB">ACB</option>
                      <option value="TPB">TPBank</option>
                      <option value="STB">Sacombank</option>
                      <option value="HDB">HDBank</option>
                      <option value="MSB">MSB</option>
                      <option value="OCB">OCB</option>
                      <option value="VIB">VIB</option>
                      <option value="SEAB">SeABank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">
                      Số tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 0987654321"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">
                    Tên chủ tài khoản (Viết hoa không dấu) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: NGUYEN VAN A"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-white text-xs font-semibold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Giấy chứng nhận nuôi trồng (PDF)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/30 hover:bg-gray-50 transition-all relative">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setSellerCert(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-white shadow-sm rounded-full text-cyan-600">
                      {sellerCert ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                    </div>
                    {sellerCert ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{sellerCert.name}</p>
                        <p className="text-xs text-gray-400">
                          {(sellerCert.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Kéo thả hoặc nhấn để chọn file PDF</p>
                        <p className="text-xs text-gray-400">Chỉ chấp nhận file chứng nhận định dạng PDF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 text-white font-semibold rounded-lg hover:opacity-95 transition-opacity flex justify-center items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: "#00BCD4" }}
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Gửi hồ sơ xác minh
                </button>
              </div>
            </form>
          )}

          {/* Business / Buyer Profile Form */}
          {step === "buyer-form" && (
            <form onSubmit={handleSubmitBusiness} className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: "#0A2647" }}>
                    Hồ sơ Doanh nghiệp thu mua
                  </h3>
                  <p className="text-xs text-gray-500">Cung cấp thông tin pháp lý doanh nghiệp của bạn</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Tên doanh nghiệp / công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công ty TNHH Thủy sản Mekong"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all bg-gray-50/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Mã số thuế <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mã số đăng ký kinh doanh / Mã số thuế"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all bg-gray-50/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Địa chỉ đăng ký doanh nghiệp
                </label>
                <input
                  type="text"
                  placeholder="Địa chỉ trụ sở chính"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all bg-gray-50/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                  Giấy phép đăng ký kinh doanh (PDF)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/30 hover:bg-gray-50 transition-all relative">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setBusinessLicense(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-white shadow-sm rounded-full text-cyan-600">
                      {businessLicense ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                    </div>
                    {businessLicense ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{businessLicense.name}</p>
                        <p className="text-xs text-gray-400">
                          {(businessLicense.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Kéo thả hoặc nhấn để chọn file PDF</p>
                        <p className="text-xs text-gray-400">Chỉ chấp nhận file giấy phép định dạng PDF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 text-white font-semibold rounded-lg hover:opacity-95 transition-opacity flex justify-center items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: "#00BCD4" }}
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Gửi hồ sơ xác minh
                </button>
              </div>
            </form>
          )}

          {/* Success Step */}
          {step === "submitted" && (
            <div className="text-center py-6">
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full animate-bounce">
                  <CheckCircle className="w-16 h-16" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#0A2647" }}>
                Gửi hồ sơ thành công!
              </h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Ban quản trị hệ thống VAM Seafood sẽ tiến hành thẩm định và phê duyệt thông tin đăng ký của bạn. Bạn có thể tạm thời tham khảo các sản phẩm với tư cách Người mua lẻ.
              </p>
              <button
                onClick={handleFinish}
                className="w-full py-3.5 text-white font-bold rounded-lg hover:opacity-95 transition-all shadow-md cursor-pointer"
                style={{ backgroundColor: "#00BCD4" }}
              >
                Khám phá Trang chủ ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
