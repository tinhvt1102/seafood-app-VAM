import { useState } from 'react';
import { Star, MapPin, ShoppingCart, Minus, Plus, BadgeCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailPage({ productId, onNavigate, onAddToCart, onBuyNow }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const products = [
    {
      id: '1',
      name: 'Tôm sú tươi sống size 20-25',
      images: [
        'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
      price: '450.000đ',
      originalPrice: '550.000đ',
      rating: 4,
      reviews: 42,
      sold: 127,
      origin: 'Cà Mau',
      size: '20-25 con/kg',
      harvestDate: '05/03/2026',
      description: 'Tôm sú tươi sống được nuôi theo tiêu chuẩn VietGAP, đảm bảo chất lượng và an toàn thực phẩm. Tôm có kích cỡ đồng đều, thịt chắc, ngọt tự nhiên.',
      supplier: {
        name: 'Hộ nuôi Hải Sản Phất Đạt',
        farmId: '1',
        verified: true,
        rating: 5,
        location: 'Cà Mau'
      }
    },
    {
      id: '2',
      name: 'Cá Tra phi lê tươi nguyên chất',
      images: [
        'https://images.unsplash.com/photo-1674066620888-4878aad91094?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?q=80&w=1080',
      price: '85.000đ',
      originalPrice: '100.000đ',
      rating: 3,
      reviews: 156,
      sold: 320,
      origin: 'An Giang',
      size: 'Phi lê 500g/gói',
      harvestDate: '04/03/2026',
      description: 'Cá Tra phi lê tươi, thịt trắng, mềm, ít xương, phù hợp để chiên, kho hoặc chế biến món ăn gia đình.',
      supplier: {
        name: 'Trang trại cá An Giang',
        farmId: '2',
        verified: true,
        rating: 4,
        location: 'An Giang'
      }
    },
    {
      id: '3',
      name: 'Cua biển tươi sống',
      images: [
        'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?q=80&w=1080',
      price: '320.000đ',
      originalPrice: '390.000đ',
      rating: 5,
      reviews: 38,
      sold: 89,
      origin: 'Kiên Giang',
      size: '3-4 con/kg',
      harvestDate: '05/03/2026',
      description: 'Cua biển tươi sống, chắc thịt, gạch nhiều, được tuyển chọn từ vùng biển Kiên Giang.',
      supplier: {
        name: 'Vựa hải sản Kiên Giang',
        farmId: '3',
        verified: true,
        rating: 5,
        location: 'Kiên Giang'
      }
    },
    {
      id: '4',
      name: 'Mực tươi nguyên con',
      images: [
        'https://images.unsplash.com/photo-1762305195844-94479ea6aca4?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1762305195844-94479ea6aca4?q=80&w=1080',
      price: '180.000đ',
      originalPrice: '220.000đ',
      rating: 5,
      reviews: 29,
      sold: 76,
      origin: 'Vũng Tàu',
      size: '5-7 con/kg',
      harvestDate: '05/03/2026',
      description: 'Mực tươi nguyên con, thân dày, thịt ngọt, phù hợp hấp, nướng, xào hoặc nhúng lẩu.',
      supplier: {
        name: 'Hải sản Vũng Tàu Fresh',
        farmId: '4',
        verified: true,
        rating: 5,
        location: 'Vũng Tàu'
      }
    },
    {
      id: '5',
      name: 'Tôm thẻ chân trắng size 60-70',
      images: [
        'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
      price: '280.000đ',
      originalPrice: '330.000đ',
      rating: 4,
      reviews: 73,
      sold: 145,
      origin: 'Bạc Liêu',
      size: '60-70 con/kg',
      harvestDate: '04/03/2026',
      description: 'Tôm thẻ chân trắng tươi, kích cỡ đồng đều, phù hợp chế biến món ăn hằng ngày.',
      supplier: {
        name: 'Hộ nuôi tôm Bạc Liêu',
        farmId: '5',
        verified: true,
        rating: 4,
        location: 'Bạc Liêu'
      }
    },
    {
      id: '6',
      name: 'Hải sản tổng hợp',
      images: [
        'https://images.unsplash.com/photo-1596563976996-e5dc9a1990c9?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1596563976996-e5dc9a1990c9?q=80&w=1080',
      price: '550.000đ',
      originalPrice: '650.000đ',
      rating: 3,
      reviews: 91,
      sold: 201,
      origin: 'Nhiều vùng',
      size: 'Combo 2kg',
      harvestDate: '05/03/2026',
      description: 'Combo hải sản tổng hợp gồm nhiều loại hải sản tươi, phù hợp cho gia dịch hoặc tiệc nhỏ.',
      supplier: {
        name: 'Vựa hải sản tổng hợp',
        farmId: '6',
        verified: true,
        rating: 4,
        location: 'Nhiều vùng'
      }
    },
    {
      id: '7',
      name: 'Ghẹ xanh tươi sống',
      images: [
        'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?q=80&w=1080',
      price: '380.000đ',
      originalPrice: '450.000đ',
      rating: 4,
      reviews: 54,
      sold: 88,
      origin: 'Cà Mau',
      size: '4-6 con/kg',
      harvestDate: '05/03/2026',
      description: 'Ghẹ xanh tươi sống, thịt ngọt, chắc, được đóng gói và vận chuyển trong ngày.',
      supplier: {
        name: 'Hải sản Cà Mau',
        farmId: '7',
        verified: true,
        rating: 4,
        location: 'Cà Mau'
      }
    },
    {
      id: '8',
      name: 'Tôm hùm Alaska',
      images: [
        'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
      price: '1.200.000đ',
      originalPrice: '1.400.000đ',
      rating: 5,
      reviews: 112,
      sold: 58,
      origin: 'Nhập khẩu',
      size: '1-1.5kg/con',
      harvestDate: '03/03/2026',
      description: 'Tôm hùm Alaska nhập khẩu, thịt chắc, vị ngọt tự nhiên, phù hợp cho các món hấp, nướng bơ tỏi.',
      supplier: {
        name: 'Seafood Import Việt Nam',
        farmId: '8',
        verified: true,
        rating: 5,
        location: 'Nhập khẩu'
      }
    },
    {
      id: '9',
      name: 'Cá Hồi Na Uy phi lê',
      images: [
        'https://images.unsplash.com/photo-1674066620888-4878aad91094?q=80&w=1080',
        'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?q=80&w=1080',
        'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?q=80&w=1080'
      ],
      image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?q=80&w=1080',
      price: '650.000đ',
      originalPrice: '750.000đ',
      rating: 3,
      reviews: 203,
      sold: 410,
      origin: 'Nhập khẩu',
      size: 'Phi lê 500g/gói',
      harvestDate: '03/03/2026',
      description: 'Cá hồi Na Uy phi lê, giàu dinh dưỡng, phù hợp làm sashimi, áp chảo hoặc salad.',
      supplier: {
        name: 'Seafood Import Việt Nam',
        farmId: '9',
        verified: true,
        rating: 5,
        location: 'Nhập khẩu'
      }
    }
  ];

  const product = products.find((item) => item.id === productId) || products[0];

  const similarProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      price: `${item.price}/kg`,
      origin: item.origin,
      rating: item.rating,
      reviews: item.reviews
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-[#00BCD4]' : 'border-transparent'
                      }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: '#0A2647' }}>{product.name}</h1>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < product.rating ? '#FFD700' : 'none'}
                      stroke={i < product.rating ? '#FFD700' : '#D1D5DB'}
                    />
                  ))}
                  <span className="text-sm ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{product.reviews} đánh giá</span>
                <span className="text-sm text-gray-500">{product.sold} đã bán</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold" style={{ color: '#d4183d' }}>{product.price}</span>
                  <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded">-18%</span>
                </div>
                <p className="text-sm text-gray-600">Giá theo kg</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Xuất xứ:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Kích cỡ:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.size}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Ngày thu hoạch:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.harvestDate}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium" style={{ color: '#0A2647' }}>Số lượng (kg)</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md" style={{ borderColor: '#e5e7eb' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x py-1"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">Còn 50kg khả dụng</span>
                </div>
              </div>

              {/* Đã đồng bộ nút bấm gọi thẳng lên hàm của App.jsx */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (typeof onAddToCart === 'function') {
                      onAddToCart(product, quantity);
                      onNavigate('cart'); // Chuyển sang trang giỏ hàng như bạn muốn
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
                      onBuyNow(product, quantity);
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
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Supplier Info */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Thông tin nhà cung cấp</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold" style={{ color: '#0A2647' }}>{product.supplier.name}</span>
                    {product.supplier.verified && (
                      <BadgeCheck className="w-4 h-4" style={{ color: '#00BCD4' }} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" fill="#FFD700" stroke="#FFD700" />
                      {product.supplier.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.supplier.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('farm-profile', product.supplier.farmId)}
                className="px-6 py-2 border rounded-md hover:bg-white transition-colors text-sm font-medium"
                style={{ borderColor: '#0A2647', color: '#0A2647' }}
              >
                Xem hồ sơ
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#0A2647' }}>Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map((item) => (
              <ProductCard
                key={item.id}
                {...item}
                onClick={() => onNavigate('product-detail', item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}