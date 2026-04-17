import { Star, MapPin, ShoppingCart } from 'lucide-react';

export function ProductCard({ 
  image, 
  name, 
  price, 
  origin, 
  rating, 
  reviews,
  onClick,
  onAddToCart
}) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
      style={{ borderColor: '#e5e7eb' }}
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]" style={{ color: '#0A2647' }}>
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600">{origin}</span>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3"
              fill={i < rating ? '#FFD700' : 'none'}
              stroke={i < rating ? '#FFD700' : '#D1D5DB'}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold" style={{ color: '#d4183d' }}>
            {price}
          </span>
          <button 
            className="p-2 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#00BCD4' }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}