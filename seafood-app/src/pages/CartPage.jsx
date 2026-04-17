import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';


export function CartPage({ cartItems, setCartItems, onNavigate }) {  
  const updateQuantity = (id, newQuantity) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8" style={{ color: '#0A2647' }}>Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2" style={{ color: '#0A2647' }}>Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <button 
              onClick={() => onNavigate('retail')}
              className="px-6 py-3 rounded-md text-white"
              style={{ backgroundColor: '#00BCD4' }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 line-clamp-2" style={{ color: '#0A2647' }}>{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">Xuất xứ: {item.origin}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold" style={{ color: '#d4183d' }}>
                          {item.price.toLocaleString('vi-VN')}đ/kg
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-md" style={{ borderColor: '#e5e7eb' }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x" style={{ borderColor: '#e5e7eb' }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="mb-4" style={{ color: '#0A2647' }}>Tổng đơn hàng</h3>
                
                <div className="space-y-3 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
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
                  onClick={() => onNavigate('checkout')}
                  className="w-full py-3 rounded-md text-white hover:opacity-90 transition-opacity mb-3"
                  style={{ backgroundColor: '#00BCD4' }}
                >
                  Tiến hành thanh toán
                </button>

                <button 
                  onClick={() => onNavigate('retail')}
                  className="w-full py-3 border rounded-md hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#0A2647', color: '#0A2647' }}
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
