import { useState } from 'react';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

export function CheckoutPage({ onNavigate, cart = [] }) {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50000 : 0;
  const total = subtotal + shipping;
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    alert('Đặt hàng thành công!');
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8" style={{ color: '#0A2647' }}>Thanh toán</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="mb-6" style={{ color: '#0A2647' }}>Thông tin giao hàng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Họ và tên *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 border rounded-md"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    required
                    pattern="[0-9]{10,11}"
                    className="w-full p-3 border rounded-md"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="0901234567"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-md"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="email@example.com"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">Địa chỉ giao hàng *</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 border rounded-md mb-3"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="Số nhà, tên đường"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select required className="p-3 border rounded-md" style={{ borderColor: '#e5e7eb' }}>
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Cà Mau</option>
                  </select>
                  <select required className="p-3 border rounded-md" style={{ borderColor: '#e5e7eb' }}>
                    <option value="">Chọn Quận/Huyện</option>
                    <option>Quận 1</option>
                    <option>Quận 2</option>
                    <option>Quận 3</option>
                    <option>Quận 4</option>
                    <option>Quận 5</option>
                    <option>Quận 6</option>
                    <option>Quận 7</option>
                    <option>Quận 8</option>
                    <option>Quận 9</option>
                    <option>Quận 10</option>
                    <option>Quận 11</option>
                    <option>Quận 12</option>
                  </select>
                  <select required className="p-3 border rounded-md" style={{ borderColor: '#e5e7eb' }}>
                    <option value="">Chọn Phường/Xã</option>
                    <option>Phường 1</option>
                    <option>Phường 2</option>
                    <option>Phường 3</option>
                    <option>Phường 4</option>
                    <option>Phường 5</option>
                    <option>Phường 6</option>
                    <option>Phường 7</option>
                    <option>Phường 8</option>
                    <option>Phường 9</option>
                    <option>Phường 10</option>

                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">Ghi chú đơn hàng (tuỳ chọn)</label>
                <textarea 
                  rows={3}
                  className="w-full p-3 border rounded-md"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="Ghi chú về đơn hàng..."
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="mb-6" style={{ color: '#0A2647' }}>Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label 
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'bank' ? 'border-[#00BCD4] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5" style={{ color: '#0A2647' }} />
                  <span>Chuyển khoản ngân hàng</span>
                </label>
                <label 
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'ewallet' ? 'border-[#00BCD4] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="ewallet"
                    checked={paymentMethod === 'ewallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <Wallet className="w-5 h-5" style={{ color: '#0A2647' }} />
                  <span>Ví điện tử (Momo, ZaloPay)</span>
                </label>
                <label 
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'cod' ? 'border-[#00BCD4] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <Banknote className="w-5 h-5" style={{ color: '#0A2647' }} />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
              </div>
              {paymentMethod === 'bank' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Quý khách vui lòng chuyển khoản theo thông tin sau:
                  </p>
                  <div className="text-sm space-y-1">
                    <p><strong>Ngân hàng:</strong> Vietcombank - Chi nhánh TP.HCM</p>
                    <p><strong>Số tài khoản:</strong> 1234567890</p>
                    <p><strong>Chủ tài khoản:</strong> Công ty VAM</p>
                    <p><strong>Nội dung:</strong> Thanh toán đơn hàng #[Mã đơn hàng]</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="mb-4" style={{ color: '#0A2647' }}>Đơn hàng của bạn</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b max-h-[300px] overflow-y-auto" style={{ borderColor: '#e5e7eb' }}>
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Giỏ hàng trống</p>
                )}
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>{shipping.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-medium" style={{ color: '#0A2647' }}>Tổng cộng</span>
                <span className="text-xl font-bold" style={{ color: '#d4183d' }}>
                  {total.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <button 
                type="submit"
                className="w-full py-3 rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#00BCD4' }}
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}