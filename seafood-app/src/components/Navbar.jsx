import { useState, useRef, useEffect } from "react";
import { Menu, X, ShoppingCart, Power, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { authApi } from "../api/auth";

// NHẬN prop user trực tiếp từ App.jsx truyền xuống ở đây
export function Navbar({ currentPage, onNavigate, cartCount, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ĐÃ XÓA: Bỏ hoàn toàn dòng const [user, setUser] = useState(...) gây lỗi lệch state cũ

  const menuItems = [
    { id: "home", label: "Trang chủ", roles: ["guest"] },
    {
      id: "supply",
      label: "Sản lượng",
      roles: ["business", "buyer", "farmer", "seller", "guest", "admin"],
    },
    {
      id: "suppliers",
      label: "Tìm nguồn hải sản",
      roles: ["business", "buyer", "farmer", "seller", "guest", "admin"],
    },
    { id: "retail", label: "Mua lẻ", roles: ["buyer", "guest", "farmer", "seller", "business", "admin"] },
    { id: "dashboard", label: "Quản lý", roles: ["farmer", "seller"] },
    { id: "admin-dashboard", label: "Admin Dashboard", roles: ["admin"] },
    { id: "admin-orders", label: "Quản lý đơn hàng", roles: ["admin"] },
    { id: "product-approval", label: "Duyệt sản phẩm", roles: ["admin"] },
    { id: "checkout", label: "Thanh toán", roles: ["buyer"] },
    { id: "b2b-cart", label: "Giỏ hàng B2B", roles: ["business"] },
    { id: "contact", label: "Liên hệ", roles: ["guest"] },
    {
      id: "listing-management",
      label: "Quản lý bài đăng",
      roles: ["farmer", "seller"],
    },
    {
      id: "order-management",
      label: "Lịch sử đơn hàng",
      roles: ["buyer", "business", "farmer", "seller"],
    },
    {
      id: "seller-center",
      label: "Seller Center",
      roles: ["farmer", "seller"],
    },
  ];

  // Lọc danh sách menu dựa trên prop user động
  const filteredMenu = menuItems.filter((item) => {
    if (!user) return item.roles.includes("guest");
    return item.roles.includes(user?.role?.toLowerCase() || "");
  });

  const MAX_VISIBLE_ITEMS = 4;
  const visibleMenu = filteredMenu.slice(0, MAX_VISIBLE_ITEMS);
  const dropdownMenu = filteredMenu.slice(MAX_VISIBLE_ITEMS);

  const isCurrentPageInDropdown = dropdownMenu.some(
    (item) => item.id === currentPage,
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đăng xuất gọi hàm chuyển hướng của App để App xóa sạch State user
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Failed to call logout API:", error);
    }
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    if (onNavigate) {
      onNavigate("home");
    }
    // reload nhẹ hoặc ép đổi trạng thái ở App.jsx
    window.location.reload();
  };

  return (
    <nav className="sticky top-4 z-[999] w-[92%] xl:w-[85%] max-w-[1440px] mx-auto">
      <div className="bg-white border border-gray-100 rounded-full shadow-lg px-6 py-2 flex items-center justify-between transition-all duration-300">
        {/* Logo */}
        <button
          onClick={() => onNavigate?.("home")}
          className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Logo imgHeight="h-10" />
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1.5">
          {visibleMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="px-4 py-2 rounded-full transition-all whitespace-nowrap text-sm font-semibold cursor-pointer"
              style={{
                backgroundColor:
                  currentPage === item.id ? "#0A2647" : "transparent",
                color: currentPage === item.id ? "white" : "#0A2647",
              }}
            >
              {item.label}
            </button>
          ))}

          {/* Dropdown "DANH MỤC" */}
          {dropdownMenu.length > 0 && (
            <div className="relative pr-1" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 rounded-full transition-all whitespace-nowrap text-sm font-semibold flex items-center gap-1.5 hover:bg-gray-100 cursor-pointer"
                style={{
                  backgroundColor:
                    isCurrentPageInDropdown || isDropdownOpen
                      ? "#0A2647"
                      : "transparent",
                  color:
                    isCurrentPageInDropdown || isDropdownOpen
                      ? "white"
                      : "#0A2647",
                }}
              >
                <span>Thêm</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                  {dropdownMenu.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate?.(item.id);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 font-semibold cursor-pointer"
                      style={{
                        color: currentPage === item.id ? "#00BCD4" : "#0A2647",
                        backgroundColor:
                          currentPage === item.id ? "#F0F9FF" : "transparent",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* GIỎ HÀNG */}
          <button
            onClick={() => onNavigate?.("cart")}
            className="p-2.5 hover:bg-gray-100 rounded-full relative cursor-pointer text-[#0A2647] hover:scale-105 transition-transform"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {!user ? (
            <button
              onClick={() => onNavigate?.("login")}
              className="bg-slate-900 text-white rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
            >
              Đăng nhập
            </button>
          ) : (
            <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
              {/* User Avatar Clickable to profile */}
              <button
                onClick={() => onNavigate?.("profile")}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-[#0A2647] text-white flex items-center justify-center font-bold text-sm border border-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
                title="Trang cá nhân"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>

              <div className="text-left hidden xl:block">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                  {user.role}
                </p>
                <p className="text-sm font-bold text-[#0A2647] max-w-[100px] truncate">
                  {user.name}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 hover:bg-red-50 rounded-full text-red-500 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <Power className="w-5.5 h-5.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 space-y-2 animate-fade-in">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate?.(item.id);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                backgroundColor:
                  currentPage === item.id ? "#0A2647" : "transparent",
                color: currentPage === item.id ? "white" : "#0A2647",
              }}
            >
              {item.label}
            </button>
          ))}
          {!user ? (
            <button
              onClick={() => onNavigate?.("login")}
              className="w-full mt-4 py-3 rounded-xl text-white font-bold text-sm cursor-pointer"
              style={{ backgroundColor: "#00BCD4" }}
            >
              Đăng nhập
            </button>
          ) : (
            <div className="pt-2 border-t mt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate?.("profile");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                👤 Trang cá nhân ({user.name})
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-red-500 text-red-500 font-bold text-sm cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
