import { useState, useEffect, useMemo } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { SupplyCard } from '../../components/SupplyCard';
import { productApi } from '../../api/products';

export function SupplyPage({ onNavigate }) {
  const [showFilters, setShowFilters] = useState(true);
  const [supplyData, setSupplyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. State quản lý bộ lọc ---
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Tất cả tỉnh thành');
  const [minQuantity, setMinQuantity] = useState('');

  // --- Tải dữ liệu sản lượng (isWholesale = true) từ API ---
  useEffect(() => {
    const fetchSupplyProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProducts({
          isWholesale: true,
          status: 'approved',
          pageSize: 100
        });

        const items = res?.items || res || [];
        const mapped = items.map((item) => ({
          id: String(item.id),
          species: item.name,
          type: item.categoryName || 'Khác',
          image: item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          size: item.size || 'Tuyển chọn chất lượng cao',
          harvestTime: item.harvestDate || 'Trong ngày',
          quantity: `${item.quantity.toLocaleString('vi-VN')} ${item.unit || 'kg'}`,
          rawQuantity: item.quantity,
          location: item.farmName || 'Việt Nam',
          farmerName: item.sellerName || 'Hộ nuôi thủy sản'
        }));

        setSupplyData(mapped);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu sản lượng từ API:', err);
        setSupplyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplyProducts();
  }, []);

  // --- 2. Logic lọc dữ liệu ---
  const filteredData = useMemo(() => {
    return supplyData.filter(item => {
      // Lọc theo loại hải sản (Tôm, Cá, Cua...)
      const matchType = selectedTypes.length === 0 || selectedTypes.some(t => item.species.toLowerCase().includes(t.toLowerCase()) || item.type.toLowerCase().includes(t.toLowerCase()));

      // Lọc theo tỉnh thành
      const matchLocation = selectedLocation === 'Tất cả tỉnh thành' || item.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // Lọc theo sản lượng tối thiểu
      const matchQuantity = minQuantity === '' || item.rawQuantity >= parseFloat(minQuantity);

      return matchType && matchLocation && matchQuantity;
    });
  }, [supplyData, selectedTypes, selectedLocation, minQuantity]);

  // Hàm xử lý khi check/uncheck loại hải sản
  const handleTypeChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0A2647' }}>Sản lượng hải sản</h1>
          <p className="text-gray-600">Tìm nguồn hải sản sản lượng lớn từ các hộ nuôi và nhà cung cấp uy tín</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="flex items-center gap-2 mb-4 font-bold text-base" style={{ color: '#0A2647' }}>
                <Filter className="w-5 h-5" /> Bộ lọc
              </h3>

              <div className="space-y-6">
                {/* Lọc theo loại */}
                <div>
                  <label className="block text-sm mb-2 font-medium" style={{ color: '#0A2647' }}>Loại hải sản</label>
                  <div className="space-y-2">
                    {['Tôm', 'Cá', 'Cua', 'Mực', 'Khác'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          className="rounded text-[#00BCD4] focus:ring-[#00BCD4]"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lọc theo địa điểm */}
                <div>
                  <label className="block text-sm mb-2 font-medium" style={{ color: '#0A2647' }}>Địa điểm</label>
                  <select
                    className="w-full p-2 border rounded-md text-sm outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option>Tất cả tỉnh thành</option>
                    <option>Cà Mau</option>
                    <option>An Giang</option>
                    <option>Bạc Liêu</option>
                    <option>Kiên Giang</option>
                  </select>
                </div>

                {/* Lọc theo sản lượng */}
                <div>
                  <label className="block text-sm mb-2 font-medium" style={{ color: '#0A2647' }}>Sản lượng tối thiểu</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Nhập số lượng"
                    className="w-full p-2 border rounded-md text-sm outline-none"
                    value={minQuantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val < 0) {
                        setMinQuantity(0);
                      } else {
                        setMinQuantity(val);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    style={{ borderColor: '#e5e7eb' }}
                  />
                </div>

                <button
                  onClick={() => { setSelectedTypes([]); setSelectedLocation('Tất cả tỉnh thành'); setMinQuantity(''); }}
                  className="w-full py-2 rounded-md text-sm border hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                  style={{ color: '#0A2647', borderColor: '#0A2647' }}
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-bold text-[#00BCD4]">{filteredData.length}</span> nguồn sản lượng
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-lg shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#00BCD4' }} />
                <span className="ml-3 text-gray-500 font-medium">Đang tải danh sách sản lượng...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.length > 0 ? (
                  filteredData.map((supply) => (
                    <SupplyCard
                      key={supply.id}
                      {...supply}
                      onClick={() => onNavigate('product-detail', supply.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-lg border-2 border-dashed">
                    <p className="text-gray-400">Không tìm thấy sản lượng phù hợp với bộ lọc.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}