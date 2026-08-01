import { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, RotateCcw, ShoppingBag, HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { orderApi } from '../../api/products';

export function PaymentFailPage({ orderId, onNavigate }) {
  const [reason, setReason] = useState('Giao dịch chưa được hoàn tất hoặc đã bị hủy bởi người dùng.');
  const [displayCode, setDisplayCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetOrderId = params.get('orderId') || orderId;
    const orderCode = params.get('orderCode') || targetOrderId;
    const isCancel = params.get('cancel') === 'true' || params.get('status') === 'CANCELLED';
    
    setDisplayCode(orderCode || targetOrderId || 'VAM-' + Math.floor(100000 + Math.random() * 900000));

    if (isCancel) {
      setReason('Bạn đã chủ động hủy giao dịch trên cổng thanh toán.');
    } else {
      setReason('Hệ thống thanh toán không nhận được phản hồi xác thực hoặc quá thời gian xử lý.');
    }

    // Tự động gửi API cập nhật trạng thái đơn sang 'cancelled' nếu phát hiện targetOrderId
    if (targetOrderId && !isNaN(Number(targetOrderId))) {
      orderApi.updateOrderStatus(Number(targetOrderId), 'cancelled')
        .then(() => {
          console.log(`Đã tự động hủy thành công đơn hàng #${targetOrderId} trên backend`);
        })
        .catch(err => {
          console.warn(`Lỗi khi tự động hủy đơn #${targetOrderId}:`, err);
        });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-rose-900 via-[#4A0E17] to-rose-950 p-8 sm:p-10 text-center text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/30 shadow-inner">
                <XCircle className="w-12 h-12" />
              </div>
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white mb-3 tracking-wider uppercase">
                Thanh toán không thành công
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Giao dịch bị gián đoạn</h1>
              <p className="text-rose-100 text-sm mt-2 max-w-md mx-auto">
                Đừng lo lắng, đơn hàng của bạn vẫn chưa bị tính tiền và các sản phẩm vẫn còn lưu trong giỏ hàng.
              </p>
            </div>
          </div>

          {/* Chi tiết nguyên nhân */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Thẻ lý do lỗi */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50/50 rounded-xl p-5 border border-red-100 flex items-start gap-4">
              <div className="p-2.5 bg-white rounded-lg text-red-500 shadow-sm flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-red-600 font-bold uppercase tracking-wider block">Lý do thất bại</span>
                <p className="text-sm font-semibold text-[#0A2647]">{reason}</p>
                {displayCode && (
                  <p className="text-xs text-gray-500 mt-1">Mã tham chiếu đơn: <strong className="text-gray-700">#{displayCode}</strong></p>
                )}
              </div>
            </div>

            {/* Gợi ý hướng xử lý */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs text-gray-600">
              <span className="font-bold text-[#0A2647] text-sm block mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Hướng dẫn xử lý:
              </span>
              <ul className="list-disc list-inside space-y-1 pl-1 text-gray-600">
                <li>Kiểm tra lại số dư tài khoản hoặc hạn mức thanh toán của thẻ/ví điện tử.</li>
                <li>Thử lại phương thức thanh toán **Chuyển khoản thủ công** hoặc **Thanh toán khi nhận hàng (COD)**.</li>
                <li>Liên hệ bộ phận chăm sóc khách hàng VAM Seafood nếu bạn cần hỗ trợ thêm.</li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate('checkout')}
                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-white transition-all shadow-md shadow-cyan-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                style={{ backgroundColor: '#00BCD4' }}
              >
                <RotateCcw className="w-4.5 h-4.5" />
                <span>Thử lại thanh toán</span>
              </button>

              <button
                onClick={() => onNavigate('cart')}
                className="py-3.5 px-6 rounded-xl font-bold border border-gray-200 text-[#0A2647] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Về giỏ hàng</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="py-3.5 px-4 rounded-xl font-medium text-gray-500 hover:text-[#0A2647] hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                title="Hỗ trợ khách hàng"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Hỗ trợ</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
