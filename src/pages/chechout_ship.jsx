import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Plus } from 'lucide-react';
import a from '../assets/1.png';

const Checkoutship = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Contact Info
    email: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    country: 'United States',
    streetAddress: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    saveInfo: false,
    smsNotifications: false,
    
    // Payment
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Product data
  const product = {
    name: 'GOLD RING WITH DIAMOND',
    size: '17',
    price: 34222,
    image: '/api/placeholder/80/80'
  };

  const orderSummary = {
    subtotal: 34222,
    shipping: 0,
    discount: 0,
    tax: 0,
    total: 489
  };

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    }
    
    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.streetAddress) newErrors.streetAddress = 'Street address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleContinue = async () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process payment
      setIsLoading(true);
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Order placed successfully!');
      } catch (error) {
        alert('Payment failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStepClick = (step) => {
    if (step < currentStep || (step === currentStep)) {
      setCurrentStep(step);
    }
  };

  // Input component with error handling
  const Input = ({ label, type = 'text', field, placeholder, required = false, className = '' }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={formData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[field] && (
        <p className="text-sm text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  const Select = ({ label, field, options, required = false }) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {errors[field] && (
        <p className="text-sm text-red-500">{errors[field]}</p>
      )}
    </div>
  );

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
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  Contact Information
                </h2>
                {currentStep > 1 && (
                  <button 
                    onClick={() => handleStepClick(1)}
                    className="text-orange-500 text-sm hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
              
              {currentStep >= 1 && (
                <div className="space-y-4">
                  <Input
                    type="email"
                    field="email"
                    placeholder="Email"
                    required
                    className="max-w-md"
                  />
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 ${
                    currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </span>
                  Shipping Address
                </h2>
                {currentStep > 2 && (
                  <button 
                    onClick={() => handleStepClick(2)}
                    className="text-orange-500 text-sm hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
              
              {currentStep >= 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      field="firstName"
                      placeholder="First Name"
                      required
                    />
                    <Input
                      label="Last Name"
                      field="lastName"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  
                  <Select
                    label="Country"
                    field="country"
                    required
                    options={[
                      { value: 'United States', label: 'United States' },
                      { value: 'Canada', label: 'Canada' },
                      { value: 'United Kingdom', label: 'United Kingdom' }
                    ]}
                  />
                  
                  <Input
                    label="Street Address"
                    field="streetAddress"
                    placeholder="Street Address"
                    required
                  />
                  
                  <button 
                    type="button"
                    className="text-blue-500 text-sm hover:underline flex items-center"
                    onClick={() => handleInputChange('showAddressLine2', !formData.showAddressLine2)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Line 2
                  </button>
                  
                  {formData.showAddressLine2 && (
                    <Input
                      field="addressLine2"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  )}
                  
                  <Input
                    label="City"
                    field="city"
                    placeholder="City"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="State"
                      field="state"
                      required
                      options={[
                        { value: '', label: 'Select State' },
                        { value: 'CA', label: 'California' },
                        { value: 'NY', label: 'New York' },
                        { value: 'TX', label: 'Texas' }
                      ]}
                    />
                    <Input
                      label="ZIP Code"
                      field="zipCode"
                      placeholder="ZIP Code"
                      required
                    />
                  </div>
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    field="phoneNumber"
                    placeholder="Phone Number"
                    required
                  />
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.saveInfo}
                        onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Save this information for a future fast checkout
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.smsNotifications}
                        onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Receive SMS notifications
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 ${
                    currentStep >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    3
                  </span>
                  Payment Method
                </h2>
                {currentStep > 3 && (
                  <button 
                    onClick={() => handleStepClick(3)}
                    className="text-orange-500 text-sm hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
              
              {currentStep >= 3 && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Payment options will be displayed here based on your selected payment processor (Stripe, PayPal, etc.)
                  </div>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                currentStep < 3 ? 'Continue' : 'Complete Order'
              )}
            </button>
            <button               className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
 > <a href="/preview">Preview</a> </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Order Summary</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Product */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 border-2  rounded-full"> <img src={a} alt="" /></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="font-medium">${product.price.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-r-md text-sm font-medium hover:bg-gray-200 transition-colors">
                    Add Code
                  </button>
                </div>
              </div>
              
              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>-</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${orderSummary.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkoutship;