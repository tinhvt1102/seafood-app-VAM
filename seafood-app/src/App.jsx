import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Homepage } from './pages/Homepage';
import { SupplyPage } from './pages/SupplyPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { RetailPage } from './pages/RetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FarmProfilePage } from './pages/FarmProfilePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ContactPage } from './pages/ContactPage';
import { B2BCartPage } from './pages/B2BCartPage';
import { ListingManagementPage } from './pages/ListingManagementPage';
import { OrderManagementPage } from './pages/OrderManagementPage';
import { SellerCenterPage } from './pages/SellerCenterPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  // 1. Tải thông tin User và Giỏ hàng từ LocalStorage khi vào ứng dụng
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // 2. Tự động đồng bộ Giỏ hàng vào LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Hàm thêm vào giỏ hàng thông minh (Đã sửa lỗi biến addQty bằng quantity động)
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const isExist = prevItems.find(item => item.id === product.id);
      if (isExist) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      // Nếu chưa có, thêm mới đầy đủ thông tin sản phẩm
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          origin: product.origin,
          quantity: quantity
        }
      ];
    });

    alert(`Đã thêm ${quantity}kg ${product.name} vào giỏ hàng thành công!`);
  };

  // Hàm Mua ngay thông minh: Đồng bộ dữ liệu và chuyển trang lập tức
  const handleBuyNow = (product, quantity = 1) => {
    const directItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      origin: product.origin,
      quantity: quantity
    };
    localStorage.setItem('directCheckoutItem', JSON.stringify(directItem));
    handleNavigate('checkout');
  };

  // 4. Xử lý đăng nhập thành công
  const handleLoginSuccess = (targetPage) => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(savedUser);
    setCurrentPage(targetPage);
    window.scrollTo(0, 0);
  };

  // 5. Điều hướng trang
  const handleNavigate = (page, id) => {
    setCurrentPage(page);
    setPageData({ id });
    window.scrollTo(0, 0);
  };

  // 6. Hệ thống phân quyền truy cập trang (Role-based Authentication)
  const canAccess = (page) => {
    if (!user) {
      return ['home', 'login', 'contact', 'retail', 'product-detail', 'cart', 'checkout'].includes(page);
    }
    const role = user.role?.toLowerCase();
    if (role === 'admin') return true;
    switch (role) {
      case 'buyer':
        return ['home', 'retail', 'product-detail', 'cart', 'checkout', 'supply', 'contact'].includes(page);
      case 'farmer':
        return ['home', 'supply', 'dashboard', 'contact'].includes(page);
      case 'business':
        return ['home', 'supply', 'suppliers', 'contact', 'farm-profile'].includes(page);
      default:
        return ['home', 'contact'].includes(page);
    }
  };

  // 7. Render trang dựa trên phân quyền và trạng thái điều hướng
  const renderPage = () => {
    if (!canAccess(currentPage)) {
      return <Homepage onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={handleNavigate} />;
      case 'retail':
        return <RetailPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'product-detail':
        return (
          <ProductDetailPage
            productId={pageData.id}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        );
      case 'farm-profile':
        return <FarmProfilePage farmId={pageData.id} />;
      case 'cart':
        return <CartPage cartItems={cartItems} setCartItems={setCartItems} onNavigate={handleNavigate} />;
      case 'supply':
        return <SupplyPage onNavigate={handleNavigate} />;
      case 'suppliers':
        return <SuppliersPage onNavigate={handleNavigate} />;
      case 'checkout':
        // Đã đồng bộ prop chính xác sang CheckoutPage: Đổi tên cartItems thành cart, setCartItems thành setCart
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
            cart={cartItems}
            setCart={setCartItems}
          />
        );
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleLoginSuccess} setCartItems={setCartItems} />;
      case 'contact':
        return <ContactPage />;
      case 'b2b-cart':
        return <B2BCartPage onNavigate={handleNavigate} />;
      case 'listing-management':
        return <ListingManagementPage onNavigate={handleNavigate} />;
      case 'order-management':
        return <OrderManagementPage onNavigate={handleNavigate} />;
      case 'seller-center':
        return <SellerCenterPage onNavigate={handleNavigate} />;
      default:
        return <Homepage onNavigate={handleNavigate} />;
    }
  };

  // 8. Tính tổng số lượng item để hiển thị badge trên Navbar
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}