import { useState, useMemo, useEffect } from 'react';
import { Star, MapPin, ShoppingCart, Minus, Plus, BadgeCheck, ArrowLeft, Image as ImageIcon, MessageSquare, Filter, ThumbsUp, X } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { productApi } from '../../api/products';
import { reviewsApi } from '../../api/reviews';
import { authApi } from '../../api/auth';

export function ProductDetailPage({ productId, allProducts = [], onNavigate, onAddToCart, onBuyNow }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [activeStarFilter, setActiveStarFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Load Review Summary & Reviews List
  useEffect(() => {
    if (!productId) return;

    const fetchReviewsData = async () => {
      try {
        const summary = await reviewsApi.getProductSummary(productId);
        setReviewSummary(summary);

        const filter = { productId, pageNumber: 1, pageSize: 20 };
        if (activeStarFilter !== 'all' && activeStarFilter !== 'images') {
          filter.rating = parseInt(activeStarFilter);
        } else if (activeStarFilter === 'images') {
          filter.hasImages = true;
        }

        const res = await reviewsApi.getReviews(filter);
        setReviewsList(res?.items || res || []);
      } catch (err) {
        console.error('Lỗi khi tải thông tin đánh giá:', err);
      }
    };

    fetchReviewsData();
  }, [productId, activeStarFilter]);

  // Tải chi tiết sản phẩm từ API
  useEffect(() => {
    if (!productId) return;
    
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductById(productId);
        if (data) {
          let sellerProfId = data.sellerProfileId;
          let suppName = data.supplierName || data.farmName || data.sellerName;
          let suppLoc = data.supplierLocation;

          // Tra cứu tự động SellerProfile nếu chưa có sellerProfileId từ backend
          if (!sellerProfId && data.sellerId) {
            try {
              const sellersRes = await authApi.getApprovedSellers({ pageSize: 50 });
              const sellersList = sellersRes?.items || (Array.isArray(sellersRes) ? sellersRes : []);
              const matched = sellersList.find(s => s.userId === data.sellerId || String(s.userId) === String(data.sellerId));
              if (matched) {
                sellerProfId = matched.id;
                if (!suppName) suppName = matched.farmName;
                if (!suppLoc) suppLoc = matched.farmAddress;
              }
            } catch (pErr) {
              console.warn('Không thể tra cứu thông tin trang trại:', pErr);
            }
          }

          const mapped = {
            id: String(data.id),
            name: data.name,
            isWholesale: data.isWholesale || false,
            minOrderQuantity: data.minOrderQuantity || 1,
            unit: data.unit || 'kg',
            image: data.imageUrls?.[0] || data.image || data.imageUrl || 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
            price: typeof data.price === 'number' ? `${data.price.toLocaleString('vi-VN')}đ/${data.unit || 'kg'}` : data.price,
            origin: data.origin || suppLoc || 'Việt Nam',
            rating: data.averageRating || data.rating || 5,
            reviews: data.totalReviews || data.reviews || 0,
            description: data.description || '',
            size: data.size || '',
            harvestDate: data.harvestDate || '',
            images: data.imageUrls || (data.imageUrl ? [data.imageUrl] : []),
            sellerId: data.sellerId,
            sellerName: data.sellerName,
            sellerProfileId: sellerProfId,
            farmId: data.farmId,
            farmName: data.farmName,
            supplierName: suppName,
            supplierLocation: suppLoc,
            isSupplierVerified: data.isSupplierVerified,
            supplierRating: data.supplierRating,
            supplier: data.supplier
          };
          setProduct(mapped);
          setQuantity(mapped.minOrderQuantity || 1);
        } else {
          const found = allProducts.find((item) => String(item.id).trim() === String(productId).trim());
          setProduct(found || allProducts[0] || null);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sản phẩm từ API, sử dụng dữ liệu dự phòng:', err);
        const found = allProducts.find((item) => String(item.id).trim() === String(productId).trim());
        setProduct(found || allProducts[0] || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId, allProducts]);

  // 2. LOGIC PHÒNG THỦ DỮ LIỆU: Nếu sản phẩm thật từ Homepage chỉ có trường 'image' đơn, tự tạo mảng images gồm 3 phần tử để giao diện gallery không bị crash
  const productImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [product.image, product.image, product.image];
    return ['https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080'];
  }, [product]);

  // 3. TẠO DỮ LIỆU NHÀ CUNG CẤP: Ưu tiên thông tin thật từ API backend
  const supplierInfo = useMemo(() => {
    if (!product) return {};

    if (product.supplier && typeof product.supplier === 'object') {
      return {
        name: product.supplier.name || product.supplierName || product.farmName || product.sellerName || 'Hộ nuôi Hải Sản',
        farmId: String(product.supplier.farmId || product.supplier.id || product.sellerProfileId || product.farmId || product.sellerId || '1'),
        verified: product.supplier.verified ?? product.isSupplierVerified ?? true,
        rating: product.supplier.rating || product.supplierRating || product.rating || 5,
        location: product.supplier.location || product.supplierLocation || product.origin || 'Việt Nam',
        avatar: product.supplier.avatar || product.supplier.image || null
      };
    }

    const name = product.supplierName 
      || product.farmName 
      || product.sellerName 
      || (product.origin ? `Hộ nuôi Hải Sản ${product.origin}` : 'Hộ nuôi Hải Sản Việt Nam');

    const rawFarmId = product.sellerProfileId || product.farmId || product.sellerId;
    const farmId = rawFarmId ? String(rawFarmId) : '1';
    const location = product.supplierLocation || product.origin || 'Việt Nam';
    const rating = product.supplierRating || product.rating || 5;
    const verified = product.isSupplierVerified !== undefined ? product.isSupplierVerified : true;

    return {
      name,
      farmId,
      verified,
      rating,
      location,
      avatar: product.supplierAvatar || null
    };
  }, [product]);

  // 4. LỌC SẢN PHẨM TƯƠNG TỰ: Lọc từ kho dữ liệu thật, bỏ qua sản phẩm hiện tại
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((item) => String(item.id) !== String(product.id))
      .slice(0, 4)
      .map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        hoverimage: item.hoverimage,
        price: item.price, // Giữ nguyên định dạng chuỗi "450.000đ/kg" gốc
        origin: item.origin,
        rating: item.rating || 5,
        reviews: item.reviews || 30
      }));
  }, [product, allProducts]);

  // SỬA LỖI NaN: Hàm bóc tách chuỗi giá và ép về số nguyên sạch (Ví dụ "450.000đ/kg" -> 450000)
  const getCleanProductForCart = () => {
    if (!product) return {};
    let numericPrice = 0;
    if (typeof product.price === 'number') {
      numericPrice = product.price;
    } else if (typeof product.price === 'string') {
      numericPrice = parseInt(product.price.replace(/\D/g, ''), 10) || 0;
    }

    return {
      ...product,
      price: numericPrice // Thay thế chuỗi bằng số nguyên để App không bị lỗi tính toán tổng tiền
    };
  };

  // Nếu đang loading và chưa có thông tin sản phẩm, hiển thị skeleton hoặc trạng thái chờ
  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  // Nếu không có bất kỳ dữ liệu sản phẩm nào, hiển thị trạng thái trống
  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">Không tìm thấy thông tin sản phẩm.</p>
        <button onClick={() => onNavigate('home')} className="text-[#00BCD4] mt-4 font-medium hover:underline">
          Quay lại trang chủ
        </button>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation / Breadcrumb Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 transition-all duration-200 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Quay lại trang chủ</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => onNavigate('home')} className="hover:text-[#00BCD4] transition-colors">
              Trang chủ
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('retail')} className="hover:text-[#00BCD4] transition-colors">
              Hải sản
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={productImages[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {productImages.slice(0, 3).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#00BCD4] scale-102 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold" style={{ color: '#0A2647' }}>{product.name}</h1>
                {product.isWholesale && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                    Bán sản lượng lớn (Sỉ)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < (product.rating || 5) ? '#FFD700' : 'none'}
                      stroke={i < (product.rating || 5) ? '#FFD700' : '#D1D5DB'}
                    />
                  ))}
                  <span className="text-sm ml-1">{product.rating || 5}</span>
                </div>
                <span className="text-sm text-gray-500">{product.reviews || 42} đánh giá</span>
                <span className="text-sm text-gray-500">{product.sold || 120} đã bán</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold" style={{ color: '#d4183d' }}>
                    {String(product.price || '').includes('/') ? product.price : `${product.price}/${product.unit || 'kg'}`}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded">-18%</span>
                </div>
                <p className="text-sm text-gray-600">Giá theo đơn vị niêm yết ({product.unit || 'kg'})</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Xuất xứ:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Kích cỡ/Quy cách:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.size || 'Tuyển chọn chất lượng cao'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Ngày thu hoạch:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.harvestDate || 'Vận chuyển tươi sống trong ngày'}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium" style={{ color: '#0A2647' }}>
                  Số lượng mua {product.minOrderQuantity > 1 && <span className="text-xs font-normal text-cyan-700">(Tối thiểu {product.minOrderQuantity} {product.unit || 'kg'})</span>}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md" style={{ borderColor: '#e5e7eb' }}>
                    <button
                      onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minOrderQuantity || 1, parseInt(e.target.value) || (product.minOrderQuantity || 1)))}
                      className="w-20 text-center border-x py-1 outline-none font-medium"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">Sản phẩm sẵn có tại kho</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (typeof onAddToCart === 'function') {
                      // Truyền product sạch đã biến đổi giá thành Số Nguyên
                      const cleanProduct = getCleanProductForCart();
                      onAddToCart(cleanProduct, quantity);
                    }
                  }}
                  className="flex-1 px-6 py-3 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                  style={{ borderColor: '#0A2647', color: '#0A2647' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>

                <button
                  onClick={() => {
                    if (typeof onBuyNow === 'function') {
                      // SỬA Ở ĐÂY: Truyền product sạch đã biến đổi giá thành Số Nguyên
                      const cleanProduct = getCleanProductForCart();
                      onBuyNow(cleanProduct, quantity);
                    }
                  }}
                  className="flex-1 px-6 py-3 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#00BCD4' }}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || `${product.name} được tuyển chọn kỹ lưỡng, đảm bảo độ tươi ngon vượt trội khi giao tới tay khách hàng. Thích hợp chế biến nhiều món ăn ngon cho gia đình.`}
            </p>
          </div>

          {/* Supplier Info */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Thông tin nhà cung cấp</h3>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-cyan-50/40 rounded-xl border border-gray-100 flex-wrap gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-[#0A2647] text-white font-black text-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  {supplierInfo.avatar ? (
                    <img
                      src={supplierInfo.avatar}
                      alt={supplierInfo.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    supplierInfo.name ? supplierInfo.name.charAt(0).toUpperCase() : 'H'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base" style={{ color: '#0A2647' }}>{supplierInfo.name}</span>
                    {supplierInfo.verified && (
                      <BadgeCheck className="w-4 h-4" style={{ color: '#00BCD4' }} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" fill="#FFD700" stroke="#FFD700" />
                      {supplierInfo.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00BCD4]" />
                      {supplierInfo.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('farm-profile', supplierInfo.farmId)}
                className="px-6 py-2.5 border rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                style={{ borderColor: '#0A2647', color: '#0A2647' }}
              >
                Xem hồ sơ
              </button>
            </div>
          </div>

          {/* Product Reviews & Rating Breakdown Section */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-extrabold mb-6 text-[#0A2647] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00BCD4]" />
              Đánh giá từ khách hàng
            </h3>

            {/* Summary Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-2xl border border-gray-100 mb-8 shadow-xs">
              
              {/* Rating Big Badge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 text-center border-b md:border-b-0 md:border-r border-gray-200/60">
                <span className="text-5xl font-black text-[#0A2647]">
                  {reviewSummary?.averageRating || product.rating || 5.0}
                </span>
                <div className="flex items-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5"
                      fill={star <= Math.round(reviewSummary?.averageRating || product.rating || 5) ? '#FFD700' : 'none'}
                      stroke={star <= Math.round(reviewSummary?.averageRating || product.rating || 5) ? '#FFD700' : '#D1D5DB'}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  Dựa trên {reviewSummary?.totalReviews || product.reviews || 0} nhận xét
                </span>
              </div>

              {/* Progress Bars Breakdown */}
              <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
                {[
                  { star: 5, count: reviewSummary?.fiveStarCount || 0 },
                  { star: 4, count: reviewSummary?.fourStarCount || 0 },
                  { star: 3, count: reviewSummary?.threeStarCount || 0 },
                  { star: 2, count: reviewSummary?.twoStarCount || 0 },
                  { star: 1, count: reviewSummary?.oneStarCount || 0 }
                ].map(({ star, count }) => {
                  const total = reviewSummary?.totalReviews || 1;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-bold text-gray-600 flex items-center gap-1">
                        {star} <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <span className="w-10 text-right text-gray-400 font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: '5', label: '5 Sao' },
                { id: '4', label: '4 Sao' },
                { id: '3', label: '3 Sao' },
                { id: '2', label: '2 Sao' },
                { id: '1', label: '1 Sao' },
                { id: 'images', label: 'Có hình ảnh' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStarFilter(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                    activeStarFilter === tab.id
                      ? 'bg-[#0A2647] text-white border-[#0A2647] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            {reviewsList.length > 0 ? (
              <div className="space-y-6">
                {reviewsList.map((review) => (
                  <div key={review.id} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-3">
                    
                    {/* Review Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          {review.buyerName?.charAt(0)?.toUpperCase() || 'K'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0A2647]">
                              {review.buyerName || 'Khách hàng'}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3" />
                              Đã mua hàng
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-4 h-4"
                            fill={s <= review.rating ? '#FFD700' : 'none'}
                            stroke={s <= review.rating ? '#FFD700' : '#D1D5DB'}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    {review.comment && (
                      <p className="text-sm text-gray-700 leading-relaxed pl-1">
                        {review.comment}
                      </p>
                    )}

                    {/* Review Images Grid */}
                    {review.imageUrls && review.imageUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {review.imageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Review ${idx}`}
                            onClick={() => setLightboxImage(url)}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 hover:scale-105 transition-all shadow-xs"
                          />
                        ))}
                      </div>
                    )}

                    {/* Seller Reply Container */}
                    {review.sellerReply && (
                      <div className="mt-3 p-4 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0A2647] flex items-center gap-1.5">
                            <BadgeCheck className="w-4 h-4 text-[#00BCD4]" />
                            Phản hồi từ Người bán
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {review.sellerRepliedAt ? new Date(review.sellerRepliedAt).toLocaleDateString('vi-VN') : ''}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed italic">
                          "{review.sellerReply}"
                        </p>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">Chưa có đánh giá nào cho bộ lọc này.</p>
              </div>
            )}

          </div>
        </div>

        {/* Lightbox Image Preview Modal */}
        {lightboxImage && (
          <div 
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
              <img src={lightboxImage} alt="Full view" className="w-full h-full object-contain max-h-[85vh] rounded-2xl shadow-2xl" />
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#0A2647' }}>Sản phẩm tương tự</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  hoverimage={item.hoverimage}
                  price={item.price}
                  origin={item.origin}
                  rating={item.rating}
                  reviews={item.reviews}
                  onClick={() => onNavigate('product-detail', item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}