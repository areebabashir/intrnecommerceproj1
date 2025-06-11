import React, { useState, useEffect } from 'react';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';

export default function OrderSummary() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [notification, setNotification] = useState('');

  // Available coupons
  const coupons = {
    'SAVE10': { discount: 0.10, type: 'percentage', description: '10% off' },
    'FLAT50': { discount: 50, type: 'flat', description: '$50 off' },
    'WELCOME': { discount: 0.15, type: 'percentage', description: '15% off for new customers' }
  };

  // Load cart items on component mount
 useEffect(() => {
  // Get saved cart from localStorage
  const savedCart = JSON.parse(localStorage.getItem('productCart')) || [];
  setCartItems(savedCart);

  // Listen for cart updates from other components
  const handleCartUpdate = (event) => {
    const updatedCart = event.detail;
    setCartItems(updatedCart);
    // Save the updated cart to localStorage
    localStorage.setItem('productCart', JSON.stringify(updatedCart));
  };

  window.addEventListener('cartUpdated', handleCartUpdate);
  return () => window.removeEventListener('cartUpdated', handleCartUpdate);
}, []);

  // Save cart to global state
  const saveCartToGlobalState = (updatedCart) => {
    window.productCart = updatedCart;
    setCartItems(updatedCart);
    
    // Trigger event for other components
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart }));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    saveCartToGlobalState(updatedCart);
    setNotification('Quantity updated!');
    setTimeout(() => setNotification(''), 2000);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    saveCartToGlobalState(updatedCart);
    setNotification('Item removed from cart!');
    setTimeout(() => setNotification(''), 2000);
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      setNotification(`Coupon "${couponCode.toUpperCase()}" applied! ${coupon.description}`);
      setCouponCode('');
    } else {
      setNotification('Invalid coupon code!');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setNotification('Coupon removed!');
    setTimeout(() => setNotification(''), 2000);
  };

  const clearCart = () => {
    saveCartToGlobalState([]);
    setNotification('Cart cleared!');
    setTimeout(() => setNotification(''), 2000);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = subtotal * appliedCoupon.discount;
    } else {
      discount = appliedCoupon.discount;
    }
  }
  
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal + shipping - discount + tax;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm text-gray-500 mb-6">
            Shop / Cart / Order
          </div>
          
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some products to your cart to see them here.</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            {notification}
          </div>
        )}

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Shop / Cart / Order
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side - Cart Items */}
          <div className="lg:flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-semibold">Order Summary</h1>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6 flex-1">
                    <img
                      src={item.image || item.images?.[0] || 'https://placehold.co/80x80'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-base text-gray-500">{item.id}</p>
                      <p className="text-sm text-gray-400">Unit Price: ${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-semibold text-xl">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-3 border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-10 text-center text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg border p-8 sticky top-4">
              <h2 className="text-2xl font-semibold mb-8">Order Summary</h2>

              {/* Mini Product List */}
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image || item.images?.[0] || 'https://placehold.co/50x50'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <span className="text-green-700 font-medium">{appliedCoupon.code} applied</span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-3 border rounded text-base"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                      className="px-6 py-3 bg-orange-500 text-white rounded text-base hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Try: SAVE10, FLAT50, WELCOME
                </div>
              </div>

              {/* Order Totals */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-base text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-semibold border-t pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg mt-6 transition-colors">
              <a href="/Login">Proceed to Checkout</a>  
              </button>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}