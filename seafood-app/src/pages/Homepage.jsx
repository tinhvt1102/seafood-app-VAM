import { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Truck, X } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { SupplierCard } from '../components/SupplierCard';
import { SupplyCard } from '../components/SupplyCard';


export function Homepage({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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

  const featuredSupply = [
    { id: '1', species: 'Tôm sú', 
      image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080', 
      size: '20-25 con/kg', 
      harvestTime: '15/03/2026', 
      quantity: '5 tấn', 
      location: 'Cà Mau', 
      farmerName: 'Nguyễn Văn A' },
    
    { id: '2', species: 'Cá Tra', image: 'https://i.postimg.cc/g2wJgkn1/Ca-tra-phi-le-tuoi.png', size: '0.8-1.2 kg/con', harvestTime: '20/03/2026', quantity: '10 tấn', location: 'An Giang', farmerName: 'Trần Thị B' },
    { id: '3', species: 'Tôm thẻ chân trắng', image: 'https://i.postimg.cc/ydy2mcB1/tom-the-chan-trang.png', size: '60-70 con/kg', harvestTime: '10/03/2026', quantity: '3 tấn', location: 'Bạc Liêu', farmerName: 'Lê Văn C' },
    { id: '4', species: 'Ghẹ biển', 
      image: 'https://i.postimg.cc/Gp2j7DkR/82eeed2b-b7fd-46db-b76c-c916c1ae3915.png', 
      hoverimage:'https://i.postimg.cc/wjtvwT18/ghe-xanh.png',
      size: '300-400g/con', harvestTime: '12/03/2026', 
      quantity: '2 tấn', 
      location: 'Kiên Giang', 
      farmerName: 'Phạm Văn D' },
      { id: '5', species: 'Cua biển', 
      image: 'https://i.postimg.cc/jqQJf57k/cua-bien.png', 
      size: '300-400g/con', harvestTime: '05/06/2026', 
      quantity: '2 tấn', 
      location: 'Cà mau', 
      farmerName: 'Đoàn Văn Q' },
      { id: '6', species: 'Mực ống', 
      image: 'https://i.postimg.cc/XNw9gLTH/muc.png', 
      size: '100-200g/con', harvestTime: '05/06/2026', 
      quantity: '1 tấn', 
      location: 'Vũng Tàu', 
      farmerName: 'Nguyễn Thanh P' }
  ];

  const retailProducts = [
    { id: '1', 
      name: 'Tôm sú tươi sống size 20-25', 
      image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080', 
      price: '450.000đ/kg', origin: 'Cà Mau', 
      rating: 5, 
      reviews: 42 },
    { id: '2', 
      name: 'Cá Tra phi lê tươi', 
      image: 'https://i.postimg.cc/g2wJgkn1/Ca-tra-phi-le-tuoi.png', 
      price: '85.000đ/kg', 
      origin: 'An Giang', 
      rating: 5, 
      reviews: 156 },
    { id: '3', name: 'Cua biển tươi sống', 
      image: 'https://i.postimg.cc/jqQJf57k/cua-bien.png', 
      price: '320.000đ/kg', 
      origin: 'Kiên Giang', 
      rating: 4, 
      reviews: 38 },
    { id: '4', name: 'Mực tươi', image: 'https://i.postimg.cc/XNw9gLTH/muc.png', price: '180.000đ/kg', origin: 'Vũng Tàu', rating: 5, reviews: 29 },
    { id: '5', name: 'Tôm thẻ chân trắng size 60-70', image: 'https://i.postimg.cc/ydy2mcB1/tom-the-chan-trang.png', price: '280.000đ/kg', origin: 'Bạc Liêu', rating: 5, reviews: 73 },
    { id: '6', name: 'Hải sản tổng hợp', image: 'https://images.unsplash.com/photo-1596563976996-e5dc9a1990c9?q=80&w=1080', price: '550.000đ/combo', origin: 'Nhiều vùng', rating: 5, reviews: 91 },
    { id: '7', name: 'Ghẹ biển', 
      image: 'https://i.postimg.cc/Gp2j7DkR/82eeed2b-b7fd-46db-b76c-c916c1ae3915.png',
      hoverimage:'https://i.postimg.cc/wjtvwT18/ghe-xanh.png', 
      price: '800.000đ/kg', 
      origin: 'Cà Mau', 
      rating: 5, 
      reviews: 99 }
  ];

  // 2. lọc dữ liệu dựa trên searchTerm
  const filteredSupply = featuredSupply.filter(item =>
    item.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRetail = retailProducts.filter(item =>
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
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
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
              <ProductCard key={product.id} {...product} onClick={() => onNavigate('product-detail', product.id)} />
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-400 italic">Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      </section>
    </div>
  );
}