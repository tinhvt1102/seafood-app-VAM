import { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, Users, Truck, X } from 'lucide-react';
import { CategoryCard } from '../../components/CategoryCard';
import { ProductCard } from '../../components/ProductCard';
import { SupplierCard } from '../../components/SupplierCard';
import { SupplyCard } from '../../components/SupplyCard';

import { productApi, categoryApi } from '../../api/products';

export function Homepage({ onNavigate, onAddToCart, products: passedProducts }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiProducts, setApiProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        setCategories(res?.items || res || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const banners = [
    {
      image: 'https://i.postimg.cc/fLfZBbXS/co-phai-dai-duong-dang-can-kiet-ca-bien.jpg',
      title: 'Kết nối người nuôi – doanh nghiệp – thị trường hải sản Việt Nam',
      subtitle: 'Nền tảng thương mại hải sản hàng đầu'
    },
    {
      image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2000',
      title: 'Nguồn cung hải sản tươi sống chất lượng',
      subtitle: 'Trực tiếp từ hộ nuôi'
    },
    {
      image: 'https://i.postimg.cc/Y2gkXbNj/ca-(3)-1683342306.jpg',
      title: 'Giao dịch minh bạch - An toàn - Hiệu quả',
      subtitle: 'Đăng ký ngay hôm nay'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Tải sản phẩm từ API nếu không được truyền từ App
  useEffect(() => {
    if (passedProducts !== undefined) {
      setApiProducts(passedProducts);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProducts({ pageSize: 100, status: 'approved' });
        const items = res?.items || res || [];
        const mapped = items.map(item => ({
          id: String(item.id),
          name: item.name,
          image: item.imageUrls?.[0] || item.image || item.imageUrl || 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
          price: typeof item.price === 'number' ? `${item.price.toLocaleString('vi-VN')}đ/kg` : item.price,
          origin: item.origin || 'Việt Nam',
          rating: item.rating || 5,
          reviews: item.reviews || 0,
          description: item.description || ''
        }));
        setApiProducts(mapped);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm cho Trang Chủ từ API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [passedProducts]);

  // Tạo dữ liệu B2B/Sản lượng động từ sản phẩm thực tế
  const displaySupply = useMemo(() => {
    return apiProducts.map((item, idx) => ({
      id: item.id || `supply-${idx}`,
      species: item.name,
      image: item.image,
      size: 'Size tiêu chuẩn',
      harvestTime: 'Tươi sống mỗi ngày',
      quantity: 'Số lượng lớn',
      location: item.origin,
      farmerName: 'Hộ nuôi liên kết VAM'
    }));
  }, [apiProducts]);

  const filteredSupply = displaySupply.filter(item =>
    item.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRetail = apiProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-slate-900">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div className="absolute inset-0 bg-black/30 z-20" />
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">{banner.title}</h1>
                <p className="text-lg md:text-xl mb-8 opacity-95 drop-shadow-lg">{banner.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => onNavigate('suppliers')} className="px-8 py-3 rounded-md text-white font-semibold hover:scale-105 transition-all shadow-xl active:scale-95" style={{ backgroundColor: '#0A2647' }}>Tìm nguồn hải sản</button>
                  <button onClick={() => onNavigate('supply')} className="px-8 py-3 rounded-md text-white font-semibold hover:scale-105 transition-all shadow-xl active:scale-95" style={{ backgroundColor: '#00BCD4' }}>Đăng bán sản lượng</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar  */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-50">
        <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 border border-gray-50">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm hải sản / nhà cung cấp / địa điểm..."
                className="w-full pl-12 pr-10 py-4 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button className="px-10 py-4 rounded-lg text-white font-bold hover:brightness-110 transition-all shadow-lg" style={{ backgroundColor: '#0A2647' }}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-center mb-8 text-2xl font-bold" style={{ color: '#0A2647' }}>Danh mục hải sản</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
          {categories.map((cat, idx) => {
            let icon = '🐟';
            const nameLower = cat.name?.toLowerCase() || '';
            if (nameLower.includes('tôm')) icon = '🦐';
            else if (nameLower.includes('cua') || nameLower.includes('ghẹ')) icon = '🦀';
            else if (nameLower.includes('mực') || nameLower.includes('bạch tuộc')) icon = '🦑';
            else if (nameLower.includes('ốc') || nameLower.includes('ngao') || nameLower.includes('sò') || nameLower.includes('hàu')) icon = '🦪';
            else if (nameLower.includes('khác')) icon = '🦞';
            
            return (
              <CategoryCard 
                key={cat.id || idx} 
                icon={icon} 
                label={cat.name} 
                onClick={() => onNavigate('retail')} 
              />
            );
          })}
        </div>
      </section>

      {/* Featured Supply  */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ color: '#0A2647' }}>Sản lượng nổi bật</h2>
          <button onClick={() => onNavigate('supply')} className="text-sm hover:underline" style={{ color: '#00BCD4' }}>Xem tất cả →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSupply.length > 0 ? (
            filteredSupply.map((supply) => (
              <SupplyCard key={supply.id} {...supply} onClick={() => onNavigate('supply')} />
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-400 italic">Không tìm thấy sản lượng phù hợp.</p>
          )}
        </div>
      </section>

      {/* Latest Products  */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ color: '#0A2647' }}>Sản phẩm mới nhất</h2>
          <button onClick={() => onNavigate('retail')} className="text-sm hover:underline" style={{ color: '#00BCD4' }}>Xem tất cả →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredRetail.length > 0 ? (
            filteredRetail.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onClick={() => onNavigate('product-detail', product.id)}
                onAddToCart={() => {
                  const rawPrice = String(product.price || '0');
                  const cleanPrice = Number(rawPrice.replace(/[^0-9]/g, ''));
                  onAddToCart({
                    ...product,
                    price: cleanPrice 
                  });
                }}
              />
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-400 italic">Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      </section>
    </div>
  );
}