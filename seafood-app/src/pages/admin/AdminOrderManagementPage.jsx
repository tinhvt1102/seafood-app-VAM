import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Package,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Calendar,
  User,
  ShoppingBag,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";

// MOCK DATA: Hệ thống đơn hàng toàn cục dành cho admin theo dõi
const initialOrders = [
  {
    id: "1",
    orderCode: "ORD-2026-001",
    buyer: "Công ty TNHH XNK Thủy sản",
    buyerEmail: "xnkthuysan@b2b.com",
    buyerType: "B2B / Doanh nghiệp",
    seller: "Hợp tác xã Thủy sản Cần Thơ",
    items: "Tôm sú size 20-25 (500kg)",
    itemsList: [
      { name: "Tôm sú size 20-25", quantity: "500 kg", price: 420000, total: 210000000 }
    ],
    value: 210000000,
    date: "2026-06-07",
    time: "14:23",
    status: "new",
    paymentStatus: "pending",
    paymentMethod: "Chuyển khoản Ngân hàng",
    shippingAddress: "Cảng Cát Lái, Quận 2, TP. Hồ Chí Minh",
    logs: [
      { time: "2026-06-07 14:23", message: "Đơn hàng được khởi tạo bởi người mua" }
    ]
  },
  {
    id: "2",
    orderCode: "ORD-2026-002",
    buyer: "Nhà hàng Hải Sản Ngon",
    buyerEmail: "haisanngon@contact.com",
    buyerType: "B2B / Doanh nghiệp",
    seller: "Vựa hải sản Minh Phú",
    items: "Cá Tra phi lê (200kg)",
    itemsList: [
      { name: "Cá Tra phi lê đông lạnh", quantity: "200 kg", price: 75000, total: 15000000 }
    ],
    value: 15000000,
    date: "2026-06-06",
    time: "09:15",
    status: "new",
    paymentStatus: "pending",
    paymentMethod: "COD (Thanh toán khi giao nhận)",
    shippingAddress: "128 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh",
    logs: [
      { time: "2026-06-06 09:15", message: "Đơn hàng được đặt thành công" }
    ]
  },
  {
    id: "3",
    orderCode: "ORD-2026-003",
    buyer: "Nguyễn Văn Hùng",
    buyerEmail: "hungnv@gmail.com",
    buyerType: "B2C / Mua lẻ",
    seller: "Nông trại tôm sạch Bến Tre",
    items: "Tôm thẻ chân trắng (3kg), Cá bớp cắt lát (2kg)",
    itemsList: [
      { name: "Tôm thẻ chân trắng size 30", quantity: "3 kg", price: 180000, total: 540000 },
      { name: "Cá bớp tươi cắt lát", quantity: "2 kg", price: 320000, total: 640000 }
    ],
    value: 1180000,
    date: "2026-06-05",
    time: "17:45",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Chuyển khoản (VietQR)",
    shippingAddress: "Chung cư Sunrise City, Quận 7, TP. Hồ Chí Minh",
    logs: [
      { time: "2026-06-05 17:45", message: "Khách hàng tạo đơn hàng lẻ" },
      { time: "2026-06-05 17:50", message: "Thanh toán thành công qua cổng VietQR" },
      { time: "2026-06-06 08:00", message: "Người bán xác nhận và chuẩn bị hàng" }
    ]
  },
  {
    id: "4",
    orderCode: "ORD-2026-004",
    buyer: "Siêu thị Co.op Mart",
    buyerEmail: "purchasing@coopmart.vn",
    buyerType: "B2B / Doanh nghiệp",
    seller: "Công ty Thủy sản Miền Tây",
    items: "Tôm thẻ size 40-50 (300kg)",
    itemsList: [
      { name: "Tôm thẻ chân trắng size 40-50", quantity: "300 kg", price: 280000, total: 84000000 }
    ],
    value: 84000000,
    date: "2026-06-05",
    time: "10:30",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Chuyển khoản Ngân hàng",
    shippingAddress: "Tổng kho Saigon Co.op, Bình Dương",
    logs: [
      { time: "2026-06-05 10:30", message: "Đơn hàng sỉ B2B được khởi tạo" },
      { time: "2026-06-05 11:00", message: "Kế toán xác nhận nhận đủ tiền chuyển khoản" },
      { time: "2026-06-05 14:00", message: "Người bán tiến hành đóng gói" }
    ]
  },
  {
    id: "5",
    orderCode: "ORD-2026-005",
    buyer: "Nhà máy chế biến Minh Phát",
    buyerEmail: "minhphat_factory@gmail.com",
    buyerType: "B2B / Doanh nghiệp",
    seller: "HTX Cá Tra Hồng Ngự",
    items: "Cá Basa nguyên con (800kg)",
    itemsList: [
      { name: "Cá Basa nguyên con làm sạch", quantity: "800 kg", price: 68000, total: 54400000 }
    ],
    value: 54400000,
    date: "2026-06-04",
    time: "08:20",
    status: "shipping",
    paymentStatus: "paid",
    paymentMethod: "Chuyển khoản Ngân hàng",
    shippingAddress: "KCN Sông Hậu, Châu Thành, Hậu Giang",
    logs: [
      { time: "2026-06-04 08:20", message: "Đơn hàng B2B tạo thành công" },
      { time: "2026-06-04 09:00", message: "Xác nhận thanh toán từ phía ngân hàng" },
      { time: "2026-06-04 16:30", message: "Đang vận chuyển từ An Giang đi Hậu Giang" }
    ]
  },
  {
    id: "6",
    orderCode: "ORD-2026-006",
    buyer: "Trần Thị Lan",
    buyerEmail: "lantt99@yahoo.com",
    buyerType: "B2C / Mua lẻ",
    seller: "Vựa hải sản Kỳ Đồng",
    items: "Cua gạch Cà Mau (2kg)",
    itemsList: [
      { name: "Cua gạch Cà Mau loại 1", quantity: "2 kg", price: 450000, total: 900000 }
    ],
    value: 900000,
    date: "2026-06-03",
    time: "19:10",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "COD (Thanh toán khi giao nhận)",
    shippingAddress: "45/12 Cao Thắng, Quận 3, TP. Hồ Chí Minh",
    logs: [
      { time: "2026-06-03 19:10", message: "Đơn hàng lẻ tạo mới" },
      { time: "2026-06-04 09:00", message: "Người bán đóng hàng giao shipper" },
      { time: "2026-06-04 14:20", message: "Shipper giao hàng thành công và thu tiền mặt" },
      { time: "2026-06-04 14:30", message: "Đơn hàng hoàn tất" }
    ]
  },
  {
    id: "7",
    orderCode: "ORD-2026-007",
    buyer: "Công ty CP Thực phẩm Sài Gòn",
    buyerEmail: "sgfood@contact.com",
    buyerType: "B2B / Doanh nghiệp",
    seller: "Vựa Cua Năm Căn Cà Mau",
    items: "Cua biển Cà Mau sỉ (100kg)",
    itemsList: [
      { name: "Cua thịt Cà Mau dây mỏng sỉ", quantity: "100 kg", price: 350000, total: 35000000 }
    ],
    value: 35000000,
    date: "2026-06-03",
    time: "15:40",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Chuyển khoản Ngân hàng",
    shippingAddress: "KCN Tân Bình, Tân Phú, TP. Hồ Chí Minh",
    logs: [
      { time: "2026-06-03 15:40", message: "Đơn hàng B2B tạo mới" },
      { time: "2026-06-03 16:00", message: "Đã thanh toán tiền cọc 100%" },
      { time: "2026-06-04 10:00", message: "Bắt đầu giao hàng" },
      { time: "2026-06-04 17:00", message: "Khách kiểm đếm nhận hàng và hoàn thành đơn" }
    ]
  },
  {
    id: "8",
    orderCode: "ORD-2026-008",
    buyer: "Phạm Minh Trí",
    buyerEmail: "mitri88@gmail.com",
    buyerType: "B2C / Mua lẻ",
    seller: "HTX Bạch Long Vĩ",
    items: "Mực lá đại dương (4kg)",
    itemsList: [
      { name: "Mực lá đại dương cấp đông siêu nhanh", quantity: "4 kg", price: 290000, total: 1160000 }
    ],
    value: 1160000,
    date: "2026-06-02",
    time: "11:20",
    status: "rejected",
    paymentStatus: "refunded",
    paymentMethod: "Chuyển khoản Ngân hàng",
    shippingAddress: "32 Lý Thường Kiệt, Hải Phòng",
    logs: [
      { time: "2026-06-02 11:20", message: "Đơn hàng được khởi tạo lẻ" },
      { time: "2026-06-02 11:30", message: "Khách đã thanh toán chuyển khoản trước" },
      { time: "2026-06-02 13:00", message: "Người bán báo hết hàng mực lá size lớn, từ chối đơn hàng" },
      { time: "2026-06-02 15:00", message: "Hệ thống tự động hoàn trả 100% tiền cho khách hàng" }
    ]
  }
];

export function AdminOrderManagementPage({ onNavigate }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  
  // Chi tiết đơn hàng hiển thị trong modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const pageSize = 6;

  // Tính toán số liệu thống kê chung
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.value, 0);
  
  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === "new").length,
    processing: orders.filter(o => o.status === "processing" || o.status === "shipping").length,
    completed: orders.filter(o => o.status === "completed").length,
    rejected: orders.filter(o => o.status === "rejected").length,
  };

  // Lọc danh sách đơn hàng
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    const matchesBuyerType =
      buyerTypeFilter === "all"
        ? true
        : buyerTypeFilter === "B2B"
        ? order.buyerType.includes("B2B")
        : order.buyerType.includes("B2C");

    const matchesPayment =
      paymentFilter === "all" ? true : order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesBuyerType && matchesPayment;
  });

  // Chia trang
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPageNum - 1) * pageSize,
    currentPageNum * pageSize
  );

  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, statusFilter, buyerTypeFilter, paymentFilter]);

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "new":
        return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Mới" };
      case "processing":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "Đang xử lý" };
      case "shipping":
        return { bg: "bg-indigo-100", text: "text-indigo-700", label: "Đang giao hàng" };
      case "completed":
        return { bg: "bg-green-100", text: "text-green-700", label: "Đã hoàn thành" };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-700", label: "Đã hủy đơn" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: status };
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-700", label: "Chờ thanh toán" };
      case "paid":
        return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Đã thanh toán" };
      case "refunded":
        return { bg: "bg-purple-100", text: "text-purple-700", label: "Đã hoàn tiền" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: status };
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 mb-8 py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Hệ thống giám sát
              </span>
              <h1 className="text-2xl font-bold text-[#0A2647] tracking-tight">
                Giám sát Đơn hàng Toàn quốc
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              Trang thông tin dành riêng cho Admin theo dõi luồng đặt hàng và thanh toán trên toàn hệ thống Seafood VAM.
            </p>
          </div>
          <button
            onClick={() => onNavigate?.("admin-dashboard")}
            className="self-start md:self-auto px-4 py-2 border rounded-full text-sm font-semibold transition-all hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
            style={{ borderColor: "#0A2647", color: "#0A2647" }}
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {/* Revenue */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-cyan-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Doanh thu giao dịch</span>
              <DollarSign className="w-5 h-5 text-cyan-600" />
            </div>
            <p className="text-2xl font-bold text-[#0A2647] truncate">
              {totalRevenue.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Đơn hoàn thành được ghi nhận</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tổng số đơn hàng</span>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-[#0A2647]">{stats.total}</p>
            <p className="text-[11px] text-gray-500 mt-1">Lượng đơn hàng phát sinh</p>
          </div>

          {/* New Orders */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Đơn mới chờ duyệt</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-[#0A2647]">{stats.new}</p>
            <p className="text-[11px] text-gray-500 mt-1">Cần người bán xác nhận</p>
          </div>

          {/* Processing / Shipping */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Đang giao dịch</span>
              <Truck className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-[#0A2647]">{stats.processing}</p>
            <p className="text-[11px] text-gray-500 mt-1">Đang sơ chế & vận chuyển</p>
          </div>

          {/* Canceled */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Đơn đã từ chối</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-[#0A2647]">{stats.rejected}</p>
            <p className="text-[11px] text-gray-500 mt-1">Gồm đơn hoàn tiền / huỷ</p>
          </div>
        </div>

        {/* Filters and Table Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mã đơn, khách hàng, sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all bg-white"
                  style={{ borderColor: "#e5e7eb" }}
                />
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "new", label: "Đơn mới" },
                  { id: "processing", label: "Đang xử lý" },
                  { id: "shipping", label: "Đang giao" },
                  { id: "completed", label: "Đã xong" },
                  { id: "rejected", label: "Đã hủy" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      backgroundColor: statusFilter === tab.id ? "#0A2647" : "#F3F4F6",
                      color: statusFilter === tab.id ? "#FFFFFF" : "#4B5563",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-4 pt-1.5 border-t border-gray-100/70">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Lọc chi tiết:</span>
              </div>

              {/* Loại giao dịch */}
              <select
                value={buyerTypeFilter}
                onChange={(e) => setBuyerTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
              >
                <option value="all">Mọi loại giao dịch</option>
                <option value="B2B">Chỉ sỉ B2B / Doanh nghiệp</option>
                <option value="B2C">Chỉ lẻ B2C / Người mua lẻ</option>
              </select>

              {/* Trạng thái thanh toán */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
              >
                <option value="all">Mọi trạng thái thanh toán</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="refunded">Đã hoàn tiền</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "#e5e7eb" }}>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Ngày & Giờ đặt
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Khách hàng / Đối tác
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Tóm tắt đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Giá trị giao dịch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Trạng thái đơn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Thanh toán
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: "#0A2647" }}>
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không có đơn hàng nào khớp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const statusBadge = getOrderStatusBadge(order.status);
                    const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Order Code */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm" style={{ color: "#0A2647" }}>
                              {order.orderCode}
                            </span>
                            <span className="text-[10px] text-[#00BCD4] font-semibold">
                              {order.buyerType}
                            </span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{order.date}</span>
                            <span className="text-gray-400">|</span>
                            <span className="font-medium text-gray-500">{order.time}</span>
                          </div>
                        </td>

                        {/* Buyer */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col max-w-[180px]">
                            <span className="font-semibold text-sm text-gray-800 truncate" title={order.buyer}>
                              {order.buyer}
                            </span>
                            <span className="text-xs text-gray-500 truncate" title={order.buyerEmail}>
                              {order.buyerEmail}
                            </span>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-600 line-clamp-2" title={order.items}>
                            {order.items}
                          </span>
                        </td>

                        {/* Total Value */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            {order.value.toLocaleString("vi-VN")}đ
                          </span>
                        </td>

                        {/* Order Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block uppercase tracking-wider ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Payment Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold inline-block text-center ${paymentBadge.bg} ${paymentBadge.text}`}>
                              {paymentBadge.label}
                            </span>
                            <span className="text-[10px] text-gray-400 text-center font-medium">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleOpenDetail(order)}
                            className="p-1.5 hover:bg-cyan-50 hover:text-[#00BCD4] rounded-md transition-colors text-gray-500 cursor-pointer inline-flex items-center justify-center"
                            title="Giám sát chi tiết"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-xs text-gray-500 font-semibold">
                Hiển thị {paginatedOrders.length} trên tổng số {filteredOrders.length} đơn hàng
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum(prev => prev - 1)}
                  className="p-1.5 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPageNum(i + 1)}
                    className="w-8 h-8 rounded text-xs font-bold transition-all border"
                    style={{
                      backgroundColor: currentPageNum === i + 1 ? "#0A2647" : "#FFFFFF",
                      color: currentPageNum === i + 1 ? "#FFFFFF" : "#374151",
                      borderColor: currentPageNum === i + 1 ? "#0A2647" : "#E5E7EB",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPageNum === totalPages}
                  onClick={() => setCurrentPageNum(prev => prev + 1)}
                  className="p-1.5 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "#f3f4f6" }}>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-lg text-[#0A2647]">
                  Chi tiết đơn hàng {selectedOrder.orderCode}
                </h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Order Status & Payment Status overview */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Trạng thái đơn</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getOrderStatusBadge(selectedOrder.status).bg} ${getOrderStatusBadge(selectedOrder.status).text}`}>
                    {getOrderStatusBadge(selectedOrder.status).label}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Trạng thái thanh toán</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getPaymentStatusBadge(selectedOrder.paymentStatus).bg} ${getPaymentStatusBadge(selectedOrder.paymentStatus).text}`}>
                    {getPaymentStatusBadge(selectedOrder.paymentStatus).label}
                  </span>
                </div>
              </div>

              {/* Buyer & Seller information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-1.5 text-[#0A2647]">
                    <User className="w-4 h-4 text-cyan-600" /> Người Mua Hàng
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="font-semibold text-gray-800 text-sm">{selectedOrder.buyer}</p>
                    <p>Email: {selectedOrder.buyerEmail}</p>
                    <p>Hình thức: {selectedOrder.buyerType}</p>
                    <p className="pt-1.5 text-gray-500">
                      <strong>Địa chỉ nhận hàng:</strong><br />
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-1.5 text-[#0A2647]">
                    <ShoppingBag className="w-4 h-4 text-cyan-600" /> Đơn vị cung cấp (Người Bán)
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="font-semibold text-gray-800 text-sm">{selectedOrder.seller}</p>
                    <p className="text-gray-400 italic">Nhà vườn cung cấp trực tiếp trên Seafood VAM</p>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h4 className="font-bold text-sm mb-3 text-[#0A2647]">
                  Danh sách sản phẩm mua
                </h4>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-600 font-semibold">Tên sản phẩm</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-semibold">Đơn giá</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-semibold">Số lượng</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-semibold">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedOrder.itemsList ? (
                        selectedOrder.itemsList.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {item.price.toLocaleString("vi-VN")}đ
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 font-medium">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                              {item.total.toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-gray-600">{selectedOrder.items}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-100 font-semibold">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-gray-600">Tổng giá trị đơn hàng:</td>
                        <td className="px-4 py-2 text-right text-sm font-bold" style={{ color: "#d4183d" }}>
                          {selectedOrder.value.toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Activity Logs Timeline */}
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-1.5 text-[#0A2647]">
                  <CreditCard className="w-4 h-4 text-cyan-600" /> Nhật ký trạng thái (Hệ thống giám sát)
                </h4>
                <div className="relative pl-4 border-l border-gray-200 ml-2 space-y-4">
                  {selectedOrder.logs.map((log, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[21px] mt-1.5 bg-[#00BCD4] w-2.5 h-2.5 rounded-full border border-white" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium">{log.time}</span>
                        <span className="text-xs text-gray-700 font-semibold mt-0.5">{log.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end" style={{ borderColor: "#f3f4f6" }}>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
