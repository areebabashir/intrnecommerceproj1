import React, { useState } from 'react';
import { ArrowLeft, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import a from '../assets/1.png';


export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [couponCode, setCouponCode] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-8">
        <nav className="text-sm text-gray-500">Shop / Ring / Order</nav>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">New Customer</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back To Customer Info
              </button>

             <Link to="/checkoutship">
  <button
    type="button"
    className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
  >
    Continue & Continue
  </button>
</Link>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border h-fit lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Item */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b">
            <div className="relative">
              <div className="w-16 h-16  rounded-full flex items-center justify-center">
                <div className="w-10 h-10 border-2  rounded-full"> <img src={a} alt="" /></div>
              </div>
              <button className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300">
                <Trash2 className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">GOLD RING WITH DIAMOND</h3>
              <p className="text-sm text-gray-600">Size: 17</p>
              <p className="font-semibold text-lg">$34,222</p>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                Add Code
              </button>
            </div>
          </div>

          {/* Order Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">$34,222</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium">-</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">-</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>$489</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
