import { useEffect, useState } from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, Home, Receipt, Calendar, ShieldCheck, MapPin, Phone, User } from 'lucide-react';

export function PaymentSuccessPage({ orderId, onNavigate }) {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Tìm đơn hàng gần nhất trong LocalStorage
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const params = new URLSearchParams(window.location.search);
      const urlOrderCode = params.get('orderCode') || params.get('id') || orderId;

      if (orders.length > 0) {
        const found = urlOrderCode 
          ? orders.find(o => String(o.id) === String(urlOrderCode)) || orders[orders.length - 1]
          : orders[orders.length - 1];
        setOrderDetails(found);
      }
    } catch (e) {
      console.error('Lỗi đọc đơn hàng:', e);
    }
  }, [orderId]);

  const params = new URLSearchParams(window.location.search);
  const displayCode = params.get('orderCode') || orderDetails?.id || orderId || 'VAM-' + Math.floor(100000 + Math.random() * 900000);

  const formatCurrency = (val) => `${(val || 0).toLocaleString('vi-VN')}đ`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#0A2647] via-[#0D3866] to-[#0A2647] p-8 sm:p-10 text-center text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#00BCD4]/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white mb-3 tracking-wider uppercase">
                Thanh toán thành công
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Cảm ơn bạn đã đặt hàng!</h1>
              <p className="text-cyan-100 text-sm mt-2 max-w-md mx-auto">
                Đơn hàng của bạn đã được ghi nhận thành công và đang được chuẩn bị để giao tới bạn.
              </p>
            </div>
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Mã đơn & Thời gian */}
            <div className="bg-gradient-to-br from-[#F0F9FF] to-cyan-50/50 rounded-xl p-5 border border-cyan-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-lg text-[#00BCD4] shadow-sm">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Mã đơn hàng</span>
                  <strong className="text-lg font-bold text-[#0A2647]">#{displayCode}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/80 px-3 py-2 rounded-lg border border-cyan-100">
                <Calendar className="w-4 h-4 text-[#00BCD4]" />
                <span>{new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Danh sách sản phẩm mua */}
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#0A2647] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-[#00BCD4]" /> Sản phẩm đã đặt ({orderDetails.items.length})
                </h3>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white">
                  {orderDetails.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#0A2647] truncate">{item.name}</p>
                          <span className="text-xs text-gray-500">Số lượng: {item.quantity} kg</span>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-[#d4183d] whitespace-nowrap">
                        {formatCurrency((item.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thông tin thanh toán & Giao hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2 text-xs">
                <span className="font-bold text-[#0A2647] text-sm block mb-1">Phương thức thanh toán</span>
                <p className="text-gray-600 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {orderDetails?.paymentMethod === 'payos' ? 'Thanh toán PayOS (VietQR)' :
                   orderDetails?.paymentMethod === 'bank' ? 'Chuyển khoản Ngân hàng' :
                   orderDetails?.paymentMethod === 'ewallet' ? 'Ví điện tử' : 'Thanh toán khi nhận hàng (COD)'}
                </p>
                <p className="text-gray-500">Trạng thái: <strong className="text-emerald-600 font-bold">Đã xác nhận</strong></p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2 text-xs">
                <span className="font-bold text-[#0A2647] text-sm block mb-1">Tổng quan chi phí</span>
                <div className="flex justify-between text-gray-600">
                  <span>Tiền hàng:</span>
                  <span className="font-medium text-gray-800">{formatCurrency(orderDetails?.subtotal || orderDetails?.total || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí dịch vụ:</span>
                  <span className="font-medium text-gray-800">{formatCurrency(orderDetails?.serviceFee || 0)}</span>
                </div>
                <div className="flex justify-between text-[#0A2647] font-bold text-sm pt-1 border-t border-gray-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-[#d4183d] font-extrabold">{formatCurrency(orderDetails?.total || 0)}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => onNavigate('order-management')}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-md shadow-cyan-200 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: '#00BCD4' }}
              >
                <span>Xem đơn hàng của tôi</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="py-3 px-6 rounded-xl font-bold border border-gray-200 text-[#0A2647] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
