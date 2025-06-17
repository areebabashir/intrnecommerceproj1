import React, { useEffect, useState } from 'react';
import { Minus, Plus, X, ShoppingCart, ArrowLeft, Tag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { initializeCart } from '../features/cartSlice';
import {
  selectCartItems,
  selectCartCount,
  selectSubtotal,
  selectShippingCost,
  selectDiscount,
  selectTax,
  selectTotal,
  selectAppliedCoupon,
  selectNotification,
  updateQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
  clearNotification,
  prepareCheckout
} from '../features/cartSlice';

export default function OrderSummary() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectSubtotal);
  const shipping = useSelector(selectShippingCost);
  const discount = useSelector(selectDiscount);
  const tax = useSelector(selectTax);
  const total = useSelector(selectTotal);
  const coupon = useSelector(selectAppliedCoupon);
  const notification = useSelector(selectNotification);
  const [couponCode, setCouponCode] = useState('');

  // Initialize cart on mount
  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);

  // Auto-clear notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

 

  if (count === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
            <Link 
              to="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items Section */}
          <div className="lg:flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-semibold">Your Cart ({count} {count === 1 ? 'item' : 'items'})</h1>
              <button
                onClick={() => dispatch(clearCart())}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
                aria-label="Clear cart"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.addedAt}`} className="bg-white rounded-lg border p-6 flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mt-1">{item.description?.substring(0, 100)}...</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => dispatch(updateQuantity({
                            id: item.id, 
                            quantity: Math.max(1, item.quantity - 1)
                          }))}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({
                            id: item.id, 
                            quantity: item.quantity + 1
                          }))}
                          className="px-3 py-1 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <p className="text-lg font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                        {item.quantity > 1 && (
                          <span className="text-sm text-gray-500 ml-1">
                            (${item.price.toFixed(2)} each)
                          </span>
                        )}
                      </p>
                    </div>
                    
                    {/* Product Specifications */}
                    {item.specifications && (
                      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(item.specifications).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="font-medium capitalize">{key}:</span>
                              <span className="ml-2">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg border p-8 sticky top-4">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              
              {/* Items List */}
              <div className="mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`mini-${item.id}-${item.addedAt}`} className="flex items-center py-3 border-b last:border-0">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                {coupon ? (
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded">
                    <div className="flex items-center">
                      <Tag className="text-green-600 mr-2" size={16} />
                      <span className="font-medium">{coupon.code}</span>
                      <span className="ml-2 text-sm text-green-700">
                        ({coupon.type === 'percentage' ? `${coupon.discount * 100}% off` : `$${coupon.discount} off`})
                      </span>
                    </div>
                    <button
                      onClick={() => dispatch(removeCoupon())}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded"
                      aria-label="Coupon code input"
                    />
                    <button
                      onClick={() => dispatch(applyCoupon(couponCode))}
                      disabled={!couponCode.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
                      aria-label="Apply coupon"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal ({count} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/checkoutship">
  <button
    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold mt-6 transition-colors"
    aria-label="Proceed to checkout"
  >
    Proceed to Checkout
  </button>
</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}