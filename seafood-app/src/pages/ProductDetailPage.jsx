import { useState } from 'react';
import { Star, MapPin, ShoppingCart, Minus, Plus, BadgeCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';


export function ProductDetailPage({ productId, onNavigate, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: 'Tôm sú tươi sống size 20-25',
    images: [
      'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcCUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyNjA3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwbWFya2V0JTIwc2VhZm9vZHxlbnwxfHx8fDE3NzI3MTE1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1723132925908-9d155ac2611e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwbWFya2V0JTIwdmlldG5hbXxlbnwxfHx8fDE3NzI3MTE1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    price: '450.000đ',
    originalPrice: '550.000đ',
    rating: 5,
    reviews: 42,
    sold: 127,
    origin: 'Cà Mau',
    size: '20-25 con/kg',
    harvestDate: '05/03/2026',
    description: 'Tôm sú tươi sống được nuôi theo tiêu chuẩn VietGAP, đảm bảo chất lượng và an toàn thực phẩm. Tôm có kích cỡ đồng đều, thịt chắc, ngọt tự nhiên. Phù hợp để chế biến các món ăn cao cấp.',
    supplier: {
      name: 'Hộ nuôi Hải Sản Phất Đạt',
      verified: true,
      rating: 5,
      location: 'Cà Mau'
    }
  };

  const similarProducts = [
    {
      id: '2',
      name: 'Tôm thẻ chân trắng size 60-70',
      image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcCUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyNjA3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '280.000đ/kg',
      origin: 'Bạc Liêu',
      rating: 5,
      reviews: 73
    },
    {
      id: '3',
      name: 'Cua biển tươi sống',
      image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFiJTIwc2VhZm9vZCUyMGZyZXNofGVufDF8fHx8MTc3MjYzNTMzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      price: '320.000đ/kg',
      origin: 'Kiên Giang',
      rating: 4,
      reviews: 38
    },
    {
      id: '4',
      name: 'Mực tươi nguyên con',
      image: 'https://images.unsplash.com/photo-1762305195844-94479ea6aca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcXVpZCUyMGZyZXNoJTIwc2VhZm9vZHxlbnwxfHx8fDE3NzI3MTE1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '180.000đ/kg',
      origin: 'Vũng Tàu',
      rating: 5,
      reviews: 29
    },
    {
      id: '5',
      name: 'Hải sản tổng hợp',
      image: 'https://images.unsplash.com/photo-1596563976996-e5dc9a1990c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdGUlMjBmcmVzaHxlbnwxfHx8fDE3NzI3MTE1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '550.000đ/combo',
      origin: 'Nhiều vùng',
      rating: 5,
      reviews: 91
    }
  ];

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
              <h1 className="mb-4" style={{ color: '#0A2647' }}>{product.name}</h1>

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
                  <span className="text-3xl" style={{ color: '#d4183d' }}>{product.price}</span>
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
                  <span className="text-gray-600">Kích cỡ:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.size}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Ngày thu hoạch:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.harvestDate}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2" style={{ color: '#0A2647' }}>Số lượng (kg)</label>
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
                      className="w-16 text-center border-x"
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

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const productToCart = {
                      id: productId,
                      name: product.name,
                      price: 450000,
                      image: product.images[0],
                      quantity: quantity
                    };
                    onAddToCart(productToCart);
                    onNavigate('cart');
                  }}
                  className="flex-1 px-6 py-3 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  style={{ borderColor: '#0A2647', color: '#0A2647' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={() => {
                    const productToCart = {
                      id: productId,
                      name: product.name,
                      price: 450000,
                      image: product.images[0],
                      quantity: quantity
                    };
                    onAddToCart(productToCart);
                    onNavigate('checkout');
                  }}
                  className="flex-1 px-6 py-3 rounded-md text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#00BCD4' }}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="mb-4" style={{ color: '#0A2647' }}>Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Supplier Info */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="mb-4" style={{ color: '#0A2647' }}>Thông tin nhà cung cấp</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZhcm0lMjBwb25kfGVufDF8fHx8MTc3MjcxMTU0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium" style={{ color: '#0A2647' }}>{product.supplier.name}</span>
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
                onClick={() => onNavigate('farm-profile', '1')}
                className="px-6 py-2 border rounded-md hover:bg-white transition-colors text-sm"
                style={{ borderColor: '#0A2647', color: '#0A2647' }}
              >
                Xem hồ sơ
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div>
          <h2 className="mb-6" style={{ color: '#0A2647' }}>Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                onClick={() => onNavigate('product-detail', p.id)}
                onAddToCart={() => onAddToCart({ ...p, price: parseInt(p.price.replace(/\D/g, "")) })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
