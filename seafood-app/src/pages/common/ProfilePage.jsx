import { useState, useEffect } from "react";
import { User, Store, Briefcase, Mail, Phone, MapPin, Shield, CheckCircle2, AlertCircle, Clock, FileText, Upload, Loader2, Package, ArrowRight } from "lucide-react";
import { authApi } from "../../api/auth";
import { toast } from "react-hot-toast";

export function ProfilePage({ user, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Profile data from backend
  const [sellerProfile, setSellerProfile] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  
  // Upgrade forms state
  const [showUpgradeForm, setShowUpgradeForm] = useState(null); // null | 'seller' | 'buyer'
  
  // Upgrade form inputs
  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [aquacultureType, setAquacultureType] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [sellerCert, setSellerCert] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessLicense, setBusinessLicense] = useState(null);

  const fetchProfileData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Get latest user data
      const latestUser = await authApi.getUserById(user.id);
      setUserData(latestUser);

      // 2. Fetch specific profile according to user role or try fetching both to check status
      try {
        const sProf = await authApi.getMySellerProfile();
        setSellerProfile(sProf);
      } catch (err) {
        // Not found is fine
        if (err.status !== 404) console.error("Seller profile check failed:", err);
      }

      try {
        const bProf = await authApi.getMyBusinessProfile();
        setBusinessProfile(bProf);
      } catch (err) {
        // Not found is fine
        if (err.status !== 404) console.error("Business profile check failed:", err);
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
      toast.error("Không thể tải thông tin tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleSubmitSeller = async (e) => {
    e.preventDefault();
    if (!farmName.trim()) {
      toast.error("Vui lòng điền tên trang trại!");
      return;
    }

    if (!bankName.trim() || !accountNumber.trim() || !accountHolderName.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin tài khoản ngân hàng (Tên ngân hàng, Số TK, Chủ TK) để nhận tiền doanh thu tự động!");
      return;
    }

    setSubmitting(true);
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
          toast.error("Chỉ chấp nhận file tài liệu dạng PDF!");
          setSubmitting(false);
          return;
        }
        formData.append("Certificate", sellerCert);
      }

      await authApi.createSellerProfile(formData);
      toast.success("Gửi hồ sơ đăng ký Hộ nuôi thành công! Vui lòng chờ kiểm duyệt.");
      setShowUpgradeForm(null);
      fetchProfileData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gửi hồ sơ thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitBusiness = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !taxCode.trim()) {
      toast.error("Vui lòng điền đầy đủ Tên công ty và Mã số thuế!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("CompanyName", companyName.trim());
      formData.append("TaxCode", taxCode.trim());
      formData.append("Address", businessAddress.trim());
      if (businessLicense) {
        if (businessLicense.type !== "application/pdf" && !businessLicense.name.endsWith(".pdf")) {
          toast.error("Chỉ chấp nhận file tài liệu dạng PDF!");
          setSubmitting(false);
          return;
        }
        formData.append("BusinessLicense", businessLicense);
      }

      await authApi.createBusinessProfile(formData);
      toast.success("Gửi hồ sơ đăng ký Doanh nghiệp thành công! Vui lòng chờ kiểm duyệt.");
      setShowUpgradeForm(null);
      fetchProfileData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gửi hồ sơ thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  // Get active role text & badge styling
  const getRoleBadge = (role) => {
    const r = role?.toLowerCase();
    if (r === "admin") return { text: "Quản trị viên", style: "bg-red-100 text-red-700 border-red-200" };
    if (r === "seller" || r === "farmer") return { text: "Người bán / Hộ nuôi", style: "bg-teal-100 text-teal-700 border-teal-200" };
    if (r === "buyer" || r === "business") return { text: "Doanh nghiệp mua", style: "bg-blue-100 text-blue-700 border-blue-200" };
    return { text: "Người mua lẻ", style: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "active" || s === "approved") return { text: "Hoạt động / Đã duyệt", style: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 };
    if (s === "pending") return { text: "Chờ phê duyệt", style: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock };
    return { text: "Bị từ chối / Khóa", style: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle };
  };

  const roleBadge = getRoleBadge(userData?.role);
  const statusBadge = getStatusBadge(userData?.status);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50/50 min-h-[80vh]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-[#0A2647] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            
            <h3 className="text-xl font-bold mb-1" style={{ color: "#0A2647" }}>
              {userData?.name || "Người dùng"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{userData?.email}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleBadge.style}`}>
                {roleBadge.text}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusBadge.style}`}>
                <statusBadge.icon className="w-3.5 h-3.5" />
                {statusBadge.text}
              </span>
            </div>

            {/* Quick stats / info */}
            <div className="w-full border-t border-gray-100 pt-6 text-left space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Email đăng ký</p>
                  <p className="font-medium text-gray-800">{userData?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Số điện thoại</p>
                  <p className="font-medium text-gray-800">{userData?.phone || "Chưa cập nhật"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Địa chỉ liên hệ</p>
                  <p className="font-medium text-gray-800">{userData?.address || "Chưa cập nhật"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Order History Card for Customer / Buyer */}
          {(['buyer', 'customer', 'business'].includes(userData?.role?.toLowerCase() || '')) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-50 text-[#00BCD4] rounded-xl border border-cyan-100">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base" style={{ color: "#0A2647" }}>
                      Đơn hàng của tôi
                    </h4>
                    <p className="text-xs text-gray-400">Theo dõi tiến trình các đơn mua</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Xem lịch sử các đơn hàng hải sản đã đặt, chi tiết vận chuyển và trạng thái cập nhật mới nhất.
              </p>

              <button
                onClick={() => onNavigate?.('order-management')}
                className="w-full py-2.5 bg-gradient-to-r from-[#0A2647] to-slate-800 hover:from-[#0D3866] hover:to-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm mt-1"
              >
                <span>Xem lịch sử đơn hàng</span>
                <ArrowRight className="w-4 h-4 text-[#00BCD4]" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Profile details & verification status */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Business/Seller Profiles Display */}
          {(sellerProfile || businessProfile) ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-lg font-bold border-b pb-3" style={{ color: "#0A2647" }}>
                Hồ sơ định danh & Đối tác
              </h3>

              {/* Seller Profile section */}
              {sellerProfile && (
                <div className="bg-gradient-to-br from-teal-50/30 to-sky-50/30 p-5 rounded-xl border border-teal-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-teal-700">
                      <Store className="w-5 h-5" />
                      <span className="font-bold">Hồ sơ Người bán / Hộ nuôi</span>
                    </div>
                    {(() => {
                      const badge = getStatusBadge(sellerProfile.status);
                      return (
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 border bg-white ${badge.style}`}>
                          <badge.icon className="w-3.5 h-3.5" />
                          {badge.text}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Tên trang trại</p>
                      <p className="font-semibold text-gray-800">{sellerProfile.farmName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Loại hải sản nuôi trồng</p>
                      <p className="font-semibold text-gray-800">{sellerProfile.aquacultureType || "Không xác định"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-400">Địa chỉ trang trại</p>
                      <p className="font-semibold text-gray-800">{sellerProfile.farmAddress || "Chưa cập nhật"}</p>
                    </div>
                    <div className="md:col-span-2 pt-2 border-t border-teal-100/80">
                      <p className="text-xs font-bold text-teal-800 mb-1">💳 Tài khoản nhận doanh thu (Payout)</p>
                      <p className="text-xs text-gray-700">
                        Ngân hàng: <strong>{sellerProfile.bankName || "Chưa cập nhật"}</strong> | STK: <strong>{sellerProfile.accountNumber || "N/A"}</strong> | Chủ TK: <strong>{sellerProfile.accountHolderName || "N/A"}</strong>
                      </p>
                    </div>
                    {sellerProfile.certificate && (
                      <div className="md:col-span-2 pt-2">
                        <p className="text-xs text-gray-400 mb-1.5">Tài liệu đính kèm (Giấy chứng nhận)</p>
                        <a
                          href={sellerProfile.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-cyan-600 hover:text-cyan-700 hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-red-500" />
                          Xem Giấy chứng nhận nuôi trồng (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Business Profile section */}
              {businessProfile && (
                <div className="bg-gradient-to-br from-blue-50/30 to-indigo-50/30 p-5 rounded-xl border border-blue-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Briefcase className="w-5 h-5" />
                      <span className="font-bold">Hồ sơ Doanh nghiệp mua</span>
                    </div>
                    {(() => {
                      const badge = getStatusBadge(businessProfile.status);
                      return (
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 border bg-white ${badge.style}`}>
                          <badge.icon className="w-3.5 h-3.5" />
                          {badge.text}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Tên doanh nghiệp / công ty</p>
                      <p className="font-semibold text-gray-800">{businessProfile.companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Mã số thuế</p>
                      <p className="font-semibold text-gray-800">{businessProfile.taxCode}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-400">Địa chỉ đăng ký kinh doanh</p>
                      <p className="font-semibold text-gray-800">{businessProfile.address || "Chưa cập nhật"}</p>
                    </div>
                    {businessProfile.businessLicense && (
                      <div className="md:col-span-2 pt-2">
                        <p className="text-xs text-gray-400 mb-1.5">Tài liệu đính kèm (Giấy phép kinh doanh)</p>
                        <a
                          href={businessProfile.businessLicense}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-cyan-600 hover:text-cyan-700 hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-red-500" />
                          Xem Giấy phép đăng ký kinh doanh (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Customer role - promotion options
            userData?.role?.toLowerCase() === "customer" && !showUpgradeForm && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                <h3 className="text-lg font-bold border-b pb-3 text-gray-800">
                  Nâng cấp vai trò tài khoản
                </h3>
                <p className="text-sm text-gray-600">
                  Bạn đang sử dụng tài khoản Người mua lẻ. Bạn có muốn trở thành Người bán để đăng sản lượng hoặc trở thành đối tác Doanh nghiệp để giao dịch số lượng lớn?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => setShowUpgradeForm("seller")}
                    className="p-5 border border-dashed border-teal-300 rounded-xl hover:bg-teal-50/40 text-left transition-colors cursor-pointer"
                  >
                    <Store className="w-8 h-8 text-teal-600 mb-3" />
                    <h4 className="font-bold text-teal-800 mb-1">Trở thành Hộ nuôi / Người bán</h4>
                    <p className="text-xs text-gray-500">Đăng tin sản lượng, quản lý đơn hàng và mở rộng tệp đối tác.</p>
                  </button>

                  <button
                    onClick={() => setShowUpgradeForm("buyer")}
                    className="p-5 border border-dashed border-blue-300 rounded-xl hover:bg-blue-50/40 text-left transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="font-bold text-blue-800 mb-1">Đăng ký Doanh nghiệp mua</h4>
                    <p className="text-xs text-gray-500">Mua sỉ số lượng lớn, thương lượng hợp đồng trực tiếp.</p>
                  </button>
                </div>
              </div>
            )
          )}

          {/* Upgrade Form Container */}
          {showUpgradeForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold" style={{ color: "#0A2647" }}>
                  {showUpgradeForm === "seller" ? "Đăng ký vai trò Người bán / Hộ nuôi" : "Đăng ký vai trò Doanh nghiệp mua"}
                </h3>
                <button
                  onClick={() => setShowUpgradeForm(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 border px-2.5 py-1 rounded"
                >
                  Hủy bỏ
                </button>
              </div>

              {showUpgradeForm === "seller" ? (
                <form onSubmit={handleSubmitSeller} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                      Tên trang trại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Trang trại Minh Huy"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                      Địa chỉ trang trại
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Đất Mũi, Cà Mau"
                      value={farmAddress}
                      onChange={(e) => setFarmAddress(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                      Loại thủy hải sản chính
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Tôm sú, Cua xanh"
                      value={aquacultureType}
                      onChange={(e) => setAquacultureType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50 text-sm"
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
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center bg-gray-50/30 hover:bg-gray-50 transition-all relative">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setSellerCert(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-2.5 bg-white shadow-sm rounded-full text-cyan-600">
                          {sellerCert ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                        </div>
                        {sellerCert ? (
                          <p className="text-sm font-semibold text-gray-700">{sellerCert.name}</p>
                        ) : (
                          <p className="text-xs text-gray-500">Nhấp hoặc kéo thả file chứng nhận PDF tại đây</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 text-white font-bold rounded-lg hover:opacity-95 transition-opacity flex justify-center items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: "#00BCD4" }}
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    Gửi hồ sơ đăng ký Người bán
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmitBusiness} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                      Tên công ty / doanh nghiệp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Công ty Thủy sản Hùng Vương"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                      Mã số thuế <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mã số thuế doanh nghiệp"
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                      Địa chỉ doanh nghiệp
                    </label>
                    <input
                      type="text"
                      placeholder="Địa chỉ trụ sở chính"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A2647" }}>
                      Giấy phép đăng ký kinh doanh (PDF)
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center bg-gray-50/30 hover:bg-gray-50 transition-all relative">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setBusinessLicense(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-2.5 bg-white shadow-sm rounded-full text-cyan-600">
                          {businessLicense ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                        </div>
                        {businessLicense ? (
                          <p className="text-sm font-semibold text-gray-700">{businessLicense.name}</p>
                        ) : (
                          <p className="text-xs text-gray-500">Nhấp hoặc kéo thả file đăng ký kinh doanh PDF tại đây</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 text-white font-bold rounded-lg hover:opacity-95 transition-opacity flex justify-center items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: "#00BCD4" }}
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    Gửi hồ sơ đăng ký Doanh nghiệp
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
