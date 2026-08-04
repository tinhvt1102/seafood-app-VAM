import { useState, useEffect } from 'react';
import { Star, MapPin, BadgeCheck, Phone, Mail, Loader2, Package } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { authApi } from '../../api/auth';
import toast from 'react-hot-toast';

export function FarmProfilePage({ farmId, onNavigate, onAddToCart }) {
  const [farmData, setFarmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const cleanId = String(farmId || '').replace('profile-', '').replace('farm-', '');
        if (!cleanId) {
          setError('Không tìm thấy mã hộ nuôi / trang trại');
          return;
        }

        const data = await authApi.getSellerDetail(cleanId);
        setFarmData(data);
      } catch (err) {
        console.error('Failed to fetch seller detail:', err);
        setError('Không thể tải thông tin trang trại');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetail();
  }, [farmId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#00BCD4] mb-3" />
        <p className="text-gray-500 text-sm font-medium">Đang tải thông tin trang trại...</p>
      </div>
    );
  }

  if (error || !farmData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#0A2647] mb-1">{error || 'Trang trại không tồn tại'}</h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          Rất tiếc, thông tin trang trại này không khả dụng hoặc đã bị gỡ khỏi hệ thống VAM Marketplace.
        </p>
      </div>
    );
  }

  const sellerInfo = farmData.sellerInfo || {};
  const products = farmData.products || [];

  const farm = {
    name: farmData.farmName || `Hộ nuôi ${sellerInfo.name || ''}`,
    coverImage: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    location: farmData.farmAddress || sellerInfo.address || 'Việt Nam',
    rating: 5,
    reviews: products.length > 0 ? products.length * 4 : 12,
    verified: farmData.status === 'APPROVED' || farmData.status === 'approved',
    certifications: farmData.certificate
      ? (farmData.certificate.startsWith('http') || farmData.certificate.includes('firebase') ? ['Đã xác minh chứng nhận'] : [farmData.certificate])
      : ['VietGAP'],
    certificateUrl: farmData.certificate && (farmData.certificate.startsWith('http') || farmData.certificate.includes('firebase')) ? farmData.certificate : null,
    description: farmData.note || `Trang trại chuyên nuôi trồng các loại hải sản chất lượng cao (${farmData.aquacultureType || 'Hải sản tươi sống'}).`,
    phone: sellerInfo.phone || 'Chưa cập nhật',
    email: sellerInfo.email || 'Chưa cập nhật',
    aquacultureType: farmData.aquacultureType || 'Tươi sống',
    verifiedAt: farmData.verifiedAt ? new Date(farmData.verifiedAt).toLocaleDateString('vi-VN') : '2026'
  };

  const parseImg = (prod) => {
    const raw = prod.imageUrls?.[0] || prod.image || prod.imageUrl;
    if (!raw) return 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080';
    if (typeof raw === 'string' && raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed[0]) return parsed[0];
      } catch (e) {}
    }
    return raw;
  };

  const mappedProducts = products.map((prod) => {
    const numericPrice = typeof prod.price === 'number'
      ? prod.price
      : parseInt(String(prod.price || 0).replace(/\D/g, ''), 10) || 0;

    const formattedPrice = numericPrice > 0 
      ? `${numericPrice.toLocaleString('vi-VN')}đ/${prod.unit || 'kg'}`
      : `${prod.quantity || 1} ${prod.unit || 'kg'}`;

    return {
      id: String(prod.id),
      rawProduct: {
        id: String(prod.id),
        name: prod.name,
        price: numericPrice || 100000,
        image: parseImg(prod),
        origin: prod.origin || farm.location,
        unit: prod.unit || 'kg'
      },
      name: prod.name || `Sản phẩm #${prod.id}`,
      image: parseImg(prod),
      hoverimage: parseImg(prod),
      price: formattedPrice,
      origin: prod.origin || farm.location,
      rating: prod.rating || 5,
      reviews: prod.reviews || 18
    };
  });

  const handleAddCartItem = (productItem) => {
    if (onAddToCart) {
      onAddToCart(productItem.rawProduct);
      toast.success(`Đã thêm "${productItem.name}" vào giỏ hàng!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-12">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        <img 
          src={farm.coverImage} 
          alt={farm.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Farm Header */}
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-cyan-400 to-[#0A2647] flex items-center justify-center text-white text-4xl font-bold mx-auto md:mx-0">
                {farm.name ? farm.name.charAt(0).toUpperCase() : 'F'}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h1 className="text-2xl font-extrabold" style={{ color: '#0A2647' }}>{farm.name}</h1>
                  {farm.verified && (
                    <BadgeCheck className="w-6 h-6 text-[#00BCD4]" />
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < farm.rating ? '#FFD700' : 'none'}
                        stroke={i < farm.rating ? '#FFD700' : '#D1D5DB'}
                      />
                    ))}
                    <span className="text-sm ml-1 font-bold">{farm.rating} ({farm.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-[#00BCD4]" />
                    {farm.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mb-4">
                  {farm.certifications.map((cert, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-bold text-white bg-slate-900 shadow-xs"
                    >
                      {cert}
                    </span>
                  ))}
                  {farm.certificateUrl && (
                    <a
                      href={farm.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-xs font-bold text-[#00BCD4] bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-colors"
                    >
                      📄 Xem file chứng nhận
                    </a>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a 
                    href={`tel:${farm.phone}`}
                    className="px-6 py-2.5 rounded-xl text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-bold text-xs shadow-md shadow-cyan-200 cursor-pointer"
                    style={{ backgroundColor: '#00BCD4' }}
                  >
                    <Phone className="w-4 h-4" />
                    Liên hệ: {farm.phone}
                  </a>
                  <a 
                    href={`mailto:${farm.email}`}
                    className="px-6 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-bold text-xs cursor-pointer"
                    style={{ borderColor: '#0A2647', color: '#0A2647' }}
                  >
                    <Mail className="w-4 h-4" />
                    Gửi email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-extrabold mb-4" style={{ color: '#0A2647' }}>Giới thiệu</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{farm.description}</p>
            </div>

            {/* Products List styled like Homepage ProductCard */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-extrabold" style={{ color: '#0A2647' }}>Sản phẩm / Sản lượng hiện có</h2>
                <span className="text-xs font-bold bg-cyan-50 text-[#00BCD4] px-3.5 py-1.5 rounded-full">
                  {mappedProducts.length} sản phẩm đang bán
                </span>
              </div>

              {mappedProducts.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-semibold">Trang trại hiện chưa đăng bán sản phẩm nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {mappedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      image={product.image}
                      hoverimage={product.hoverimage}
                      name={product.name}
                      price={product.price}
                      origin={product.origin}
                      rating={product.rating}
                      reviews={product.reviews}
                      onClick={() => onNavigate?.('product-detail', product.id)}
                      onAddToCart={() => handleAddCartItem(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-base font-extrabold mb-4" style={{ color: '#0A2647' }}>Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-cyan-50 text-[#00BCD4] rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Số điện thoại</p>
                    <span className="text-gray-800 font-bold text-xs">{farm.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-cyan-50 text-[#00BCD4] rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                    <span className="text-gray-800 font-bold text-xs">{farm.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 bg-cyan-50 text-[#00BCD4] rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Địa chỉ trang trại</p>
                    <span className="text-gray-800 font-semibold text-xs">{farm.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-base font-extrabold mb-4" style={{ color: '#0A2647' }}>Thống kê trang trại</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Sản phẩm đang bán:</span>
                  <span className="font-bold text-[#0A2647]">{mappedProducts.length} sản phẩm</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Loại nuôi trồng:</span>
                  <span className="font-bold text-[#0A2647]">{farm.aquacultureType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Trạng thái xác thực:</span>
                  <span className="font-bold text-emerald-600">Đã kiểm duyệt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

