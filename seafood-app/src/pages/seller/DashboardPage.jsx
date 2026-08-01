import { useState, useEffect } from 'react';
import { Package, MessageSquare, FileText, History, Bell, DollarSign, Loader2, CheckCircle, Truck, XCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { orderApi } from '../../api/products';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      console.log('Fetching seller orders...', orderApi);
      if (!orderApi || typeof orderApi.getSellerOrders !== 'function') {
        console.warn('orderApi.getSellerOrders is not defined on imported object, retrying import or fallback');
        return;
      }
      const res = await orderApi.getSellerOrders({ pageNumber: 1, pageSize: 50 });
      console.log('Seller orders response:', res);
      const items = res?.items || res || [];
      setOrders(items);
    } catch (err) {
      console.error('Failed to fetch seller orders detail:', err);
      toast.error(err?.message || err?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      const statusMessage = 
        newStatus === 'confirmed' ? 'Đã xác nhận đơn hàng!' :
        newStatus === 'shipping' ? 'Đã chuyển đơn hàng sang trạng thái Giao hàng!' :
        'Đã hủy đơn hàng!';
      toast.success(statusMessage);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error(err.message || 'Cập nhật trạng thái đơn hàng thất bại');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const salesData = [
    { month: 'T1', sales: 120 },
    { month: 'T2', sales: 150 },
    { month: 'T3', sales: 180 },
    { month: 'T4', sales: 160 },
    { month: 'T5', sales: 200 },
    { month: 'T6', sales: 220 },
  ];

  const ordersData = [
    { month: 'T1', sales: 120 },
    { month: 'T2', sales: 150 },
    { month: 'T3', sales: 180 },
    { month: 'T4', sales: 160 },
    { month: 'T5', sales: 200 },
    { month: 'T6', sales: 220 },
  ];

  const negotiations = [
    {
      id: 'TL001',
      supplier: 'Hộ nuôi Phát Đạt',
      product: 'Tôm sú size 15-20',
      quantity: '20 tấn',
      status: 'Đang thương lượng'
    },
    {
      id: 'TL002',
      supplier: 'Hộ nuôi Miền Tây',
      product: 'Cá Tra',
      quantity: '50 tấn',
      status: 'Chờ báo giá'
    }
  ];

  const contracts = [
    {
      id: 'HD001',
      supplier: 'Hộ nuôi Phát Đạt',
      product: 'Tôm sú',
      startDate: '01/03/2026',
      endDate: '01/06/2026',
      status: 'Đang hiệu lực'
    }
  ];

  const tabs = [
    { id: 'orders', label: 'Đơn hàng của bạn', icon: Package },
    { id: 'negotiations', label: 'Đơn đang thương lượng', icon: MessageSquare },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'history', label: 'Lịch sử giao dịch', icon: History },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">Chờ xác nhận</span>;
      case 'confirmed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">Đã xác nhận</span>;
      case 'shipping':
        return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">Đang giao hàng</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Hoàn thành</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">Đã hủy</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 font-bold text-2xl" style={{ color: '#0A2647' }}>Dashboard Quản lý Đơn hàng & Kinh doanh</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tổng đơn hàng</span>
              <Package className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>{orders.length}</p>
            <p className="text-xs text-green-600 mt-1">Cập nhật thực tế</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Doanh thu</span>
              <DollarSign className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>
              {orders
                .filter(o => o.status === 'completed' || o.status === 'confirmed' || o.status === 'shipping')
                .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
                .toLocaleString('vi-VN')} đ
            </p>
            <p className="text-xs text-green-600 mt-1">Tổng tiền đơn khả thi</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Đơn chờ xác nhận</span>
              <MessageSquare className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>
              {orders.filter(o => o.status === 'pending').length}
            </p>
            <p className="text-xs text-amber-600 mt-1">Cần duyệt ngay</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Đơn đang giao</span>
              <FileText className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>
              {orders.filter(o => o.status === 'shipping').length}
            </p>
            <p className="text-xs text-indigo-600 mt-1">Đang vận chuyển</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="mb-4 font-bold" style={{ color: '#0A2647' }}>Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#00BCD4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="mb-4 font-bold" style={{ color: '#0A2647' }}>Đơn hàng theo tháng</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#0A2647" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b overflow-x-auto" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-b-2 font-semibold'
                        : 'text-gray-500'
                    }`}
                    style={{
                      borderColor: activeTab === tab.id ? '#00BCD4' : 'transparent',
                      color: activeTab === tab.id ? '#0A2647' : undefined
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div>
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00BCD4]" />
                    <span className="ml-2 text-gray-600">Đang tải danh sách đơn hàng...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                          <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>Mã đơn</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>Ngày đặt</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>Người mua</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>Sản phẩm</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>Tổng tiền</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>Trạng thái</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold" style={{ color: '#0A2647' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                            <td className="py-3 px-4 text-sm font-medium">#{order.id}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                              {order.buyerName || `Buyer #${order.buyerId}`}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {order.orderItems && order.orderItems.length > 0 ? (
                                order.orderItems.map(item => (
                                  <div key={item.id} className="text-gray-800">
                                    • {item.productName} (x{item.quantity})
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-400">Không có thông tin</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold" style={{ color: '#d4183d' }}>
                              {(order.totalPrice || 0).toLocaleString('vi-VN')} đ
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="py-3 px-4 text-sm text-center">
                              {order.status === 'pending' && (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                    disabled={updatingOrderId === order.id}
                                    className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    {updatingOrderId === order.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                    Xác nhận đơn
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                    disabled={updatingOrderId === order.id}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    Hủy
                                  </button>
                                </div>
                              )}

                              {order.status === 'confirmed' && (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'shipping')}
                                    disabled={updatingOrderId === order.id}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    {updatingOrderId === order.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Truck className="w-3 h-3" />
                                    )}
                                    Giao hàng
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                    disabled={updatingOrderId === order.id}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    Hủy
                                  </button>
                                </div>
                              )}

                              {order.status === 'shipping' && (
                                <span className="text-xs text-indigo-600 font-medium">Đang vận chuyển</span>
                              )}

                              {order.status === 'completed' && (
                                <span className="text-xs text-green-600 font-medium">Hoàn tất</span>
                              )}

                              {order.status === 'cancelled' && (
                                <span className="text-xs text-red-500 font-medium">Đã hủy</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'negotiations' && (
              <div className="space-y-4">
                {negotiations.map((negotiation) => (
                  <div key={negotiation.id} className="border rounded-lg p-4" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1 font-semibold" style={{ color: '#0A2647' }}>{negotiation.supplier}</h4>
                        <p className="text-sm text-gray-600">{negotiation.product} - {negotiation.quantity}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                        {negotiation.status}
                      </span>
                    </div>
                    <button 
                      className="mt-3 px-4 py-2 rounded-md text-white text-sm cursor-pointer"
                      style={{ backgroundColor: '#00BCD4' }}
                    >
                      Tiếp tục thương lượng
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Mã HĐ</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Nhà cung cấp</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Sản phẩm</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Ngày bắt đầu</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Ngày kết thúc</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr key={contract.id} className="border-b" style={{ borderColor: '#e5e7eb' }}>
                        <td className="py-3 px-4 text-sm">{contract.id}</td>
                        <td className="py-3 px-4 text-sm">{contract.supplier}</td>
                        <td className="py-3 px-4 text-sm">{contract.product}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{contract.startDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{contract.endDate}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {contract.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center py-12 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Lịch sử giao dịch sẽ được hiển thị tại đây</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có thông báo mới</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}