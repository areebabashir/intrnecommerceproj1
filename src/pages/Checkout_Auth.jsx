import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckoutShipping() {
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('productCart')) || [];
    const savedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));
    setCartItems(savedCart);
    if (savedCoupon) setAppliedCoupon(savedCoupon);
  }, []);

  const handleInputChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    console.log('Shipping Info:', shippingData);
    // You can store this in localStorage or proceed to payment
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!appliedCoupon) return subtotal;

    if (appliedCoupon.type === 'percentage') {
      return subtotal - subtotal * appliedCoupon.discount;
    }
    if (appliedCoupon.type === 'flat') {
      return subtotal - appliedCoupon.discount;
    }
    return subtotal;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto mb-8">
        <nav className="text-sm text-gray-500">Shop / Ring / Shipping</nav>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <input
              type="text"
              name="fullName"
              value={shippingData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="address"
              value={shippingData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="city"
              value={shippingData.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="postalCode"
              value={shippingData.postalCode}
              onChange={handleInputChange}
              placeholder="Postal Code"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="phone"
              value={shippingData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/checkoutform">
                <button
                  type="button"
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back To Info
                </button>
              </Link>
              <Link to="/checkoutship">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-md"
                >
                  Continue
                </button>
              </Link>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border h-fit lg:col-span-1">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">
                  {appliedCoupon ? appliedCoupon.code : '-'}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
