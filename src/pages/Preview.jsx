import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartCount,
  selectSubtotal,
  selectShippingCost,
  selectDiscount,
  selectTax,
  selectTotal,
  selectAppliedCoupon
} from '../features/cartSlice';

const Preview = () => {
  // Redux state
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartCount);
  const subtotal = useSelector(selectSubtotal);
  const shipping = useSelector(selectShippingCost);
  const discount = useSelector(selectDiscount);
  const tax = useSelector(selectTax);
  const total = useSelector(selectTotal);
  const coupon = useSelector(selectAppliedCoupon);

  // Local state
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  // Load checkout data from localStorage
  useEffect(() => {
    const loadCheckoutData = () => {
      try {
        const savedData = localStorage.getItem('checkoutFormData');
        if (savedData) {
          setCheckoutData(JSON.parse(savedData));
        }
      } catch (e) {
        console.error("Error loading checkout data:", e);
      }
    };

    loadCheckoutData();
    
    window.addEventListener('storage', loadCheckoutData);
    return () => window.removeEventListener('storage', loadCheckoutData);
  }, []);

  // Get formatted order data
  const getOrderData = () => {
    if (!checkoutData) {
      return {
        contact: { email: 'No email provided' },
        shipping: {
          method: 'Standard Shipping',
          address: {
            name: 'Please complete checkout form',
            street: 'No address provided',
            city: '',
            country: '',
            phone: ''
          }
        },
        payment: {
          method: 'No payment method',
          last4: '0000',
          name: 'Please complete checkout form'
        },
        billing: {
          name: 'Please complete checkout form',
          street: 'No address provided',
          city: '',
          country: '',
          phone: ''
        }
      };
    }

    const { contactInfo, shippingInfo, paymentInfo } = checkoutData;

    return {
      contact: { email: contactInfo?.email || 'No email provided' },
      shipping: {
        method: 'Express Shipping',
        address: {
          name: `${shippingInfo?.firstName || ''} ${shippingInfo?.lastName || ''}`.trim() || 'Not provided',
          street: shippingInfo?.streetAddress || 'Not provided',
          addressLine2: shippingInfo?.addressLine2 || '',
          city: `${shippingInfo?.city || ''}, ${shippingInfo?.state || ''} ${shippingInfo?.zipCode || ''}`.trim(),
          country: shippingInfo?.country || 'Not provided',
          phone: shippingInfo?.phoneNumber || 'Not provided'
        }
      },
      payment: {
        method: paymentInfo?.cardNumber ? 'Visa' : 'Not provided',
        last4: paymentInfo?.cardNumber ? paymentInfo.cardNumber.slice(-4) : '0000',
        name: paymentInfo?.cardholderName || 'Not provided'
      },
      billing: paymentInfo?.sameAsShipping ? {
        name: 'Same as shipping address',
        street: '',
        city: '',
        country: '',
        phone: ''
      } : {
        name: 'Different billing address',
        street: 'Not implemented',
        city: '',
        country: '',
        phone: ''
      }
    };
  };

  const orderData = getOrderData();

  const handleCouponAdd = () => {
    if (couponCode.trim()) {
      console.log('Adding coupon:', couponCode);
      setCouponCode('');
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Order placed successfully! Thank you for your purchase.');
      localStorage.removeItem('checkoutFormData');
      setCheckoutData(null);
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (section) => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-500">Shop / Ring / Order</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Alert if no checkout data */}
        {!checkoutData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-yellow-800">
                <strong>Notice:</strong> No checkout information found. Please complete the checkout form first.
                <button 
                  onClick={() => window.history.back()}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Go back to checkout
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-medium mb-8">Preview Order</h1>
            
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Contact Information</h3>
                      <p className="text-gray-600">{orderData.contact.email}</p>
                    </div>
                    <button 
                      onClick={() => handleChange('contact')}
                      className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium"
                    >
                      Change
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

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
                        {orderData.shipping.address.addressLine2 && (
                          <p>{orderData.shipping.address.addressLine2}</p>
                        )}
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
                        {checkoutData?.paymentInfo?.sameAsShipping ? (
                          <p className="italic">Same as shipping address</p>
                        ) : (
                          <>
                            <p className="font-medium">{orderData.billing.name}</p>
                            <p>{orderData.billing.street}</p>
                            <p>{orderData.billing.city}</p>
                            <p>{orderData.billing.country}</p>
                            <p>{orderData.billing.phone}</p>
                          </>
                        )}
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
                disabled={isLoading || !checkoutData}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 px-6 rounded-md font-medium text-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Complete Order'
                )}
              </button>
              {!checkoutData && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Complete the checkout form to enable order placement
                </p>
              )}
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
                {/* Cart Items */}
                <div className="mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start py-3 border-b">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.images || '/placeholder-product.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-gray-500">Size: {item.size}</p>
                        <p className="text-sm mt-1">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
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
                          ({coupon.discount * 100}% off)
                        </span>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700"
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
                      />
                      <button
                        onClick={handleCouponAdd}
                        disabled={!couponCode.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Order Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
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
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
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