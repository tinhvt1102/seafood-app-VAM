import { useState, useEffect, useCallback } from "react";
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
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { ordersApi } from "../../api/orders";

/**
 * Hàm chuẩn hóa thông tin đơn hàng từ API Backend VAM (OrderDto)
 */
const normalizeOrder = (raw) => {
  const orderId = raw.id || raw.orderCode || "0";
  const rawDate = raw.orderDate || raw.date || new Date().toISOString();
  let formattedDate = "N/A";
  let formattedTime = "";
  try {
    const d = new Date(rawDate);
    formattedDate = d.toLocaleDateString("vi-VN");
    formattedTime = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    formattedDate = raw.date || "N/A";
    formattedTime = raw.time || "";
  }

  const rawStatus = (raw.status || "pending").toLowerCase();

  // Chuẩn hóa danh sách sản phẩm trong đơn hàng
  const rawItems = raw.orderItems || raw.itemsList || [];
  const itemsList = Array.isArray(rawItems)
    ? rawItems.map((item) => {
        const pName = item.productName || item.name || "Thủy hải sản";
        const q = item.quantity !== undefined ? item.quantity : 1;
        const p = item.price || 0;
        const total = item.total !== undefined ? item.total : p * q;
        const img = item.productImageUrls || item.imageUrl || null;
        return {
          id: item.id || item.productId,
          name: pName,
          quantity: typeof q === "number" ? `${q} kg` : `${q}`,
          price: p,
          total: total,
          imageUrl: img,
        };
      })
    : [];

  const itemsSummary =
    raw.items ||
    (itemsList.length > 0
      ? itemsList.map((i) => `${i.name} (${i.quantity})`).join(", ")
      : "Sản phẩm hải sản");

  const totalValue = raw.totalPrice || raw.value || 0;

  let paymentStatus = raw.paymentStatus || "pending";
  if (rawStatus === "completed") paymentStatus = "paid";
  else if (rawStatus === "cancelled" || rawStatus === "rejected") paymentStatus = "refunded";

  const buyerName = raw.buyerName || raw.buyer || `Khách hàng #${raw.buyerId || orderId}`;

  return {
    id: raw.id,
    orderCode: raw.orderCode || `ORD-2026-${String(orderId).padStart(3, "0")}`,
    buyer: buyerName,
    buyerEmail: raw.buyerEmail || `buyer_${raw.buyerId || orderId}@vam.vn`,
    buyerPhone: raw.buyerPhone || null,
    buyerType: raw.buyerType || (totalValue >= 10000000 ? "B2B / Doanh nghiệp" : "B2C / Mua lẻ"),
    seller: raw.seller || "Hợp tác xã Hải Sản VAM",
    items: itemsSummary,
    itemsList: itemsList,
    value: totalValue,
    date: formattedDate,
    time: formattedTime,
    status: rawStatus,
    paymentStatus: paymentStatus,
    paymentMethod: raw.paymentMethod || "Chuyển khoản (VietQR / Ngân hàng)",
    shippingAddress: raw.shippingAddress || "Chưa cập nhật địa chỉ giao hàng",
    logs: raw.logs || [
      { time: `${formattedDate} ${formattedTime}`, message: "Đơn hàng khởi tạo thành công trên hệ thống" },
      ...(rawStatus !== "pending"
        ? [{ time: "Cập nhật hệ thống", message: `Trạng thái hiện tại: ${rawStatus.toUpperCase()}` }]
        : []),
    ],
  };
};

export function AdminOrderManagementPage({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Searching
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Chi tiết đơn hàng trong Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Phân trang
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const pageSize = 6;

  // Lấy dữ liệu từ API Orders Backend
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getAllOrders({
        pageNumber: currentPageNum,
        pageSize: 50, // Lấy danh sách đủ để lọc client-side nếu cần
        search: searchTerm,
      });

      let items = [];
      let total = 0;

      if (res && Array.isArray(res.items)) {
        items = res.items;
        total = res.totalCount || res.items.length;
      } else if (Array.isArray(res)) {
        items = res;
        total = res.length;
      }

      const normalized = items.map(normalizeOrder);
      setOrders(normalized);
      setTotalCount(total);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn hàng:", err);
      setError(err.message || "Không thể tải danh sách đơn hàng từ API máy chủ.");
      toast.error("Không thể kết nối API quản lý đơn hàng");
    } finally {
      setIsLoading(false);
    }
  }, [currentPageNum, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Tính toán số liệu thống kê chung dựa trên dữ liệu hiện tại
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.value, 0);

  const stats = {
    total: orders.length,
    new: orders.filter((o) => o.status === "pending" || o.status === "new").length,
    processing: orders.filter(
      (o) => o.status === "confirmed" || o.status === "processing" || o.status === "shipping"
    ).length,
    completed: orders.filter((o) => o.status === "completed").length,
    rejected: orders.filter((o) => o.status === "cancelled" || o.status === "rejected").length,
  };

  // Lọc danh sách đơn hàng client-side
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "new"
        ? order.status === "pending" || order.status === "new"
        : statusFilter === "processing"
        ? order.status === "confirmed" || order.status === "processing"
        : statusFilter === "shipping"
        ? order.status === "shipping"
        : statusFilter === "completed"
        ? order.status === "completed"
        : statusFilter === "rejected"
        ? order.status === "cancelled" || order.status === "rejected"
        : order.status === statusFilter;

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

  // Chia trang client-side
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
      case "pending":
      case "new":
        return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Mới" };
      case "confirmed":
      case "processing":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "Đã xác nhận" };
      case "shipping":
        return { bg: "bg-indigo-100", text: "text-indigo-700", label: "Đang giao" };
      case "completed":
        return { bg: "bg-green-100", text: "text-green-700", label: "Hoàn thành" };
      case "cancelled":
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-700", label: "Đã hủy" };
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

  // Mở modal xem chi tiết đơn hàng
  const handleOpenDetail = async (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    setIsLoadingDetail(true);

    try {
      if (order.id) {
        const rawDetail = await ordersApi.getOrderById(order.id);
        if (rawDetail) {
          setSelectedOrder(normalizeOrder(rawDetail));
        }
      }
    } catch (err) {
      console.warn("Không thể lấy dữ liệu chi tiết đơn từ API, sử dụng dữ liệu có sẵn:", err);
    } finally {
      setIsLoadingDetail(false);
    }
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
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="px-3.5 py-2 border rounded-full text-xs font-semibold transition-all hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer text-gray-700 border-gray-300 disabled:opacity-50"
              title="Tải lại dữ liệu từ API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
            <button
              onClick={() => onNavigate?.("admin-dashboard")}
              className="px-4 py-2 border rounded-full text-sm font-semibold transition-all hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              style={{ borderColor: "#0A2647", color: "#0A2647" }}
            >
              Quay lại Dashboard
            </button>
          </div>
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
            <p className="text-[11px] text-gray-500 mt-1">Tổng đơn trong hệ thống</p>
          </div>

          {/* New Orders */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Đơn mới chờ duyệt</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-[#0A2647]">{stats.new}</p>
            <p className="text-[11px] text-gray-500 mt-1">Cần xác nhận</p>
          </div>

          {/* Processing / Shipping */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Đang giao dịch</span>
              <Truck className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-[#0A2647]">{stats.processing}</p>
            <p className="text-[11px] text-gray-500 mt-1">Đã xác nhận & vận chuyển</p>
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
                  { id: "processing", label: "Đã xác nhận" },
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
            {isLoading ? (
              <div className="py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#00BCD4] animate-spin" />
                <span className="text-sm font-medium">Đang tải danh sách đơn hàng từ API...</span>
              </div>
            ) : error ? (
              <div className="py-12 px-6 text-center flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="text-sm text-red-600 font-semibold">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="px-4 py-1.5 bg-[#0A2647] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : (
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
                        Không tìm thấy đơn hàng nào khớp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => {
                      const statusBadge = getOrderStatusBadge(order.status);
                      const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
                      return (
                        <tr key={order.id || order.orderCode} className="hover:bg-gray-50/50 transition-colors">
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
                              {order.time && <span className="text-gray-400">|</span>}
                              {order.time && <span className="font-medium text-gray-500">{order.time}</span>}
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
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block uppercase tracking-wider ${statusBadge.bg} ${statusBadge.text}`}
                            >
                              {statusBadge.label}
                            </span>
                          </td>

                          {/* Payment Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold inline-block text-center ${paymentBadge.bg} ${paymentBadge.text}`}
                              >
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
                              title="Xem chi tiết đơn hàng"
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
            )}
          </div>

          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-xs text-gray-500 font-semibold">
                Hiển thị {paginatedOrders.length} trên tổng số {filteredOrders.length} đơn hàng
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum((prev) => prev - 1)}
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
                  onClick={() => setCurrentPageNum((prev) => prev + 1)}
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
              {isLoadingDetail ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-[#00BCD4] animate-spin" />
                  <span className="text-xs text-gray-500">Đang tải chi tiết đơn hàng...</span>
                </div>
              ) : (
                <>
                  {/* Order Status & Payment Status overview */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Trạng thái đơn</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          getOrderStatusBadge(selectedOrder.status).bg
                        } ${getOrderStatusBadge(selectedOrder.status).text}`}
                      >
                        {getOrderStatusBadge(selectedOrder.status).label}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Trạng thái thanh toán</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          getPaymentStatusBadge(selectedOrder.paymentStatus).bg
                        } ${getPaymentStatusBadge(selectedOrder.paymentStatus).text}`}
                      >
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
                        {selectedOrder.buyerPhone && <p>Số điện thoại: {selectedOrder.buyerPhone}</p>}
                        <p>Hình thức: {selectedOrder.buyerType}</p>
                        <p className="pt-1.5 text-gray-500">
                          <strong>Địa chỉ nhận hàng:</strong>
                          <br />
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
                        <p className="text-gray-400 italic">Cung cấp trực tiếp trên Seafood VAM</p>
                      </div>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div>
                    <h4 className="font-bold text-sm mb-3 text-[#0A2647]">Danh sách sản phẩm mua</h4>
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
                          {selectedOrder.itemsList && selectedOrder.itemsList.length > 0 ? (
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
                              <td colSpan={4} className="px-4 py-3 text-gray-600">
                                {selectedOrder.items}
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-100 font-semibold">
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right text-gray-600">
                              Tổng giá trị đơn hàng:
                            </td>
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
                      {selectedOrder.logs &&
                        selectedOrder.logs.map((log, index) => (
                          <div key={index} className="relative">
                            <span className="absolute -left-[21px] mt-1.5 bg-[#00BCD4] w-2.5 h-2.5 rounded-full border border-white" />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-medium">{log.time}</span>
                              <span className="text-xs text-gray-700 font-semibold mt-0.5">{log.message}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
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
