import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Homepage } from './pages/common/Homepage';
import { SupplyPage } from './pages/buyer/SupplyPage';
import { SuppliersPage } from './pages/buyer/SuppliersPage';
import { RetailPage } from './pages/buyer/RetailPage';
import { ProductDetailPage } from './pages/common/ProductDetailPage';
import { FarmProfilePage } from './pages/buyer/FarmProfilePage';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { DashboardPage } from './pages/seller/DashboardPage';
import { LoginPage } from './pages/common/LoginPage';
import { RoleSelectionOverlay } from './components/RoleSelectionOverlay';
import { ProfilePage } from './pages/common/ProfilePage';
import { ContactPage } from './pages/common/ContactPage';
import { B2BCartPage } from './pages/buyer/B2BCartPage';
import { ListingManagementPage } from './pages/seller/ListingManagementPage';
import { OrderManagementPage } from './pages/seller/OrderManagementPage';
import { SellerCenterPage } from './pages/seller/SellerCenterPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ProductApprovalPage } from './pages/admin/ProductApprovalPage';
import { AdminOrderManagementPage } from './pages/admin/AdminOrderManagementPage';
import { PaymentSuccessPage } from './pages/buyer/PaymentSuccessPage';
import { PaymentFailPage } from './pages/buyer/PaymentFailPage';
import { productApi } from './api/products';
import { toast, Toaster } from 'react-hot-toast';
import { getStoredCart, saveStoredCart } from './utils/cartStorage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return getStoredCart(savedUser ? (savedUser.id || savedUser.email) : null);
  });

  // Tải danh sách sản phẩm từ API
  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const res = await productApi.getProducts({ pageSize: 100, status: 'approved' });
        const items = res?.items || res || [];
        if (items.length > 0) {
          const mapped = items.map(item => ({
            id: String(item.id),
            name: item.name,
            image: item.imageUrls?.[0] || item.image || item.imageUrl || 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
            price: typeof item.price === 'number' ? `${item.price.toLocaleString('vi-VN')}đ/kg` : item.price,
            origin: item.origin || 'Việt Nam',
            rating: item.rating || 5,
            reviews: item.reviews || 0,
            description: item.description || '',
            isWholesale: Boolean(item.isWholesale || item.isWholeSale)
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Lỗi tải sản phẩm từ API, sử dụng dữ liệu mặc định:', err);
      }
    };
    fetchApprovedProducts();
  }, []);

  // 1. Tải thông tin User từ LocalStorage khi vào ứng dụng
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. Tải giỏ hàng khi user thay đổi (đọc từ LocalStorage + Cookie Fallback)
  useEffect(() => {
    const userId = user ? (user.id || user.email) : null;
    const cart = getStoredCart(userId);
    setCartItems(cart);
  }, [user]);

  // 3. Tự động đồng bộ Giỏ hàng vào LocalStorage và Cookie mỗi khi giỏ hàng HOẶC user thay đổi
  useEffect(() => {
    const userId = user ? (user.id || user.email) : null;
    saveStoredCart(cartItems, userId);
  }, [cartItems, user]);

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

    // Thay thế alert thành toast.success tại đây
    toast.success(`Đã thêm ${quantity}kg ${product.name} vào giỏ hàng!`);
  };

  // Hàm Mua ngay thông minh: Chuẩn hóa dữ liệu số trước khi lưu
  const handleBuyNow = (product, quantity = 1) => {
    // Ép kiểu giá tiền về dạng số thuần túy, loại bỏ mọi ký tự lạ nếu có
    const cleanPrice = typeof product.price === 'string'
      ? parseInt(product.price.replace(/[^0-9]/g, ''), 10)
      : Number(product.price);

    const directItem = {
      id: product.id,
      name: product.name,
      price: cleanPrice || 0, // Đảm bảo không bị undefined/NaN
      image: product.image,
      origin: product.origin,
      quantity: Number(quantity)
    };

    localStorage.setItem('directCheckoutItem', JSON.stringify(directItem));
    handleNavigate('checkout');
  };

  // 4. Xử lý đăng nhập thành công
  const handleLoginSuccess = (targetPage) => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(savedUser);
    const role = savedUser?.role?.toLowerCase();
    if (role === 'seller' || role === 'farmer') {
      setCurrentPage('seller-center');
    } else if (targetPage && typeof targetPage === 'string' && targetPage !== 'home') {
      setCurrentPage(targetPage);
    } else {
      setCurrentPage('home');
    }
    window.scrollTo(0, 0);
  };

  // Cập nhật trạng thái onboarding vai trò
  const handleStatusUpdated = (newStatus, newRole) => {
    const updatedUser = {
      ...user,
      status: newStatus
    };
    if (newRole) {
      updatedUser.role = newRole;
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // 5. Điều hướng trang và đồng bộ Browser History (HTML5 History API)
  const handleNavigate = (page, id, isPopState = false) => {
    setCurrentPage(page);
    setPageData({ id });
    window.scrollTo(0, 0);

    if (!isPopState) {
      const stateObj = { page, id };
      const url = id ? `?page=${page}&id=${id}` : `?page=${page}`;
      window.history.pushState(stateObj, '', url);
    }
  };

  // Khởi tạo state từ URL khi load trang và lắng nghe sự kiện bấm Nút Back / Forward của trình duyệt
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;
      if (state && state.page) {
        handleNavigate(state.page, state.id, true);
      } else {
        const params = new URLSearchParams(window.location.search);
        const pageFromUrl = params.get('page') || 'home';
        const idFromUrl = params.get('id') || null;
        handleNavigate(pageFromUrl, idFromUrl, true);
      }
    };

    // Khi khởi chạy app lần đầu, thiết lập state ban đầu từ URL
    const params = new URLSearchParams(window.location.search);
    let initialPage = params.get('page');
    const initialId = params.get('id') || params.get('orderCode') || null;

    // Tự động nhận diện kết quả thanh toán từ PayOS redirect URL
    if (params.get('cancel') === 'true' || params.get('status') === 'CANCELLED') {
      initialPage = 'payment-fail';
    } else if (params.get('status') === 'PAID' || (params.get('code') === '00' && initialPage !== 'payment-fail')) {
      initialPage = 'payment-success';
    } else if (!initialPage) {
      initialPage = 'home';
    }

    if (initialPage !== 'home' || initialId) {
      setCurrentPage(initialPage);
      setPageData({ id: initialId });
    }

    if (!window.history.state) {
      window.history.replaceState({ page: initialPage, id: initialId }, '', window.location.search || './');
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 6. Hệ thống phân quyền truy cập trang (Role-based Authentication)
  const canAccess = (page) => {
    if (['home', 'retail', 'supply', 'product-detail', 'contact', 'cart', 'checkout', 'payment-success', 'payment-fail'].includes(page)) return true;
    if (user && page === 'profile') return true;
    if (!user) {
      return ['home', 'login', 'contact', 'retail', 'product-detail', 'cart', 'checkout', 'supply', 'payment-success', 'payment-fail'].includes(page);
    }
    const role = user.role?.toLowerCase();
    if (role === 'admin') return true;
    switch (role) {
      case 'buyer':
        return ['home', 'retail', 'product-detail', 'cart', 'checkout', 'supply', 'contact', 'order-management', 'payment-success', 'payment-fail'].includes(page);
      case 'farmer':
      case 'seller':
        return ['home', 'retail', 'supply', 'dashboard', 'seller-center', 'listing-management', 'order-management', 'contact', 'cart', 'checkout', 'payment-success', 'payment-fail'].includes(page);
      case 'business':
        return ['home', 'retail', 'supply', 'suppliers', 'contact', 'farm-profile', 'b2b-cart', 'order-management', 'cart', 'checkout', 'payment-success', 'payment-fail'].includes(page);
      default:
        return ['home', 'retail', 'supply', 'contact', 'cart', 'checkout', 'payment-success', 'payment-fail'].includes(page);
    }
  };

  // 7. Render trang dựa trên phân quyền và trạng thái điều hướng
  const renderPage = () => {
    if (!canAccess(currentPage)) {
      return <Homepage onNavigate={handleNavigate} products={products} />;
    }

    switch (currentPage) {
      case 'home':
        return <Homepage onAddToCart={handleAddToCart} onNavigate={handleNavigate} products={products} />;
      case 'retail':
        return (
          <RetailPage
            allProducts={products}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        );
      case 'product-detail':
        return (
          <ProductDetailPage
            productId={pageData.id}
            onNavigate={handleNavigate}
            allProducts={products}
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
      case 'checkout': {
        const directItem = JSON.parse(localStorage.getItem('directCheckoutItem'));
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
            cart={directItem ? [directItem] : cartItems}
            setCart={setCartItems}
          />
        );
      }
      case 'payment-success':
        return <PaymentSuccessPage orderId={pageData.id} onNavigate={handleNavigate} />;
      case 'payment-fail':
        return <PaymentFailPage orderId={pageData.id} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleLoginSuccess} setCartItems={setCartItems} />;
      case 'profile':
        return <ProfilePage user={user} onNavigate={handleNavigate} />;
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
      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case 'product-approval':
        return <ProductApprovalPage onNavigate={handleNavigate} />;
      case 'admin-orders':
        return <AdminOrderManagementPage onNavigate={handleNavigate} />;
      default:
        return <Homepage onNavigate={handleNavigate} />;
    }
  };

  // 8. Tính tổng số lượng item để hiển thị badge trên Navbar
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 1000,
          success: { duration: 1000 },
          error: { duration: 1000 },
        }}
      />

      {user && user.status === 'pending' && (
        <RoleSelectionOverlay user={user} onStatusUpdated={handleStatusUpdated} />
      )}

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