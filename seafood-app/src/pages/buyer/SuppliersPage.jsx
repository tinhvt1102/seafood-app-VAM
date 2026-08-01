import { useState, useEffect, useMemo } from 'react';
import { Filter, SlidersHorizontal, Loader2, Search, RefreshCw } from 'lucide-react';
import { SupplierCard } from '../../components/SupplierCard';
import { farmApi } from '../../api/products';
import { authApi } from '../../api/auth';

export function SuppliersPage({ onNavigate }) {
  const [showFilters, setShowFilters] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý bộ lọc
  const [selectedSupplierTypes, setSelectedSupplierTypes] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Tất cả tỉnh thành');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Lấy danh sách trang trại từ backend API SellerProfiles (Approved) & Farms
  const fetchFarms = async () => {
    setLoading(true);
    try {
      // 1. Gọi API lấy SellerProfiles đã được Admin duyệt
      let sellerProfiles = [];
      try {
        const profileRes = await authApi.getApprovedSellers({ pageNumber: 1, pageSize: 50, search: searchTerm || undefined });
        sellerProfiles = profileRes?.items || (Array.isArray(profileRes) ? profileRes : []);
      } catch (profileErr) {
        console.warn('Could not fetch approved seller profiles:', profileErr);
      }

      // 2. Gọi API lấy Farms từ FarmsController
      let farms = [];
      try {
        const farmRes = await farmApi.getFarms({ pageNumber: 1, pageSize: 50, search: searchTerm || undefined });
        farms = farmRes?.items || (Array.isArray(farmRes) ? farmRes : []);
      } catch (farmErr) {
        console.warn('Could not fetch farms:', farmErr);
      }

      // Map dữ liệu từ SellerProfiles đã duyệt
      const mappedProfiles = sellerProfiles.map((sp) => {
        const certs = sp.certificate
          ? [sp.certificate.endsWith('.pdf') ? 'Giấy chứng nhận (PDF)' : sp.certificate]
          : ['VietGAP'];
        return {
          id: `profile-${sp.id}`,
          name: sp.farmName || `Trang trại Hộ nuôi #${sp.id}`,
          image: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          location: sp.farmAddress || 'Việt Nam',
          rating: 5,
          reviews: 12,
          certifications: certs,
          availableSupply: sp.aquacultureType ? `Chuyên nuôi: ${sp.aquacultureType}` : 'Hải sản tươi sống',
          verified: true,
          type: 'Hộ nuôi chính thức (Đã xác minh)'
        };
      });

      // Map dữ liệu từ Farms
      const mappedFarms = farms.map((farm) => {
        const certs = farm.certificate
          ? farm.certificate.split(',').map(c => c.trim()).filter(Boolean)
          : ['VietGAP'];
        return {
          id: `farm-${farm.id}`,
          name: farm.farmName || `Hộ nuôi #${farm.id}`,
          image: farm.imageUrl || farm.image || 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          location: farm.location || 'Việt Nam',
          rating: farm.rating || 5,
          reviews: farm.reviews || 0,
          certifications: certs.length > 0 ? certs : ['VietGAP'],
          availableSupply: farm.availableSupply || 'Hải sản tươi sống',
          verified: true,
          type: farm.type || 'Hộ nuôi cá nhân'
        };
      });

      // Gộp 2 nguồn dữ liệu
      const combined = [...mappedProfiles, ...mappedFarms];
      setSuppliers(combined);
    } catch (err) {
      console.error('Failed to fetch farms and seller profiles:', err);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [searchTerm]);

  // Logic lọc dữ liệu
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchType = selectedSupplierTypes.length === 0 || selectedSupplierTypes.includes(s.type);
      const matchCert = selectedCerts.length === 0 || selectedCerts.some(c => s.certifications?.includes(c));
      const matchLocation = selectedLocation === 'Tất cả tỉnh thành' || s.location?.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchVerified = !onlyVerified || s.verified === true;

      return matchType && matchCert && matchLocation && matchVerified;
    });
  }, [suppliers, selectedSupplierTypes, selectedCerts, selectedLocation, onlyVerified]);

  const toggleFilter = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#00BCD4] uppercase">Nguồn cung uy tín</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: '#0A2647' }}>
              Tìm nguồn hải sản & Trang trại nuôi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kết nối trực tiếp với các hộ nuôi và trang trại thủy sản đạt chuẩn trên khắp Việt Nam
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên trang trại, tỉnh thành..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-[#00BCD4] shadow-xs"
              />
            </div>

            <button
              onClick={fetchFarms}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-[#0A2647] flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 flex-shrink-0"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sticky top-24">
              <h3 className="flex items-center gap-2 mb-4 font-bold text-base" style={{ color: '#0A2647' }}>
                <Filter className="w-5 h-5 text-[#00BCD4]" /> Bộ lọc tìm kiếm
              </h3>

              <div className="space-y-6">
                {/* Loại nhà cung cấp */}
                <div>
                  <label className="block text-xs uppercase font-extrabold text-[#0A2647] mb-2 tracking-wider">Loại nhà cung cấp</label>
                  <div className="space-y-2">
                    {['Hộ nuôi cá nhân', 'Doanh nghiệp', 'Hợp tác xã'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer font-medium hover:text-[#0A2647]">
                        <input 
                          type="checkbox" 
                          className="rounded text-[#00BCD4] focus:ring-cyan-400" 
                          checked={selectedSupplierTypes.includes(type)}
                          onChange={() => toggleFilter(selectedSupplierTypes, setSelectedSupplierTypes, type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Chứng nhận */}
                <div>
                  <label className="block text-xs uppercase font-extrabold text-[#0A2647] mb-2 tracking-wider">Chứng nhận</label>
                  <div className="space-y-2">
                    {['VietGAP', 'GlobalGAP', 'ASC', 'BAP'].map((cert) => (
                      <label key={cert} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer font-medium hover:text-[#0A2647]">
                        <input 
                          type="checkbox" 
                          className="rounded text-[#00BCD4] focus:ring-cyan-400"
                          checked={selectedCerts.includes(cert)}
                          onChange={() => toggleFilter(selectedCerts, setSelectedCerts, cert)}
                        />
                        {cert}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Địa điểm */}
                <div>
                  <label className="block text-xs uppercase font-extrabold text-[#0A2647] mb-2 tracking-wider">Địa điểm</label>
                  <select 
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold text-gray-700 focus:ring-[#00BCD4] focus:border-[#00BCD4]" 
                    style={{ borderColor: '#e5e7eb' }}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="Tất cả tỉnh thành">Tất cả tỉnh thành</option>
                    {['Cà Mau', 'Bạc Liêu', 'Sóc Trăng', 'An Giang', 'Đồng Tháp', 'Kiên Giang'].map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Xác thực */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer font-bold">
                    <input 
                      type="checkbox" 
                      className="rounded text-[#00BCD4] focus:ring-cyan-400" 
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                    />
                    Chỉ hiện hộ nuôi đã xác thực
                  </label>
                </div>

                <button 
                  onClick={() => {
                    setSelectedSupplierTypes([]);
                    setSelectedCerts([]);
                    setSelectedLocation('Tất cả tỉnh thành');
                    setOnlyVerified(false);
                    setSearchTerm('');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold border hover:bg-gray-50 transition-all cursor-pointer"
                  style={{ color: '#0A2647', borderColor: '#0A2647' }}
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid List */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500">
                Hiển thị <span className="text-[#00BCD4] font-extrabold text-sm">{filteredSuppliers.length}</span> hộ nuôi & trang trại
              </p>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-xs">
                <Loader2 className="w-10 h-10 animate-spin text-[#00BCD4] mx-auto mb-3" />
                <p className="text-gray-500 text-xs font-bold">Đang tải danh sách trang trại từ hệ thống...</p>
              </div>
            ) : filteredSuppliers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSuppliers.map((supplier) => (
                  <SupplierCard 
                    key={supplier.id} 
                    {...supplier} 
                    onClick={() => onNavigate?.('farm-profile', supplier.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 p-8">
                <p className="text-gray-400 text-sm font-semibold mb-2">Không tìm thấy trang trại / hộ nuôi nào phù hợp.</p>
                <p className="text-xs text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc xóa bớt bộ lọc.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}