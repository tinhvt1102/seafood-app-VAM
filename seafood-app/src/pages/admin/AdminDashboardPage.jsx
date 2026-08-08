import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  BarChart3,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Building,
  ExternalLink,
  Loader2,
  X,
  User,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import {
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "react-hot-toast";
import { profileApi } from "../../api/profile";
import { usersApi } from "../../api/users";
import { ordersApi } from "../../api/orders";
import { productApi } from "../../api/products";

// ==================== HELPER FUNCTIONS ====================

const extractList = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.items)) return res.items;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch {
    return dateStr;
  }
};

const formatPrice = (amount) => {
  return (amount || 0).toLocaleString("vi-VN") + "đ";
};

// ==================== COMPONENTS ====================

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType,
  gradient,
  borderColor,
  loading = false,
}) {
  return (
    <div
      className={`${gradient} rounded-xl p-5 border transition-all duration-200 hover:shadow-md cursor-default`}
      style={{ borderColor }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-white/70 rounded-lg">
          <Icon className="w-5 h-5" style={{ color: "#00BCD4" }} />
        </div>
        {change && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              changeType === "up"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {changeType === "up" ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      {loading ? (
        <div className="h-8 flex items-center">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
        </div>
      ) : (
        <p className="text-2xl font-bold" style={{ color: "#0A2647" }}>
          {value}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const config = {
    "đã giao": "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    "đang giao": "bg-blue-100 text-blue-700",
    shipping: "bg-blue-100 text-blue-700",
    "chờ xác nhận": "bg-yellow-100 text-yellow-700",
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-teal-100 text-teal-700",
    "đã hủy": "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
    active: "bg-green-100 text-green-700",
    inactive: "bg-red-100 text-red-700",
  };

  const textMap = {
    completed: "Đã giao",
    shipping: "Đang giao",
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    cancelled: "Đã hủy",
    active: "Hoạt động",
    inactive: "Ngưng",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${config[normalized] || "bg-gray-100 text-gray-700"}`}
    >
      {textMap[normalized] || status}
    </span>
  );
}

function RoleBadge({ role }) {
  const normalized = (role || "").toLowerCase();
  const config = {
    buyer: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
      label: "Người mua",
    },
    customer: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
      label: "Khách hàng",
    },
    farmer: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Người nuôi",
    },
    seller: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Người bán",
    },
    business: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      label: "Doanh nghiệp",
    },
    admin: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      label: "Admin",
    },
  };
  const c = config[normalized] || config.buyer;
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      {c.label}
    </span>
  );
}

// ==================== CUSTOM TOOLTIP ====================

function CustomTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-3 border"
      style={{ borderColor: "#e5e7eb" }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: "#0A2647" }}>
        {label}
      </p>
      {payload.map((item, idx) => (
        <p key={idx} className="text-sm" style={{ color: item.color }}>
          {item.name}:{" "}
          <span className="font-bold">
            {typeof item.value === "number"
              ? item.value.toLocaleString("vi-VN")
              : item.value}
            {suffix}
          </span>
        </p>
      ))}
    </div>
  );
}

// ==================== MAIN PAGE ====================

export function AdminDashboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  // Loading states
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Main Data States
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [approvedProductsCount, setApprovedProductsCount] = useState(0);

  // Approvals State
  const [approvalCategory, setApprovalCategory] = useState("profiles"); // 'profiles' | 'listings'
  const [profileType, setProfileType] = useState("seller"); // 'seller' | 'business'
  const [pendingSellers, setPendingSellers] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [pendingProductsList, setPendingProductsList] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Action Loading States
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const [approvingProductId, setApprovingProductId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    setLoadingDashboard(true);
    try {
      const [usersRes, ordersRes, approvedProductsRes, pendingProductsRes] =
        await Promise.all([
          usersApi.getAllUsers({ pageSize: 100 }).catch(() => []),
          ordersApi.getAllOrders({ pageSize: 100 }).catch(() => []),
          productApi
            .getProducts({ status: "approved", pageSize: 100 })
            .catch(() => []),
          productApi
            .getProducts({ status: "pending", pageSize: 100 })
            .catch(() => []),
        ]);

      setUsersList(extractList(usersRes));
      setOrdersList(extractList(ordersRes));

      const appProdList = extractList(approvedProductsRes);
      setApprovedProductsCount(
        approvedProductsRes?.totalCount || appProdList.length,
      );

      setPendingProductsList(extractList(pendingProductsRes));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Admin Dashboard:", error);
      toast.error("Không thể lấy toàn bộ dữ liệu bảng điều khiển.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Fetch Pending Profiles
  const fetchPendingProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const [sellersRes, businessesRes] = await Promise.all([
        profileApi.getPendingSellerProfiles(1, 50).catch(() => ({ items: [] })),
        profileApi
          .getPendingBusinessProfiles(1, 50)
          .catch(() => ({ items: [] })),
      ]);
      setPendingSellers(extractList(sellersRes));
      setPendingBusinesses(extractList(businessesRes));
    } catch (error) {
      console.error("Lỗi khi tải danh sách hồ sơ chờ duyệt:", error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPendingProfiles();
  }, []);

  useEffect(() => {
    if (activeTab === "approvals") {
      fetchPendingProfiles();
    }
  }, [activeTab]);

  // Handlers for Profile Approvals
  const handleApproveSeller = async (id, isApproved) => {
    setActionLoadingId(`seller-${id}`);
    try {
      await profileApi.approveSellerProfile(id, isApproved);
      toast.success(
        isApproved
          ? "Đã phê duyệt hồ sơ người bán!"
          : "Đã từ chối hồ sơ người bán",
      );
      fetchPendingProfiles();
    } catch (error) {
      toast.error(error.message || "Xử lý thất bại. Vui lòng thử lại.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApproveBusiness = async (id, isApproved) => {
    setActionLoadingId(`business-${id}`);
    try {
      await profileApi.approveBusinessProfile(id, isApproved);
      toast.success(
        isApproved
          ? "Đã phê duyệt hồ sơ doanh nghiệp!"
          : "Đã từ chối hồ sơ doanh nghiệp",
      );
      fetchPendingProfiles();
    } catch (error) {
      toast.error(error.message || "Xử lý thất bại. Vui lòng thử lại.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler for User Status Toggle
  const handleToggleUserStatus = async (user) => {
    setTogglingUserId(user.id);
    try {
      await usersApi.updateCustomerStatus(user.id);
      const newStatus = user.status === "active" ? "inactive" : "active";
      toast.success(
        `Đã ${newStatus === "active" ? "kích hoạt" : "ngưng"} tài khoản ${user.name || user.email}!`,
      );
      setUsersList((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
      );
    } catch (error) {
      toast.error(error.message || "Cập nhật trạng thái người dùng thất bại.");
    } finally {
      setTogglingUserId(null);
    }
  };

  // Handler for Product Approval
  const handleApproveProduct = async (productId, isApproved) => {
    setApprovingProductId(productId);
    try {
      await productApi.approveProduct(productId, {
        status: isApproved ? "approved" : "rejected",
      });
      toast.success(
        isApproved ? "Đã duyệt bài đăng sản phẩm!" : "Đã từ chối bài đăng!",
      );
      setPendingProductsList((prev) => prev.filter((p) => p.id !== productId));
      if (isApproved) {
        setApprovedProductsCount((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.message || "Duyệt bài đăng thất bại.");
    } finally {
      setApprovingProductId(null);
    }
  };

  // Derived Metrics & Charts Data
  const totalPendingProfiles =
    pendingSellers.length + pendingBusinesses.length;
  const totalPendingListings = pendingProductsList.length;

  const summaryStats = useMemo(() => {
    const totalUsers = usersList.length;
    const totalOrders = ordersList.length;

    // Total revenue sum
    const totalRevenue = ordersList.reduce((sum, o) => {
      if (o.status !== "cancelled") {
        return sum + Number(o.totalPrice || 0);
      }
      return sum;
    }, 0);

    const completedOrdersCount = ordersList.filter(
      (o) => (o.status || "").toLowerCase() === "completed",
    ).length;

    const completionRate =
      totalOrders > 0
        ? Math.round((completedOrdersCount / totalOrders) * 100)
        : 0;

    return {
      totalUsers,
      totalOrders,
      totalRevenue,
      activeProducts: approvedProductsCount,
      totalPending: totalPendingProfiles + totalPendingListings,
      completionRate: `${completionRate}%`,
    };
  }, [
    usersList,
    ordersList,
    approvedProductsCount,
    totalPendingProfiles,
    totalPendingListings,
  ]);

  // Aggregate Revenue Chart (last 6 months)
  const revenueChartData = useMemo(() => {
    const monthsMap = {};
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = `T${d.getMonth() + 1}`;
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthsMap[key] = { month: label, revenue: 0, orders: 0 };
    }

    ordersList.forEach((o) => {
      if ((o.status || "").toLowerCase() === "cancelled") return;
      const date = o.orderDate ? new Date(o.orderDate) : null;
      if (!date || isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (monthsMap[key]) {
        monthsMap[key].revenue += Number(o.totalPrice || 0) / 1000000; // in Millions
        monthsMap[key].orders += 1;
      }
    });

    return Object.values(monthsMap).map((m) => ({
      ...m,
      revenue: Math.round(m.revenue * 10) / 10,
    }));
  }, [ordersList]);

  // Aggregate Order Status Pie Chart
  const orderStatusChartData = useMemo(() => {
    const counts = {
      completed: 0,
      shipping: 0,
      pending: 0,
      cancelled: 0,
    };

    ordersList.forEach((o) => {
      const st = (o.status || "").toLowerCase();
      if (st === "completed" || st === "đã giao") counts.completed++;
      else if (st === "shipping" || st === "đang giao") counts.shipping++;
      else if (st === "cancelled" || st === "đã hủy") counts.cancelled++;
      else counts.pending++;
    });

    return [
      { name: "Đã giao", value: counts.completed, color: "#059669" },
      { name: "Đang giao", value: counts.shipping, color: "#2563EB" },
      { name: "Chờ xác nhận", value: counts.pending, color: "#D97706" },
      { name: "Đã hủy", value: counts.cancelled, color: "#DC2626" },
    ];
  }, [ordersList]);

  // Traffic / Activity Chart Data (Mon-Sun)
  const trafficChartData = useMemo(() => {
    const daysMap = {
      1: { day: "T2", visitors: 0 },
      2: { day: "T3", visitors: 0 },
      3: { day: "T4", visitors: 0 },
      4: { day: "T5", visitors: 0 },
      5: { day: "T6", visitors: 0 },
      6: { day: "T7", visitors: 0 },
      0: { day: "CN", visitors: 0 },
    };

    ordersList.forEach((o) => {
      const date = o.orderDate ? new Date(o.orderDate) : null;
      if (date && !isNaN(date.getTime())) {
        daysMap[date.getDay()].visitors += 1;
      }
    });

    usersList.forEach((u) => {
      const date = u.createdAt ? new Date(u.createdAt) : null;
      if (date && !isNaN(date.getTime())) {
        daysMap[date.getDay()].visitors += 1;
      }
    });

    return [
      daysMap[1],
      daysMap[2],
      daysMap[3],
      daysMap[4],
      daysMap[5],
      daysMap[6],
      daysMap[0],
    ];
  }, [ordersList, usersList]);

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tabs = [
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "orders", label: "Đơn hàng gần đây", icon: Package },
    {
      id: "approvals",
      label: "Chờ duyệt",
      icon: Clock,
      badge: summaryStats.totalPending,
    },
  ];

  const filteredUsers = usersList.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============ HEADER ============ */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-sm text-gray-500 mb-1">{today}</p>
              <h1 className="text-3xl font-bold" style={{ color: "#0A2647" }}>
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchDashboardData();
                  fetchPendingProfiles();
                  toast.success("Đã làm mới dữ liệu hệ thống!");
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-xs"
                style={{ color: "#0A2647", borderColor: "#e5e7eb" }}
              >
                <RefreshCw className="w-4 h-4 text-cyan-600" />
                Làm mới
              </button>
              <button
                onClick={() => onNavigate?.("home")}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "#0A2647" }}
              >
                <Settings className="w-4 h-4" />
                Cài đặt hệ thống
              </button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Tổng quan hoạt động và quản lý hệ thống VAM Seafood Marketplace
          </p>
        </div>

        {/* ============ STATS CARDS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Tổng người dùng"
            value={summaryStats.totalUsers.toLocaleString("vi-VN")}
            loading={loadingDashboard}
            gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
            borderColor="#E0F7FA"
          />
          <StatCard
            icon={Package}
            label="Tổng đơn hàng"
            value={summaryStats.totalOrders.toLocaleString("vi-VN")}
            loading={loadingDashboard}
            gradient="bg-gradient-to-br from-cyan-50 to-teal-50"
            borderColor="#B2DFDB"
          />
          <StatCard
            icon={DollarSign}
            label="Doanh thu hệ thống"
            value={
              summaryStats.totalRevenue >= 1000000
                ? `${(summaryStats.totalRevenue / 1000000).toFixed(1)}M`
                : formatPrice(summaryStats.totalRevenue)
            }
            loading={loadingDashboard}
            gradient="bg-gradient-to-br from-green-50 to-emerald-50"
            borderColor="#D1FAE5"
          />
          <StatCard
            icon={TrendingUp}
            label="Sản phẩm đang bán"
            value={summaryStats.activeProducts.toLocaleString("vi-VN")}
            loading={loadingDashboard}
            gradient="bg-gradient-to-br from-purple-50 to-indigo-50"
            borderColor="#E8DAEF"
          />
          <StatCard
            icon={Clock}
            label="Chờ duyệt"
            value={summaryStats.totalPending.toLocaleString("vi-VN")}
            loading={loadingDashboard}
            gradient="bg-gradient-to-br from-yellow-50 to-orange-50"
            borderColor="#FEF3C7"
          />
          <StatCard
            icon={ShieldCheck}
            label="Tỷ lệ hoàn thành"
            value={summaryStats.completionRate}
            loading={loadingDashboard}
            gradient="bg-gradient-to-br from-red-50 to-pink-50"
            borderColor="#FEE2E2"
          />
        </div>

        {/* ============ CHARTS ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Line/Area Chart */}
          <div
            className="lg:col-span-2 bg-white rounded-xl shadow-xs p-6 border"
            style={{ borderColor: "#f3f4f6" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold" style={{ color: "#0A2647" }}>
                  Doanh thu & Đơn hàng
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  6 tháng gần nhất (triệu VNĐ)
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#00BCD4" }}
                  />
                  Doanh thu (M)
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#0A2647" }}
                  />
                  Đơn hàng
                </span>
              </div>
            </div>
            {loadingDashboard ? (
              <div className="h-[280px] flex items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip suffix="M" />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#00BCD4"
                    strokeWidth={2.5}
                    fill="url(#colorRevenue)"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Đơn hàng"
                    stroke="#0A2647"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart — Order Status */}
          <div
            className="bg-white rounded-xl shadow-xs p-6 border"
            style={{ borderColor: "#f3f4f6" }}
          >
            <h3 className="font-bold mb-1" style={{ color: "#0A2647" }}>
              Trạng thái đơn hàng
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Phân bổ theo trạng thái thực tế
            </p>
            {loadingDashboard ? (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={orderStatusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {orderStatusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {orderStatusChartData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold" style={{ color: "#0A2647" }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Traffic mini chart */}
        <div
          className="bg-white rounded-xl shadow-xs p-6 border mb-8"
          style={{ borderColor: "#f3f4f6" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold" style={{ color: "#0A2647" }}>
                Hoạt động hệ thống theo ngày
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Tổng lượt tương tác (Đơn hàng & Tạo mới):{" "}
                {trafficChartData
                  .reduce((a, b) => a + b.visitors, 0)
                  .toLocaleString("vi-VN")}
              </p>
            </div>
            <Eye className="w-5 h-5" style={{ color: "#00BCD4" }} />
          </div>
          {loadingDashboard ? (
            <div className="h-[120px] flex items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={trafficChartData} barSize={32}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip suffix=" hoạt động" />} />
                <Bar
                  dataKey="visitors"
                  name="Tương tác"
                  fill="#0A2647"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ============ TABS ============ */}
        <div
          className="bg-white rounded-xl shadow-xs overflow-hidden border"
          style={{ borderColor: "#f3f4f6" }}
        >
          {/* Tab nav */}
          <div
            className="border-b overflow-x-auto"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div className="flex min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{
                      borderColor:
                        activeTab === tab.id ? "#00BCD4" : "transparent",
                      color: activeTab === tab.id ? "#0A2647" : undefined,
                      backgroundColor:
                        activeTab === tab.id ? "#F0F9FF" : "transparent",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {/* ---- TAB: Users ---- */}
            {activeTab === "users" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "#0A2647" }}
                    >
                      Danh sách người dùng hệ thống ({filteredUsers.length})
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Quản lý thông tin & phân quyền tài khoản
                    </p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên hoặc email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00BCD4] w-full sm:w-72 bg-white"
                      style={{ borderColor: "#e5e7eb" }}
                    />
                  </div>
                </div>

                {loadingDashboard ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-2" />
                    <p className="text-sm">Đang tải danh sách người dùng...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr
                          className="border-b"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Người dùng
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Vai trò
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Trạng thái
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Số điện thoại
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Địa chỉ
                          </th>
                          <th
                            className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-gray-50/50 transition-colors"
                            style={{ borderColor: "#f3f4f6" }}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                                  style={{ backgroundColor: "#0A2647" }}
                                >
                                  {(user.name || user.email || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <p
                                    className="text-sm font-semibold"
                                    style={{ color: "#0A2647" }}
                                  >
                                    {user.name || "Chưa cập nhật"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <RoleBadge role={user.role} />
                            </td>
                            <td className="py-3.5 px-4">
                              <StatusBadge status={user.status} />
                            </td>
                            <td className="py-3.5 px-4 text-sm text-gray-600">
                              {user.phone || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-sm text-gray-600 max-w-xs truncate">
                              {user.address || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {togglingUserId === user.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                                ) : user.status === "active" ? (
                                  <button
                                    onClick={() => handleToggleUserStatus(user)}
                                    className="p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Tắt trạng thái hoạt động"
                                  >
                                    <UserX className="w-4 h-4 text-red-500" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleUserStatus(user)}
                                    className="p-1.5 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
                                    title="Kích hoạt tài khoản"
                                  >
                                    <UserCheck className="w-4 h-4 text-green-600" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!loadingDashboard && filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Không tìm thấy người dùng phù hợp</p>
                  </div>
                )}
              </div>
            )}

            {/* ---- TAB: Orders ---- */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "#0A2647" }}
                    >
                      Đơn hàng gần đây ({ordersList.length})
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Danh sách đơn hàng toàn hệ thống
                    </p>
                  </div>
                </div>

                {loadingDashboard ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-2" />
                    <p className="text-sm">Đang tải danh sách đơn hàng...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr
                          className="border-b"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Mã đơn
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Khách hàng
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Sản phẩm
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Địa chỉ giao
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Tổng tiền
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Trạng thái
                          </th>
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#0A2647" }}
                          >
                            Ngày tạo
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersList.map((order) => {
                          const itemsSummary =
                            order.orderItems && order.orderItems.length > 0
                              ? order.orderItems
                                  .map(
                                    (i) =>
                                      `${i.productName || "Sản phẩm"} (x${i.quantity})`,
                                  )
                                  .join(", ")
                              : "Đơn hàng cơ bản";

                          return (
                            <tr
                              key={order.id}
                              className="border-b hover:bg-gray-50/50 transition-colors"
                              style={{ borderColor: "#f3f4f6" }}
                            >
                              <td
                                className="py-3.5 px-4 text-sm font-semibold"
                                style={{ color: "#00BCD4" }}
                              >
                                #{order.id}
                              </td>
                              <td
                                className="py-3.5 px-4 text-sm font-medium"
                                style={{ color: "#0A2647" }}
                              >
                                {order.buyerName ||
                                  order.buyerEmail ||
                                  `Khách #${order.buyerId}`}
                              </td>
                              <td className="py-3.5 px-4 text-sm text-gray-600 max-w-xs truncate">
                                {itemsSummary}
                              </td>
                              <td className="py-3.5 px-4 text-sm text-gray-600 max-w-xs truncate">
                                {order.shippingAddress || "—"}
                              </td>
                              <td
                                className="py-3.5 px-4 text-sm font-semibold"
                                style={{ color: "#d4183d" }}
                              >
                                {formatPrice(order.totalPrice)}
                              </td>
                              <td className="py-3.5 px-4">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="py-3.5 px-4 text-sm text-gray-500">
                                {formatDate(order.orderDate)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {!loadingDashboard && ordersList.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có đơn hàng nào trong hệ thống</p>
                  </div>
                )}
              </div>
            )}

            {/* ---- TAB: Approvals ---- */}
            {activeTab === "approvals" && (
              <div>
                {/* Category Switcher Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: "#0A2647" }}
                    >
                      Trung tâm xét duyệt
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Phê duyệt hồ sơ đăng ký tài khoản và bài đăng sản phẩm
                    </p>
                  </div>
                  <div className="flex items-center p-1 bg-gray-100 rounded-lg self-start sm:self-auto">
                    <button
                      onClick={() => setApprovalCategory("profiles")}
                      className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        approvalCategory === "profiles"
                          ? "bg-white shadow-xs text-[#0A2647]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Hồ sơ đăng ký ({totalPendingProfiles})
                    </button>
                    <button
                      onClick={() => setApprovalCategory("listings")}
                      className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        approvalCategory === "listings"
                          ? "bg-white shadow-xs text-[#0A2647]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Bài đăng hệ thống ({totalPendingListings})
                    </button>
                  </div>
                </div>

                {/* CATEGORY 1: PROFILE APPROVALS */}
                {approvalCategory === "profiles" && (
                  <div>
                    {/* Sub-tabs for Seller / Business */}
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => setProfileType("seller")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          profileType === "seller"
                            ? "bg-cyan-500 text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Người nuôi ({pendingSellers.length})
                      </button>
                      <button
                        onClick={() => setProfileType("business")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          profileType === "business"
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Building className="w-4 h-4" />
                        Doanh nghiệp ({pendingBusinesses.length})
                      </button>
                    </div>

                    {loadingProfiles ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-2" />
                        <p className="text-sm">Đang tải hồ sơ chờ duyệt...</p>
                      </div>
                    ) : profileType === "seller" ? (
                      /* Seller Profiles List */
                      <div className="space-y-4">
                        {pendingSellers.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white"
                            style={{ borderColor: "#e5e7eb" }}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                                    Hồ sơ Người nuôi (Seller)
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ID: #{item.id}
                                  </span>
                                </div>
                                <h4
                                  className="text-base font-bold"
                                  style={{ color: "#0A2647" }}
                                >
                                  {item.farmName}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                  <p>
                                    <strong>Địa chỉ trang trại:</strong>{" "}
                                    {item.farmAddress || "Chưa cập nhật"}
                                  </p>
                                  <p>
                                    <strong>Loại hình nuôi trồng:</strong>{" "}
                                    {item.aquacultureType || "Chưa cập nhật"}
                                  </p>
                                </div>
                                {item.certificate && (
                                  <div className="pt-1">
                                    <button
                                      onClick={() =>
                                        setSelectedDocument({
                                          title: `Chứng chỉ / Giấy phép - ${item.farmName}`,
                                          url: item.certificate,
                                        })
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors cursor-pointer"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      Xem chứng chỉ đính kèm
                                      <ExternalLink className="w-3 h-3 ml-0.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div
                                className="flex items-center gap-2 lg:flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0"
                                style={{ borderColor: "#f3f4f6" }}
                              >
                                <button
                                  disabled={
                                    actionLoadingId === `seller-${item.id}`
                                  }
                                  onClick={() =>
                                    handleApproveSeller(item.id, true)
                                  }
                                  className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-50 cursor-pointer"
                                  style={{ backgroundColor: "#059669" }}
                                >
                                  {actionLoadingId === `seller-${item.id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  Duyệt hồ sơ
                                </button>
                                <button
                                  disabled={
                                    actionLoadingId === `seller-${item.id}`
                                  }
                                  onClick={() =>
                                    handleApproveSeller(item.id, false)
                                  }
                                  className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                                  style={{
                                    borderColor: "#DC2626",
                                    color: "#DC2626",
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Từ chối
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {pendingSellers.length === 0 && (
                          <div
                            className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-500"
                            style={{ borderColor: "#e5e7eb" }}
                          >
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                            <p className="font-medium text-gray-700">
                              Không có hồ sơ người bán nào đang chờ duyệt
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Tất cả yêu cầu đã được xử lý thành công.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Business Profiles List */
                      <div className="space-y-4">
                        {pendingBusinesses.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white"
                            style={{ borderColor: "#e5e7eb" }}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                    Hồ sơ Doanh nghiệp (Buyer)
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ID: #{item.id}
                                  </span>
                                </div>
                                <h4
                                  className="text-base font-bold"
                                  style={{ color: "#0A2647" }}
                                >
                                  {item.companyName}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                  <p>
                                    <strong>Mã số thuế:</strong> {item.taxCode}
                                  </p>
                                  <p>
                                    <strong>Địa chỉ công ty:</strong>{" "}
                                    {item.address || "Chưa cập nhật"}
                                  </p>
                                </div>
                                {item.businessLicense && (
                                  <div className="pt-1">
                                    <button
                                      onClick={() =>
                                        setSelectedDocument({
                                          title: `Giấy phép kinh doanh - ${item.companyName}`,
                                          url: item.businessLicense,
                                        })
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium transition-colors cursor-pointer"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      Xem GPKD đính kèm
                                      <ExternalLink className="w-3 h-3 ml-0.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div
                                className="flex items-center gap-2 lg:flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0"
                                style={{ borderColor: "#f3f4f6" }}
                              >
                                <button
                                  disabled={
                                    actionLoadingId === `business-${item.id}`
                                  }
                                  onClick={() =>
                                    handleApproveBusiness(item.id, true)
                                  }
                                  className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-50 cursor-pointer"
                                  style={{ backgroundColor: "#059669" }}
                                >
                                  {actionLoadingId === `business-${item.id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  Duyệt hồ sơ
                                </button>
                                <button
                                  disabled={
                                    actionLoadingId === `business-${item.id}`
                                  }
                                  onClick={() =>
                                    handleApproveBusiness(item.id, false)
                                  }
                                  className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                                  style={{
                                    borderColor: "#DC2626",
                                    color: "#DC2626",
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Từ chối
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {pendingBusinesses.length === 0 && (
                          <div
                            className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-500"
                            style={{ borderColor: "#e5e7eb" }}
                          >
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                            <p className="font-medium text-gray-700">
                              Không có hồ sơ doanh nghiệp nào đang chờ duyệt
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Tất cả yêu cầu đã được xử lý thành công.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* CATEGORY 2: LISTING APPROVALS (PENDING PRODUCTS) */}
                {approvalCategory === "listings" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-500">
                        Có {pendingProductsList.length} bài đăng sản phẩm đang
                        chờ phê duyệt
                      </p>
                    </div>

                    <div className="space-y-4">
                      {pendingProductsList.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">
                                  {item.isWholesale ? "Sản lượng" : "Sản phẩm"}
                                </span>
                                <span className="text-xs text-gray-400">
                                  #{item.id}
                                </span>
                              </div>
                              <h4
                                className="font-semibold text-lg mb-1"
                                style={{ color: "#0A2647" }}
                              >
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description || "Không có mô tả."}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                <span>
                                  Giá:{" "}
                                  <strong style={{ color: "#d4183d" }}>
                                    {formatPrice(item.price)} / {item.unit || "kg"}
                                  </strong>
                                </span>
                                <span>
                                  Số lượng: <strong>{item.quantity}</strong>
                                </span>
                                <span>
                                  Người đăng:{" "}
                                  <strong className="text-gray-700">
                                    {item.sellerName || `Seller #${item.sellerId}`}
                                  </strong>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:flex-shrink-0 pt-2 sm:pt-0">
                              <button
                                disabled={approvingProductId === item.id}
                                onClick={() =>
                                  handleApproveProduct(item.id, true)
                                }
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                                style={{ backgroundColor: "#059669" }}
                              >
                                {approvingProductId === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                Duyệt
                              </button>
                              <button
                                disabled={approvingProductId === item.id}
                                onClick={() =>
                                  handleApproveProduct(item.id, false)
                                }
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                                style={{
                                  borderColor: "#DC2626",
                                  color: "#DC2626",
                                }}
                              >
                                <XCircle className="w-4 h-4" />
                                Từ chối
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {pendingProductsList.length === 0 && (
                        <div
                          className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                          <p className="font-medium text-gray-700">
                            Không có bài đăng nào đang chờ duyệt
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Tất cả sản phẩm đã được phê duyệt hoặc xử lý.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============ QUICK ACTIONS ============ */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: "#0A2647" }}>
            Hành động nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.("order-management")}
              className="p-6 border-2 border-dashed rounded-xl hover:bg-blue-50 transition-colors text-left cursor-pointer bg-white"
              style={{ borderColor: "#00BCD4" }}
            >
              <Package className="w-8 h-8 mb-3" style={{ color: "#00BCD4" }} />
              <h4 className="font-semibold mb-2" style={{ color: "#0A2647" }}>
                Quản lý đơn hàng
              </h4>
              <p className="text-sm text-gray-600">
                Xem và xử lý tất cả đơn hàng trong hệ thống
              </p>
            </button>

            <button
              onClick={() => onNavigate?.("product-approval")}
              className="p-6 border-2 border-dashed rounded-xl hover:bg-blue-50 transition-colors text-left cursor-pointer bg-white"
              style={{ borderColor: "#00BCD4" }}
            >
              <BarChart3
                className="w-8 h-8 mb-3"
                style={{ color: "#00BCD4" }}
              />
              <h4 className="font-semibold mb-2" style={{ color: "#0A2647" }}>
                Quản lý bài đăng
              </h4>
              <p className="text-sm text-gray-600">
                Duyệt và quản lý bài đăng từ người bán
              </p>
            </button>

            <button
              onClick={() => onNavigate?.("supply")}
              className="p-6 border-2 border-dashed rounded-xl hover:bg-blue-50 transition-colors text-left cursor-pointer bg-white"
              style={{ borderColor: "#00BCD4" }}
            >
              <TrendingUp
                className="w-8 h-8 mb-3"
                style={{ color: "#00BCD4" }}
              />
              <h4 className="font-semibold mb-2" style={{ color: "#0A2647" }}>
                Tổng quan sản lượng
              </h4>
              <p className="text-sm text-gray-600">
                Xem sản lượng hải sản đang được rao bán
              </p>
            </button>
          </div>
        </div>

        {/* Document Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col border border-gray-100">
              <div
                className="flex items-center justify-between border-b pb-3.5"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "#0A2647" }}
                    >
                      {selectedDocument.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Tài liệu đính kèm kiểm duyệt hồ sơ
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div
                className="flex-1 overflow-hidden bg-gray-900/5 rounded-xl border flex items-center justify-center min-h-[450px]"
                style={{ borderColor: "#e5e7eb" }}
              >
                {(() => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(
                    selectedDocument.url,
                  );
                  if (isImage) {
                    return (
                      <img
                        src={selectedDocument.url}
                        alt="Giấy tờ đính kèm"
                        className="max-w-full max-h-[600px] object-contain rounded-lg shadow-xs"
                      />
                    );
                  }
                  return (
                    <object
                      data={selectedDocument.url}
                      type="application/pdf"
                      className="w-full h-[600px] rounded-lg border-0"
                    >
                      <iframe
                        src={selectedDocument.url}
                        className="w-full h-[600px] rounded-lg border-0"
                        title="Document viewer"
                      >
                        <div className="p-8 text-center text-sm text-gray-600 space-y-3">
                          <p>
                            Trình duyệt không hỗ trợ xem trực tiếp tài liệu này
                            trong khung xem nhanh.
                          </p>
                          <a
                            href={selectedDocument.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" /> Xem file trong
                            tab mới
                          </a>
                        </div>
                      </iframe>
                    </object>
                  );
                })()}
              </div>
              <div className="flex items-center justify-between pt-2">
                <a
                  href={selectedDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Mở file trong tab mới / Tải về
                </a>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
