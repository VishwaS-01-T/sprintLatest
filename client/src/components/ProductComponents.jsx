import React from 'react';
import { Star, Plus, Minus } from 'lucide-react';
import { Button, Badge } from './UI';

export function SimpleProductCard({ product, onAddToCart, variant = 'grid' }) {
  const discount = product.discountPercent || 0;

  return (
    <div
      className={`${variant === 'grid' ? 'border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow' : 'flex gap-4 border-b border-gray-200 pb-4'}`}
    >
      {/* Image */}
      <div
        className={`${variant === 'grid' ? 'w-full h-48' : 'w-24 h-24 flex-shrink-0'} bg-gray-200 rounded flex items-center justify-center overflow-hidden`}
      >
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div>👟</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${variant === 'grid' ? 'p-4' : 'flex-1'} flex flex-col justify-between`}>
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{product.description}</p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}/5</span>
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className={`${variant === 'grid' ? 'mt-4' : ''} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              ₹{product.discountPrice || product.basePrice}
            </span>
            {discount > 0 && (
              <>
                <span className="text-sm text-gray-500 line-through">₹{product.basePrice}</span>
                <Badge variant="red">{discount}% OFF</Badge>
              </>
            )}
          </div>
          <Button size="sm" onClick={() => onAddToCart(product.id)}>
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CartItemComponent({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 border-b border-gray-200 pb-4">
      {/* Image */}
      <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
        {item.product?.images?.[0]?.url ? (
          <img
            src={item.product.images[0].url}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">👟</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
        {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
        <p className="text-sm font-semibold mt-2">
          ₹{item.priceAtAddition || item.product?.discountPrice || item.product?.basePrice}
        </p>
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="font-bold text-gray-900">
          ₹
          {(item.priceAtAddition || item.product?.discountPrice || item.product?.basePrice) *
            item.quantity}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-sm text-red-600 hover:text-red-800 mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function OrderCard({ order }) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RETURNED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
          <p className="font-semibold text-gray-900 mt-1">{order.userEmail}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      {order.items && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Items ({order.items.length})</p>
          {order.items.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600">
              {item.quantity}x {item.product?.name}
            </p>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="font-bold text-lg text-gray-900">₹{order.totalAmount}</p>
        </div>
        <Button size="sm" variant="outline">
          View Details
        </Button>
      </div>
    </div>
  );
}

export function PriceFilter({
  onPriceChange,
  min = 0,
  max = 50000,
  minValue = 0,
  maxValue = 50000,
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Price Range</h3>
      <div className="space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={(e) => onPriceChange(parseInt(e.target.value), maxValue)}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={(e) => onPriceChange(minValue, parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{minValue}</span>
          <span>₹{maxValue}</span>
        </div>
      </div>
    </div>
  );
}

export function SizeFilter({ sizes = [], onSizeChange, selectedSizes = [] }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Size</h3>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => {
              const newSizes = selectedSizes.includes(size)
                ? selectedSizes.filter((s) => s !== size)
                : [...selectedSizes, size];
              onSizeChange(newSizes);
            }}
            className={`
              py-2 px-3 rounded border text-sm font-medium transition-colors
              ${
                selectedSizes.includes(size)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 text-gray-700 hover:border-black'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
