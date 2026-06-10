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
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

const addToCart = (product) => {
  setCart(prevCart => {
    const isExist = prevCart.find(item => item.id === product.id);
    const addQty = product.quantity || 1; 
    if (isExist) {
      return prevCart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + addQty } : item
      );
    }
    return [...prevCart, { ...product, quantity: addQty }];
  });
};

  const handleLoginSuccess = (targetPage) => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(savedUser);
    setCurrentPage(targetPage);
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page, id) => {
    setCurrentPage(page);
    setPageData({ id });
    window.scrollTo(0, 0);
  };

  const canAccess = (page) => {
    if (!user) {
      return ['home', 'login', 'contact', 'retail','product-detail','cart','checkout'].includes(page);
    }
    const role = user.role?.toLowerCase();
    if (role === 'admin') return true; 
    switch (role) {
      case 'buyer':
        return ['home', 'retail', 'product-detail', 'cart', 'checkout', 'supply', 'contact'].includes(page);
      case 'farmer':
        return ['home', 'supply', 'dashboard', 'contact'].includes(page);
      case 'business':
        return ['home', 'supply', 'suppliers', 'contact','farm-profile'].includes(page);
      default:
        return ['home', 'contact'].includes(page);
    }
  };

  const renderPage = () => {
    if (!canAccess(currentPage)) {
      return <Homepage onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={handleNavigate} />;
      case 'retail':
        return <RetailPage onNavigate={handleNavigate} onAddToCart={addToCart} />;
      case 'product-detail':
        return <ProductDetailPage productId={pageData.id} onNavigate={handleNavigate} onAddToCart={addToCart} />;
      case 'farm-profile':
        return <FarmProfilePage farmId={pageData.id} />;
      case 'cart':
        return <CartPage cartItems={cart} setCartItems={setCart} onNavigate={handleNavigate} />;
      case 'supply':
        return <SupplyPage onNavigate={handleNavigate} />;
      case 'suppliers':
        return <SuppliersPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} cart={cart} setCart={setCart}  />;
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleLoginSuccess} setCart={setCart} />;
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} currentPage={currentPage} onNavigate={handleNavigate} cartCount={cart.length} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}