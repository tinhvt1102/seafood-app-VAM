import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ShoppingBag, Loader2, ArrowRight, AlertCircle, RefreshCw, Eye, MapPin, Phone, User, Calendar, X, FileText, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { orderApi } from '../../api/products';

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop';

const parseProductImageUrl = (raw) => {
  if (!raw) return null;

  let url = null;
  if (Array.isArray(raw)) {
    url = raw[0];
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          url = parsed[0];
        }
      } catch (e) {
        url = trimmed;
      }
    } else if (trimmed.includes(',')) {
      url = trimmed.split(',')[0].trim();
    } else {
      url = trimmed;
    }
  }

  if (!url || typeof url !== 'string') return null;

  url = url.replace(/^['"]|['"]$/g, '');
  if (!url) return null;

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return `https://vam-be.onrender.com${url}`;
  }
  if (url.startsWith('uploads/')) {
    return `https://vam-be.onrender.com/${url}`;
  }

  return url;
};

const getOrderItemImage = (item) => {
  const parsed = parseProductImageUrl(item?.productImageUrls) ||
    parseProductImageUrl(item?.image) ||
    parseProductImageUrl(item?.imageUrl) ||
    parseProductImageUrl(item?.images);
  return parsed || DEFAULT_PRODUCT_IMAGE;
};

export function OrderHistoryPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching my orders with orderApi:', orderApi);
      if (!orderApi || typeof orderApi.getMyOrders !== 'function') {
        console.warn('orderApi.getMyOrders is not defined on imported object');
        return;
      }
      const res = await orderApi.getMyOrders({ pageNumber: 1, pageSize: 50 });
      console.log('My orders API response:', res);
      const items = res?.items || res || [];
      setOrders(items);
    } catch (err) {
      console.error('Failed to fetch buyer orders:', err);
      toast.error(err?.message || err?.data?.message || 'Không thể tải lịch sử đơn hàng của bạn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      if (newStatus === 'completed') {
        toast.success('Cảm ơn bạn đã xác nhận nhận hàng!');
      } else if (newStatus === 'cancelled') {
        toast.success('Đã hủy đơn hàng thành công');
      }
      fetchMyOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error(err?.message || 'Thao tác thất bại. Vui lòng thử lại.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(o => o.status?.toLowerCase() === activeTab);
  };

  const filteredOrders = getFilteredOrders();

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác nhận
          </span>
        );
      case 'shipping':
        return (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Truck className="w-3.5 h-3.5" /> Đang giao hàng
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const tabs = [
    { id: 'all', label: 'Tất cả đơn', count: orders.length },
    { id: 'pending', label: 'Chờ xác nhận', count: orders.filter(o => o.status === 'pending').length },
    { id: 'confirmed', label: 'Đã xác nhận', count: orders.filter(o => o.status === 'confirmed').length },
    { id: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
    { id: 'completed', label: 'Hoàn thành', count: orders.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 py-8">
      <Toaster position="top-right" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#00BCD4] uppercase">Quản lý đơn hàng</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: '#0A2647' }}>
              Lịch sử mua hàng của bạn
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Theo dõi và quản lý quá trình vận chuyển các đơn hàng hải sản
            </p>
          </div>
          <button
            onClick={fetchMyOrders}
            className="self-start md:self-auto px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-[#0A2647] flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === tab.id
                    ? 'bg-[#0A2647] text-white shadow-md shadow-slate-200'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === tab.id
                        ? 'bg-[#00BCD4] text-white'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-[#00BCD4] mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">Đang tải lịch sử đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00BCD4]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-[#0A2647] mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn chưa có đơn hàng nào ở trạng thái này. Hãy khám phá ngay các hải sản tươi ngon trên VAM!
            </p>
            <button
              onClick={() => onNavigate?.('retail')}
              className="px-6 py-3 bg-[#00BCD4] hover:bg-cyan-600 text-white rounded-xl text-sm font-bold shadow-md shadow-cyan-200 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Mua hải sản ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden p-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#0A2647] to-slate-800 text-[#00BCD4] rounded-2xl shadow-sm flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0A2647] text-base">Đơn hàng #{order.id}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items List */}
                <div className="py-4 space-y-3">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4">
                          <img
                            src={getOrderItemImage(item)}
                            alt={item.productName || 'Hải sản'}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-gray-100 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                          <div>
                            <h4 className="text-sm sm:text-base font-extrabold text-[#0A2647] line-clamp-1 group-hover:text-[#00BCD4] transition-colors">
                              {item.productName || `Sản phẩm #${item.productId}`}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Số lượng: <span className="font-bold text-[#0A2647]">x{item.quantity}</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-medium">Đơn giá</p>
                          <p className="text-sm font-bold text-gray-800 mt-0.5">
                            {(item.price || 0).toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Chi tiết sản phẩm chưa cập nhật</p>
                  )}
                </div>

                {/* Order Footer Bar */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Tổng cộng: </span>
                    <span className="text-lg font-extrabold text-[#d4183d]">
                      {(order.totalPrice || 0).toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {/* Actions based on status */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 border border-gray-200 text-[#0A2647] hover:bg-gray-50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00BCD4]" />
                      Chi tiết đơn
                    </button>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        disabled={updatingId === order.id}
                        className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {updatingId === order.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Hủy đơn hàng
                      </button>
                    )}

                    {order.status === 'shipping' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        disabled={updatingId === order.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Đã nhận được hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Chi tiết đơn hàng */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 overflow-hidden space-y-0 relative">

              {/* HERO SECTION TRÊN ĐẦU: HIỂN THỊ HÌNH ẢNH SẢN PHẨM BỰ */}
              <div className="relative w-full h-64 sm:h-72 bg-gradient-to-br from-[#0A2647] via-slate-800 to-slate-900 overflow-hidden group">
                <img
                  src={getOrderItemImage(selectedOrder.orderItems?.[0])}
                  alt={selectedOrder.orderItems?.[0]?.productName || 'Hải sản'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />

                {/* Visual Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2647] via-[#0A2647]/50 to-black/30" />

                {/* Close Button Top Right */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full transition-all cursor-pointer shadow-lg z-20 hover:scale-110 active:scale-95"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Info Content Overlay at Bottom of Hero */}
                <div className="absolute bottom-5 left-6 right-6 flex flex-col justify-end text-white z-10">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-[#00BCD4] text-white rounded-full text-xs font-extrabold tracking-wide shadow-md">
                      Đơn hàng #{selectedOrder.id}
                    </span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white line-clamp-1 drop-shadow-md">
                    {selectedOrder.orderItems?.[0]?.productName || `Đơn hàng #${selectedOrder.id}`}
                  </h2>

                  <p className="text-xs text-cyan-100/90 mt-1 flex items-center gap-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#00BCD4]" />
                    <span>Ngày đặt: {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : 'N/A'}</span>
                    {selectedOrder.orderItems?.length > 1 && (
                      <span className="ml-1 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[11px] font-semibold text-white">
                        +{selectedOrder.orderItems.length - 1} sản phẩm khác
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 sm:p-8 space-y-6">

                {/* Status Banner */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00BCD4]" />
                    <span className="text-xs font-bold text-[#0A2647] uppercase tracking-wider">Trạng thái xử lý</span>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Shipping Address */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A2647] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#00BCD4]" /> Địa chỉ giao hàng
                  </span>
                  <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100/60 text-sm text-gray-700">
                    <p className="font-bold text-[#0A2647]">{selectedOrder.buyerName || 'Khách hàng'}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{selectedOrder.shippingAddress || 'Chưa cung cấp địa chỉ'}</p>
                  </div>
                </div>

                {/* Product Items Breakdown */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A2647]">Danh sách sản phẩm đã đặt</span>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    {selectedOrder.orderItems?.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={getOrderItemImage(item)}
                            alt={item.productName || 'Hải sản'}
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0 shadow-xs"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                          <div>
                            <p className="text-sm font-extrabold text-[#0A2647] line-clamp-1">{item.productName || `Sản phẩm #${item.productId}`}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Số lượng: <span className="font-bold text-[#0A2647]">x{item.quantity}</span></p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400 font-medium">Thành tiền</p>
                          <p className="text-sm font-bold text-[#0A2647] mt-0.5">
                            {(item.price || 0).toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Box */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-semibold text-[#0A2647]">{(selectedOrder.totalPrice || 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-extrabold pt-3 border-t border-gray-100 text-[#0A2647]">
                    <span>Tổng thanh toán:</span>
                    <span className="text-xl sm:text-2xl text-[#d4183d]">{(selectedOrder.totalPrice || 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                {/* Actions inside Modal */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {selectedOrder.status === 'shipping' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                      disabled={updatingId === selectedOrder.id}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {updatingId === selectedOrder.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Xác nhận đã nhận được hàng
                    </button>
                  )}

                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      disabled={updatingId === selectedOrder.id}
                      className="flex-1 py-3 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {updatingId === selectedOrder.id && <Loader2 className="w-4 h-4 animate-spin" />}
                      Hủy đơn hàng này
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-3 bg-[#0A2647] hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer text-center"
                  >
                    Đóng chi tiết
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
