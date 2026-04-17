import { useState } from 'react';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { Logo } from './Logo';

export function Navbar({ currentPage, onNavigate, cartCount }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('currentUser'));

  const menuItems = [
    { id: 'home', label: 'Trang chủ', roles: ['all'] },
    { id: 'supply', label: 'Sản lượng', roles: ['farmer', 'business', 'admin','buyer'] },
    { id: 'suppliers', label: 'Tìm nguồn hải sản', roles: ['business', 'admin'] },
    { id: 'retail', label: 'Mua lẻ', roles: ['buyer', 'guest', 'admin'] },
    { id: 'dashboard', label: 'Quản lý', roles: [ 'farmer', 'admin'] },
    { id: 'checkout', label: 'Thanh toán', roles: ['buyer', 'admin'] },
    { id: 'contact', label: 'Liên hệ', roles: ['all'] },
  ];

  const filteredMenu = menuItems.filter(item => {
    if (item.roles.includes('all')) return true;
    if (!user) return item.roles.includes('guest');
    return item.roles.includes(user.role);
  });

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onNavigate('home');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex-shrink-0">
            <Logo />
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {filteredMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${currentPage === item.id ? 'text-white' : 'hover:bg-gray-100'
                  }`}
                style={{
                  backgroundColor: currentPage === item.id ? '#0A2647' : 'transparent',
                  color: currentPage === item.id ? 'white' : '#0A2647',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* GIỎ HÀNG: Đã xóa điều kiện, luôn luôn hiển thị */}
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart className="w-6 h-6" style={{ color: '#0A2647' }} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {!user ? (
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-md text-white hover:opacity-90 font-medium"
                style={{ backgroundColor: '#00BCD4' }}
              >
                Đăng nhập / Đăng ký
              </button>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right">
                  <p className="text-xs text-gray-500 leading-none">{user.role.toUpperCase()}</p>
                  <p className="text-sm font-bold text-[#0A2647]">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md font-medium"
                style={{
                  backgroundColor: currentPage === item.id ? '#0A2647' : 'transparent',
                  color: currentPage === item.id ? 'white' : '#0A2647',
                }}
              >
                {item.label}
              </button>
            ))}
            {!user ? (
              <button
                onClick={() => onNavigate('login')}
                className="w-full mt-4 py-3 rounded-md text-white font-bold"
                style={{ backgroundColor: '#00BCD4' }}
              >
                Đăng nhập
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full mt-4 py-3 rounded-md border border-red-500 text-red-500 font-bold"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}