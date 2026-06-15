import { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

// TỐI ƯU 1: Đưa mảng dữ liệu tĩnh ra ngoài Component để tránh tạo lại vùng nhớ khi re-render
const PRODUCTS_DATA = [
  { id: '1', name: 'Tôm sú tươi sống size 20-25', category: 'Tôm', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080', price: 450000, origin: 'Cà Mau', rating: 4, reviews: 42 },
  { id: '2', name: 'Cá Tra phi lê tươi nguyên chất', category: 'Cá', image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?q=80&w=1080', price: 85000, origin: 'An Giang', rating: 3, reviews: 156 },
  { id: '3', name: 'Cua biển tươi sống', category: 'Cua/Ghẹ', image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?q=80&w=1080', price: 320000, origin: 'Kiên Giang', rating: 5, reviews: 38 },
  { id: '4', name: 'Mực tươi nguyên con', category: 'Mực', image: 'https://images.unsplash.com/photo-1762305195844-94479ea6aca4?q=80&w=1080', price: 180000, origin: 'Vũng Tàu', rating: 5, reviews: 29 },
  { id: '5', name: 'Tôm thẻ chân trắng size 60-70', category: 'Tôm', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080', price: 280000, origin: 'Bạc Liêu', rating: 4, reviews: 73 },
  { id: '6', name: 'Hải sản tổng hợp', category: 'Hải sản khác', image: 'https://images.unsplash.com/photo-1596563976996-e5dc9a1990c9?q=80&w=1080', price: 550000, origin: 'Nhiều vùng', rating: 3, reviews: 91 },
  { id: '7', name: 'Ghẹ xanh tươi sống', category: 'Cua/Ghẹ', image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?q=80&w=1080', price: 380000, origin: 'Cà Mau', rating: 4, reviews: 54 },
  { id: '8', name: 'Tôm hùm Alaska', category: 'Tôm', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080', price: 1200000, origin: 'Nhập khẩu', rating: 5, reviews: 112 },
  { id: '9', name: 'Cá Hồi Na Uy phi lê', category: 'Cá', image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?q=80&w=1080', price: 650000, origin: 'Nhập khẩu', rating: 3, reviews: 203 }
];

export function RetailPage({ onNavigate, onAddToCart }) {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState('Tất cả');
  const [origin, setOrigin] = useState('Tất cả');
  const [minRating, setMinRating] = useState(0);

  // TỐI ƯU 2: Logic lọc mượt mà, chính xác và useMemo hoạt động đúng vai trò
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(product => {
      // 1. Lọc theo danh mục (nhiều lựa chọn cùng lúc)
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;

      // 2. Lọc theo vùng xuất xứ
      if (origin !== 'Tất cả' && product.origin !== origin) return false;

      // 3. Lọc theo số sao đánh giá
      if (product.rating < minRating) return false;

      // 4. Lọc theo khoảng giá ngân sách
      if (priceRange === 'Dưới 100.000đ' && product.price >= 100000) return false;
      if (priceRange === '100.000đ - 300.000đ' && (product.price < 100000 || product.price > 300000)) return false;
      if (priceRange === '300.000đ - 500.000đ' && (product.price < 300000 || product.price > 500000)) return false;
      if (priceRange === 'Trên 500.000đ' && product.price <= 500000) return false;

      return true;
    });
  }, [selectedCategories, priceRange, origin, minRating]);

  // Handler dọn sạch tất cả trạng thái lọc
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange('Tất cả');
    setOrigin('Tất cả');
    setMinRating(0);
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-2xl" style={{ color: '#0A2647' }}>Mua lẻ hải sản</h1>
          <p className="text-gray-600">Hải sản tươi sống giao tận nhà</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-medium" style={{ color: '#0A2647' }}>
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-500 hover:underline font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-6">
                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Danh mục</label>
                  <div className="space-y-2">
                    {['Tôm', 'Cá', 'Cua/Ghẹ', 'Mực', 'Hải sản khác'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="rounded border-gray-300 text-[#00BCD4] focus:ring-[#00BCD4] w-4 h-4"
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Giá cả */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Giá</label>
                  <div className="space-y-2">
                    {['Tất cả', 'Dưới 100.000đ', '100.000đ - 300.000đ', '300.000đ - 500.000đ', 'Trên 500.000đ'].map((range) => (
                      <label key={range} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === range}
                          onChange={() => setPriceRange(range)}
                          className="text-[#00BCD4] focus:ring-[#00BCD4] w-4 h-4"
                        />
                        {range}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Xuất xứ */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Xuất xứ</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm outline-none bg-white focus:ring-1 focus:ring-[#00BCD4] focus:border-[#00BCD4]"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <option value="Tất cả">Tất cả các vùng</option>
                    <option value="Cà Mau">Cà Mau</option>
                    <option value="An Giang">An Giang</option>
                    <option value="Bạc Liêu">Bạc Liêu</option>
                    <option value="Kiên Giang">Kiên Giang</option>
                    <option value="Vũng Tàu">Vũng Tàu</option>
                    <option value="Nhập khẩu">Hàng Nhập khẩu</option>
                  </select>
                </div>

                {/* Đánh giá */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Đánh giá</label>
                  <div className="space-y-2">
                    {[5, 4, 3].map((stars) => (
                      <label key={stars} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === stars}
                          onChange={() => setMinRating(stars)}
                          className="text-[#00BCD4] focus:ring-[#00BCD4] w-4 h-4"
                        />
                        Từ {stars}★ trở lên
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid hiển thị sản phẩm */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-bold text-[#0A2647]">{filteredProducts.length}</span> sản phẩm
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-md text-sm transition-colors hover:bg-gray-100"
                style={{ borderColor: '#0A2647', color: '#0A2647' }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    price={`${product.price.toLocaleString('vi-VN')}đ/kg`}
                    onClick={() => onNavigate('product-detail', product.id)}
                    onAddToCart={() => onAddToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-400 mb-3">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
                <button
                  onClick={handleResetFilters}
                  className="text-[#00BCD4] font-medium hover:underline text-sm"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}