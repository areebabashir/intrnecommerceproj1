import React, { useState } from 'react';
import { ChevronRight, X, Trash2 } from 'lucide-react';
import a from '../assets/1.png';



const Preview = () => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in production, this would come from your state/API
  const orderData = {
    shipping: {
      method: 'Express: $20',
      address: {
        name: 'Alex Turner',
        street: 'A1961 NW North River Dr',
        city: 'Miami, FL 33125',
        country: 'United States',
        phone: '+1 (305) 999-999'
      }
    },
    payment: {
      method: 'Visa',
      last4: '4622',
      name: 'Alex Turner'
    },
    billing: {
      name: 'Alex Turner',
      street: 'A1961 NW North River Dr',
      city: 'Miami, FL 33125',
      country: 'United States',
      phone: '+1 (305) 999-999'
    },
    product: {
      name: 'GOLD RING WITH DIAMOND',
      size: '17',
      price: 34222,
      image: '/api/placeholder/80/80'
    },
    summary: {
      subtotal: 34222,
      shipping: 0,
      discount: 0,
      tax: 0,
      total: 489
    }
  };

  const handleCouponAdd = () => {
    if (couponCode.trim()) {
      // Handle coupon logic here
      console.log('Adding coupon:', couponCode);
      setCouponCode('');
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Order placed successfully! Thank you for your purchase.');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (section) => {
    console.log(`Changing ${section}`);
    // In a real app, this would navigate back to edit that section
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-500">
            Shop / Ring / Order
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-medium mb-8">Preview Order</h1>
            
            <div className="space-y-6">
              {/* Shipping Method */}
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Shipping Method</h3>
                      <p className="text-gray-600">{orderData.shipping.method}</p>
                    </div>
                    <button 
                      onClick={() => handleChange('shipping')}
                      className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium"
                    >
                      Change
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                      <div className="text-gray-600 space-y-1">
                        <p className="font-medium">{orderData.shipping.address.name}</p>
                        <p>{orderData.shipping.address.street}</p>
                        <p>{orderData.shipping.address.city}</p>
                        <p>{orderData.shipping.address.country}</p>
                        <p>{orderData.shipping.address.phone}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleChange('address')}
                      className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium"
                    >
                      Change
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Payment Method</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          VISA
                        </div>
                        <span className="text-gray-600">•••• •••• •••• {orderData.payment.last4}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{orderData.payment.name}</p>
                    </div>
                    <button 
                      onClick={() => handleChange('payment')}
                      className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium"
                    >
                      Change
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Billing Address</h3>
                      <div className="text-gray-600 space-y-1">
                        <p className="font-medium">{orderData.billing.name}</p>
                        <p>{orderData.billing.street}</p>
                        <p>{orderData.billing.city}</p>
                        <p>{orderData.billing.country}</p>
                        <p>{orderData.billing.phone}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleChange('billing')}
                      className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium"
                    >
                      Change
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-8">
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 px-6 rounded-md font-medium text-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border sticky top-8">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Order Summary</h3>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Product */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16  rounded-lg flex items-center justify-center">
                      <div className="w-10 h-10   rounded-full relative">
                        <div className="absolute top-1 left-1 w-full h-full  rounded-full"><img src={a} alt="abc" /></div>
                      </div>
                    </div>
                    <button className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                      <Trash2 className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 leading-tight">
                      {orderData.product.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">Size: {orderData.product.size}</p>
                    <p className="font-medium text-gray-900 mt-1">
                      ${orderData.product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex rounded-md border border-gray-300 overflow-hidden">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                      onKeyPress={(e) => e.key === 'Enter' && handleCouponAdd()}
                    />
                    <button 
                      onClick={handleCouponAdd}
                      className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border-l border-gray-300"
                    >
                      Add Code
                    </button>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${orderData.summary.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-gray-600">-</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-600">-</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${orderData.summary.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;