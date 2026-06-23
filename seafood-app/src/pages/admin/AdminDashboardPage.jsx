import { useState } from 'react';
import {
  Users, Package, DollarSign, TrendingUp, ShieldCheck, Clock,
  UserCheck, UserX, Eye, CheckCircle, XCircle, Search,
  BarChart3, Settings, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ==================== MOCK DATA ====================

const revenueData = [
  { month: 'T1', revenue: 180, orders: 95 },
  { month: 'T2', revenue: 220, orders: 112 },
  { month: 'T3', revenue: 195, orders: 98 },
  { month: 'T4', revenue: 310, orders: 145 },
  { month: 'T5', revenue: 280, orders: 132 },
  { month: 'T6', revenue: 365, orders: 168 },
];

const orderStatusData = [
  { name: 'Đã giao', value: 245, color: '#059669' },
  { name: 'Đang giao', value: 48, color: '#2563EB' },
  { name: 'Chờ xác nhận', value: 32, color: '#D97706' },
  { name: 'Đã hủy', value: 15, color: '#DC2626' },
];

const trafficData = [
  { day: 'T2', visitors: 420 },
  { day: 'T3', visitors: 380 },
  { day: 'T4', visitors: 510 },
  { day: 'T5', visitors: 470 },
  { day: 'T6', visitors: 590 },
  { day: 'T7', visitors: 680 },
  { day: 'CN', visitors: 550 },
];

const users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'buyer', status: 'active', joinDate: '15/01/2026', orders: 23 },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', role: 'farmer', status: 'active', joinDate: '20/01/2026', orders: 0 },
  { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', role: 'business', status: 'active', joinDate: '02/02/2026', orders: 45 },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', role: 'buyer', status: 'inactive', joinDate: '10/02/2026', orders: 5 },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', role: 'farmer', status: 'active', joinDate: '28/02/2026', orders: 0 },
  { id: 6, name: 'Võ Thị F', email: 'vothif@gmail.com', role: 'buyer', status: 'active', joinDate: '05/03/2026', orders: 12 },
];

const recentOrders = [
  { id: 'DH001', customer: 'Nguyễn Văn A', products: 'Tôm sú size 20-25', quantity: '5 kg', total: '2.250.000đ', status: 'Đã giao', date: '22/06/2026' },
  { id: 'DH002', customer: 'Lê Văn C', products: 'Cá Tra phi lê', quantity: '50 kg', total: '4.250.000đ', status: 'Đang giao', date: '22/06/2026' },
  { id: 'DH003', customer: 'Võ Thị F', products: 'Cua biển Cà Mau', quantity: '3 kg', total: '960.000đ', status: 'Chờ xác nhận', date: '21/06/2026' },
  { id: 'DH004', customer: 'Phạm Thị D', products: 'Mực ống tươi', quantity: '2 kg', total: '520.000đ', status: 'Đã giao', date: '21/06/2026' },
  { id: 'DH005', customer: 'Nguyễn Văn A', products: 'Ghẹ xanh', quantity: '4 kg', total: '1.360.000đ', status: 'Đã hủy', date: '20/06/2026' },
];

const pendingApprovals = [
  { id: 'BD001', seller: 'Trần Thị B', type: 'supply', name: 'Tôm sú VietGAP — 5 tấn', date: '22/06/2026', description: 'Tôm sú nuôi ao đất, VietGAP, size 20-25 con/kg, vùng Cà Mau' },
  { id: 'BD002', seller: 'Hoàng Văn E', type: 'product', name: 'Cá Tra phi lê đông lạnh', date: '21/06/2026', description: 'Cá tra phi lê bỏ da, đóng gói 1kg/túi, đông lạnh -18°C' },
  { id: 'BD003', seller: 'Trần Thị B', type: 'supply', name: 'Cua biển — 2 tấn', date: '20/06/2026', description: 'Cua biển loại 1, size 300-500g/con, Kiên Giang' },
];

// ==================== COMPONENTS ====================

function StatCard({ icon: Icon, label, value, change, changeType, gradient, borderColor }) {
  return (
    <div
      className={`${gradient} rounded-xl p-5 border transition-all duration-200 hover:shadow-md cursor-default`}
      style={{ borderColor }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-white/70 rounded-lg">
          <Icon className="w-5 h-5" style={{ color: '#00BCD4' }} />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            changeType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    'Đã giao': 'bg-green-100 text-green-700',
    'Đang giao': 'bg-blue-100 text-blue-700',
    'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
    'Đã hủy': 'bg-red-100 text-red-700',
    'active': 'bg-green-100 text-green-700',
    'inactive': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config[status] || 'bg-gray-100 text-gray-700'}`}>
      {status === 'active' ? 'Hoạt động' : status === 'inactive' ? 'Ngưng' : status}
    </span>
  );
}

function RoleBadge({ role }) {
  const config = {
    buyer: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Người mua' },
    farmer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Người nuôi' },
    business: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Doanh nghiệp' },
    admin: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Admin' },
  };
  const c = config[role] || config.buyer;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}

// ==================== CUSTOM TOOLTIP ====================

function CustomTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 border" style={{ borderColor: '#e5e7eb' }}>
      <p className="text-xs font-semibold mb-1" style={{ color: '#0A2647' }}>{label}</p>
      {payload.map((item, idx) => (
        <p key={idx} className="text-sm" style={{ color: item.color }}>
          {item.name}: <span className="font-bold">{item.value.toLocaleString('vi-VN')}{suffix}</span>
        </p>
      ))}
    </div>
  );
}

// ==================== MAIN PAGE ====================

export function AdminDashboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const tabs = [
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'orders', label: 'Đơn hàng gần đây', icon: Package },
    { id: 'approvals', label: 'Chờ duyệt', icon: Clock, badge: pendingApprovals.length },
  ];

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============ HEADER ============ */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-sm text-gray-500 mb-1">{today}</p>
              <h1 className="text-3xl font-bold" style={{ color: '#0A2647' }}>
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={() => onNavigate?.('home')}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: '#0A2647' }}
            >
              <Settings className="w-4 h-4" />
              Cài đặt hệ thống
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Tổng quan hoạt động và quản lý hệ thống VAM Seafood Marketplace
          </p>
        </div>

        {/* ============ STATS CARDS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={Users} label="Tổng người dùng" value="1.247"
            change="+8.2%" changeType="up"
            gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
            borderColor="#E0F7FA"
          />
          <StatCard
            icon={Package} label="Tổng đơn hàng" value="340"
            change="+15.3%" changeType="up"
            gradient="bg-gradient-to-br from-cyan-50 to-teal-50"
            borderColor="#B2DFDB"
          />
          <StatCard
            icon={DollarSign} label="Doanh thu tháng" value="365M"
            change="+30.4%" changeType="up"
            gradient="bg-gradient-to-br from-green-50 to-emerald-50"
            borderColor="#D1FAE5"
          />
          <StatCard
            icon={TrendingUp} label="Sản phẩm đang bán" value="89"
            change="+5" changeType="up"
            gradient="bg-gradient-to-br from-purple-50 to-indigo-50"
            borderColor="#E8DAEF"
          />
          <StatCard
            icon={Clock} label="Chờ duyệt" value="3"
            change="" changeType=""
            gradient="bg-gradient-to-br from-yellow-50 to-orange-50"
            borderColor="#FEF3C7"
          />
          <StatCard
            icon={ShieldCheck} label="Tỷ lệ hoàn thành" value="92%"
            change="-1.2%" changeType="down"
            gradient="bg-gradient-to-br from-red-50 to-pink-50"
            borderColor="#FEE2E2"
          />
        </div>

        {/* ============ CHARTS ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border" style={{ borderColor: '#f3f4f6' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold" style={{ color: '#0A2647' }}>Doanh thu & Đơn hàng</h3>
                <p className="text-xs text-gray-500 mt-0.5">6 tháng gần nhất (triệu VNĐ)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00BCD4' }} />
                  Doanh thu
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0A2647' }} />
                  Đơn hàng
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
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
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#00BCD4" strokeWidth={2.5} fill="url(#colorRevenue)" />
                <Line type="monotone" dataKey="orders" name="Đơn hàng" stroke="#0A2647" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart — Order Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border" style={{ borderColor: '#f3f4f6' }}>
            <h3 className="font-bold mb-1" style={{ color: '#0A2647' }}>Trạng thái đơn hàng</h3>
            <p className="text-xs text-gray-500 mb-4">Phân bổ theo trạng thái</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold" style={{ color: '#0A2647' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic mini chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border mb-8" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold" style={{ color: '#0A2647' }}>Lượt truy cập tuần này</h3>
              <p className="text-xs text-gray-500 mt-0.5">Tổng: {trafficData.reduce((a, b) => a + b.visitors, 0).toLocaleString('vi-VN')} lượt</p>
            </div>
            <Eye className="w-5 h-5" style={{ color: '#00BCD4' }} />
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={trafficData} barSize={32}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" lượt" />} />
              <Bar dataKey="visitors" name="Lượt truy cập" fill="#0A2647" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ============ TABS ============ */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border" style={{ borderColor: '#f3f4f6' }}>
          {/* Tab nav */}
          <div className="border-b overflow-x-auto" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors ${
                      activeTab === tab.id ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    style={{
                      borderColor: activeTab === tab.id ? '#00BCD4' : 'transparent',
                      color: activeTab === tab.id ? '#0A2647' : undefined,
                      backgroundColor: activeTab === tab.id ? '#F0F9FF' : 'transparent',
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
            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h3 className="text-lg font-bold" style={{ color: '#0A2647' }}>
                    Danh sách người dùng
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên hoặc email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00BCD4] w-full sm:w-72"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Người dùng</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Vai trò</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Trạng thái</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Ngày tham gia</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Đơn hàng</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f3f4f6' }}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#0A2647' }}>
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: '#0A2647' }}>{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4"><RoleBadge role={user.role} /></td>
                          <td className="py-3.5 px-4"><StatusBadge status={user.status} /></td>
                          <td className="py-3.5 px-4 text-sm text-gray-600">{user.joinDate}</td>
                          <td className="py-3.5 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>{user.orders}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer" title="Xem chi tiết">
                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              {user.status === 'active' ? (
                                <button className="p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer" title="Vô hiệu hóa">
                                  <UserX className="w-4 h-4 text-red-500" />
                                </button>
                              ) : (
                                <button className="p-1.5 rounded-md hover:bg-green-50 transition-colors cursor-pointer" title="Kích hoạt">
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

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Không tìm thấy người dùng phù hợp</p>
                  </div>
                )}
              </div>
            )}

            {/* ---- TAB: Orders ---- */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-bold mb-6" style={{ color: '#0A2647' }}>Đơn hàng gần đây</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Mã đơn</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Khách hàng</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Sản phẩm</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Số lượng</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Tổng tiền</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Trạng thái</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A2647' }}>Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f3f4f6' }}>
                          <td className="py-3.5 px-4 text-sm font-semibold" style={{ color: '#00BCD4' }}>{order.id}</td>
                          <td className="py-3.5 px-4 text-sm" style={{ color: '#0A2647' }}>{order.customer}</td>
                          <td className="py-3.5 px-4 text-sm text-gray-600">{order.products}</td>
                          <td className="py-3.5 px-4 text-sm text-gray-600">{order.quantity}</td>
                          <td className="py-3.5 px-4 text-sm font-semibold" style={{ color: '#d4183d' }}>{order.total}</td>
                          <td className="py-3.5 px-4"><StatusBadge status={order.status} /></td>
                          <td className="py-3.5 px-4 text-sm text-gray-500">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ---- TAB: Approvals ---- */}
            {activeTab === 'approvals' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: '#0A2647' }}>Bài đăng chờ duyệt</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Có {pendingApprovals.length} bài đăng cần xét duyệt
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
                    <span className="text-xs font-semibold text-yellow-700">{pendingApprovals.length} chờ duyệt</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="border rounded-xl p-5 hover:shadow-md transition-all duration-200" style={{ borderColor: '#e5e7eb' }}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.type === 'supply'
                                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}>
                              {item.type === 'supply' ? 'Sản lượng' : 'Sản phẩm'}
                            </span>
                            <span className="text-xs text-gray-400">#{item.id}</span>
                          </div>
                          <h4 className="font-semibold mb-1" style={{ color: '#0A2647' }}>{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Người đăng: <strong className="text-gray-700">{item.seller}</strong></span>
                            <span>Ngày: {item.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-shrink-0">
                          <button
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                            style={{ backgroundColor: '#059669' }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Duyệt
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
                            style={{ borderColor: '#DC2626', color: '#DC2626' }}
                          >
                            <XCircle className="w-4 h-4" />
                            Từ chối
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pendingApprovals.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Không có bài đăng nào đang chờ duyệt</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============ QUICK ACTIONS ============ */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Hành động nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('order-management')}
              className="p-6 border-2 border-dashed rounded-xl hover:bg-blue-50 transition-colors text-left cursor-pointer"
              style={{ borderColor: '#00BCD4' }}
            >
              <Package className="w-8 h-8 mb-3" style={{ color: '#00BCD4' }} />
              <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Quản lý đơn hàng</h4>
              <p className="text-sm text-gray-600">Xem và xử lý tất cả đơn hàng trong hệ thống</p>
            </button>

            <button
              onClick={() => onNavigate?.('listing-management')}
              className="p-6 border-2 border-dashed rounded-xl hover:bg-blue-50 transition-colors text-left cursor-pointer"
              style={{ borderColor: '#00BCD4' }}
            >
              <BarChart3 className="w-8 h-8 mb-3" style={{ color: '#00BCD4' }} />
              <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Quản lý bài đăng</h4>
              <p className="text-sm text-gray-600">Duyệt và quản lý bài đăng từ người bán</p>
            </button>

            <button
              onClick={() => onNavigate?.('supply')}
              className="p-6 border-2 border-dashed rounded-xl hover:bg-blue-50 transition-colors text-left cursor-pointer"
              style={{ borderColor: '#00BCD4' }}
            >
              <TrendingUp className="w-8 h-8 mb-3" style={{ color: '#00BCD4' }} />
              <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Tổng quan sản lượng</h4>
              <p className="text-sm text-gray-600">Xem sản lượng hải sản đang được rao bán</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
