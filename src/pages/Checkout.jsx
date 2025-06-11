import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function CheckoutForm() {
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [showOrderSummary, setShowOrderSummary] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          Shop / Ring / Order
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-lg font-medium mb-4">1. Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Already have an account? </span>
<Link to="/checkout-form">
  <button className="text-blue-600 hover:underline">Login</button>
</Link>                

</div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-gray-400 text-white px-8 py-2 rounded-md hover:bg-gray-500 transition-colors">
                  Continue
                </button>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">2. Shipping Address</h2>
                <button className="text-orange-500 text-sm hover:underline">
                  Change 
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">3. Payment Method</h2>
                <button className="text-orange-500 text-sm hover:underline">
                  Change 
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {showOrderSummary && (
              <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Order Summary</h3>
                  <button 
                    onClick={() => setShowOrderSummary(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Product */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-orange-300 rounded-full relative">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">GOLD RING WITH DIAMOND</h4>
                    <p className="text-sm text-gray-600">Size: 17</p>
                    <p className="text-sm font-medium">$34,222</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors text-sm">
                      Add Code
                    </button>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>$34,222</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>-</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>-</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>$489</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}