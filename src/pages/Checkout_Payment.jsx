import React, { useState } from 'react';
import { X } from 'lucide-react';
import a from '../assets/1.png';
export default function Payment() {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    emailAddress: '',
    emailAddress2: '',
    cvv: '',
    cardholderName: '',
    sameAsShipping: true
  });
  
  const [couponCode, setCouponCode] = useState('');

  const handleInputChange = (section, field, value) => {
    if (section === 'contact') {
      setContactInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">1. Contact Information</h2>
              <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
                Change
              </button>
            </div>
          </div>

          {/* Payment Method Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">3. Payment Method</h2>
              <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
                Change
              </button>
            </div>
          </div>

          {/* Payment Method Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">3. Payment Method</h2>
            
            {/* Credit Card Section */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Credit Card</span>
                <div className="flex gap-2">
                  <img src="data:image/svg+xml,%3Csvg width='32' height='20' viewBox='0 0 32 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='20' rx='4' fill='%23005AA0'/%3E%3Cpath d='M13.5 7.5h5v5h-5v-5z' fill='white'/%3E%3C/svg%3E" alt="Visa" className="w-8 h-5" />
                  <img src="data:image/svg+xml,%3Csvg width='32' height='20' viewBox='0 0 32 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='20' rx='4' fill='%23FF5F00'/%3E%3Ccircle cx='12' cy='10' r='6' fill='%23EB001B'/%3E%3Ccircle cx='20' cy='10' r='6' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" className="w-8 h-5" />
                  <img src="data:image/svg+xml,%3Csvg width='32' height='20' viewBox='0 0 32 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='20' rx='4' fill='%23006FCF'/%3E%3Cpath d='M8 6h16v8H8V6z' fill='white'/%3E%3C/svg%3E" alt="American Express" className="w-8 h-5" />
                  <img src="data:image/svg+xml,%3Csvg width='32' height='20' viewBox='0 0 32 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='20' rx='4' fill='%23FF6900'/%3E%3Cpath d='M6 8h20v4H6V8z' fill='white'/%3E%3C/svg%3E" alt="Discover" className="w-8 h-5" />
                  <img src="data:image/svg+xml,%3Csvg width='32' height='20' viewBox='0 0 32 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='20' rx='4' fill='%231A1F71'/%3E%3Cpath d='M10 7h12v6H10V7z' fill='white'/%3E%3C/svg%3E" alt="Visa" className="w-8 h-5" />
                </div>
              </div>
              
              {/* Card Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email and CVV Row */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={paymentInfo.emailAddress}
                    onChange={(e) => handleInputChange('payment', 'emailAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={paymentInfo.emailAddress2}
                    onChange={(e) => handleInputChange('payment', 'emailAddress2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="CVV"
                    value={paymentInfo.cvv}
                    onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={paymentInfo.cardholderName}
                  onChange={(e) => handleInputChange('payment', 'cardholderName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  checked={paymentInfo.sameAsShipping}
                  onChange={(e) => handleInputChange('payment', 'sameAsShipping', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                  Billing address is the same as shipping address
                </label>
              </div>

              {/* Continue Button */}
              <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-500 transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-80">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Product */}
            <div className="flex gap-4 mb-6">
              <div className="w-16 h-16  rounded-lg flex items-center justify-center">
              <div className="w-10 h-12  rounded-full"> <img src={a}  alt="abc" /></div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">GOLD RING WITH DIAMOND</h4>
                <p className="text-sm text-gray-600 mb-1">Size: 17</p>
                <p className="font-medium text-gray-900">$31,222</p>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                Add Code
              </button>
            </div>

            {/* Summary Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">$31,222</span>
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
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-xl">$489</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}