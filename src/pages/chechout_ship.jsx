import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Plus, Tag, CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
  applyCoupon,
  removeCoupon,
  clearNotification,
  clearCart
} from '../features/cartSlice';
import {
  setFormData,
  setCurrentStep,
  validateStep,
  selectCheckoutFormData,
  selectCheckoutCurrentStep,
  selectCheckoutErrors,
  clearCheckoutData,
  selectCheckoutLoading,
  setLoading,
  setSuccessDialog,
  selectShowSuccessDialog
} from '../features/checkoutSlice';

const CheckoutPage = () => {
  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Cart state
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartCount);
  const subtotal = useSelector(selectSubtotal);
  const shipping = useSelector(selectShippingCost);
  const discount = useSelector(selectDiscount);
  const tax = useSelector(selectTax);
  const total = useSelector(selectTotal);
  const coupon = useSelector(selectAppliedCoupon);
  const notification = useSelector(selectNotification);
  
  // Checkout state
  const formData = useSelector(selectCheckoutFormData);
  const currentStep = useSelector(selectCheckoutCurrentStep);
  const errors = useSelector(selectCheckoutErrors);
  const isLoading = useSelector(selectCheckoutLoading);
  const showSuccessDialog = useSelector(selectShowSuccessDialog);

  // Local state
  const [couponCode, setCouponCode] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  // Refs for all input fields
  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const countryRef = useRef(null);
  const streetAddressRef = useRef(null);
  const addressLine2Ref = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipCodeRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const cardNumberRef = useRef(null);
  const expiryDateRef = useRef(null);
  const cvvRef = useRef(null);
  const cardholderNameRef = useRef(null);
  const couponInputRef = useRef(null);

  // Map field names to their refs
  const fieldRefs = {
    email: emailRef,
    firstName: firstNameRef,
    lastName: lastNameRef,
    country: countryRef,
    streetAddress: streetAddressRef,
    addressLine2: addressLine2Ref,
    city: cityRef,
    state: stateRef,
    zipCode: zipCodeRef,
    phoneNumber: phoneNumberRef,
    cardNumber: cardNumberRef,
    expiryDate: expiryDateRef,
    cvv: cvvRef,
    cardholderName: cardholderNameRef,
    couponCode: couponInputRef
  };

  // Focus management
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const focusField = (fieldName) => {
    if (fieldName && fieldRefs[fieldName]?.current) {
      fieldRefs[fieldName].current.focus();
    }
  };

  // Save form data
  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  // Handle notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  // Focus the first field when step changes
  useEffect(() => {
    if (currentStep === 1) {
      focusField('email');
    } else if (currentStep === 2) {
      focusField('firstName');
    } else if (currentStep === 3) {
      focusField('cardNumber');
    }
  }, [currentStep]);

  // Maintain focus when clicking outside


  const handleInputChange = (section, field, value) => {
    dispatch(setFormData({ section, field, value }));
  };

  const handleContinue = async () => {
    // Validate current step
    const isValid = dispatch(validateStep(currentStep));
    
    if (!isValid) {
      // Find the first field with an error and focus it
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        focusField(firstErrorField);
      }
      return;
    }

    if (currentStep < 3) {
      dispatch(setCurrentStep(currentStep + 1));
    } else {
      dispatch(setLoading(true));
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Clear cart and form data on success
        dispatch(clearCart());
        dispatch(clearCheckoutData());
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('productCart');
        
        // Show success dialog
        dispatch(setSuccessDialog(true));
      } catch (error) {
        console.error('Checkout error:', error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const closeSuccessDialog = () => {
    dispatch(setSuccessDialog(false));
    navigate('/');
  };

  const InputField = ({ label, section, field, type = 'text', placeholder, required = false, className = '', innerRef }) => (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        ref={innerRef}
        value={formData[section][field] || ''}
        onChange={(e) => handleInputChange(section, field, e.target.value)}
        onFocus={() => handleFocus(field)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
    </div>
  );

  const SelectField = ({ label, section, field, options, required = false, innerRef }) => (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={innerRef}
          value={formData[section][field] || ''}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
          onFocus={() => handleFocus(field)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 w-[80%] ">
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <button
                onClick={closeSuccessDialog}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 w-[80%]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2 ${
                    currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </span>
                  Contact Information
                </h2>
                {currentStep > 1 && (
                  <button 
                    onClick={() => dispatch(setCurrentStep(1))}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <InputField
                  label="Email address"
                  section="contactInfo"
                  field="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  innerRef={emailRef}
                />
              ) : (
                <div className="text-sm bg-gray-50 p-3 rounded">
                  <p><span className="font-medium">Email:</span> {formData.contactInfo.email}</p>
                </div>
              )}
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2 ${
                    currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </span>
                  Shipping Address
                </h2>
                {currentStep > 2 && (
                  <button 
                    onClick={() => dispatch(setCurrentStep(2))}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {currentStep === 2 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="First name"
                      section="shippingInfo"
                      field="firstName"
                      placeholder="John"
                      required
                      innerRef={firstNameRef}
                    />
                    <InputField
                      label="Last name"
                      section="shippingInfo"
                      field="lastName"
                      placeholder="Doe"
                      required
                      innerRef={lastNameRef}
                    />
                  </div>

                  <SelectField
                    label="Country"
                    section="shippingInfo"
                    field="country"
                    options={[
                      { value: 'United States', label: 'United States' },
                      { value: 'Canada', label: 'Canada' },
                      { value: 'United Kingdom', label: 'UK' }
                    ]}
                    required
                    innerRef={countryRef}
                  />

                  <InputField
                    label="Street address"
                    section="shippingInfo"
                    field="streetAddress"
                    placeholder="123 Main St"
                    required
                    innerRef={streetAddressRef}
                  />

                  {formData.shippingInfo.showAddressLine2 ? (
                    <InputField
                      label="Apt, suite, etc. (optional)"
                      section="shippingInfo"
                      field="addressLine2"
                      placeholder="Apt 4B"
                      innerRef={addressLine2Ref}
                    />
                  ) : (
                    <button
                      type="button"
                      className="text-blue-600 text-sm flex items-center mb-4"
                      onClick={() => handleInputChange('shippingInfo', 'showAddressLine2', true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add address line 2
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="City"
                      section="shippingInfo"
                      field="city"
                      placeholder="New York"
                      required
                      innerRef={cityRef}
                    />
                    <SelectField
                      label="State"
                      section="shippingInfo"
                      field="state"
                      options={[
                        { value: '', label: 'Select state' },
                        { value: 'NY', label: 'New York' },
                        { value: 'CA', label: 'California' },
                        { value: 'TX', label: 'Texas' }
                      ]}
                      required
                      innerRef={stateRef}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="ZIP code"
                      section="shippingInfo"
                      field="zipCode"
                      placeholder="10001"
                      required
                      innerRef={zipCodeRef}
                    />
                    <InputField
                      label="Phone number"
                      section="shippingInfo"
                      field="phoneNumber"
                      type="tel"
                      placeholder="(123) 456-7890"
                      required
                      innerRef={phoneNumberRef}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.shippingInfo.saveInfo}
                        onChange={(e) => handleInputChange('shippingInfo', 'saveInfo', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-orange-500 mr-2"
                      />
                      <span className="text-sm">Save this information for next time</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.shippingInfo.smsUpdates}
                        onChange={(e) => handleInputChange('shippingInfo', 'smsUpdates', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm">Get shipping updates via SMS</span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="text-sm bg-gray-50 p-3 rounded space-y-1">
                  <p><span className="font-medium">Name:</span> {formData.shippingInfo.firstName} {formData.shippingInfo.lastName}</p>
                  <p><span className="font-medium">Address:</span> {formData.shippingInfo.streetAddress}</p>
                  {formData.shippingInfo.addressLine2 && <p>{formData.shippingInfo.addressLine2}</p>}
                  <p>{formData.shippingInfo.city}, {formData.shippingInfo.state} {formData.shippingInfo.zipCode}</p>
                  <p><span className="font-medium">Phone:</span> {formData.shippingInfo.phoneNumber}</p>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2 ${
                    currentStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </span>
                  Payment Method
                </h2>
              </div>

              {currentStep === 3 && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-sm font-medium">Credit Card</span>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-orange-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                        <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center">MC</div>
                        <div className="w-8 h-5 bg-orange-800 rounded text-white text-xs flex items-center justify-center">AMEX</div>
                      </div>
                    </div>

                    <InputField
                      label="Card number"
                      section="paymentInfo"
                      field="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      required
                      innerRef={cardNumberRef}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <InputField
                        label="Expiration date"
                        section="paymentInfo"
                        field="expiryDate"
                        placeholder="MM/YY"
                        required
                        innerRef={expiryDateRef}
                      />
                      <InputField
                        label="CVV"
                        section="paymentInfo"
                        field="cvv"
                        type="text"
                        placeholder="123"
                        required
                        innerRef={cvvRef}
                      />
                    </div>

                    <InputField
                      label="Cardholder name"
                      section="paymentInfo"
                      field="cardholderName"
                      placeholder="John Doe"
                      required
                      innerRef={cardholderNameRef}
                    />

                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.paymentInfo.sameAsShipping}
                          onChange={(e) => handleInputChange('paymentInfo', 'sameAsShipping', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm">Billing address is same as shipping</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Navigation */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : currentStep < 3 ? (
                  'Continue to shipping'
                ) : (
                  'Complete order'
                )}
              </button>

              {currentStep > 1 && (
                <button
                  onClick={() => dispatch(setCurrentStep(currentStep - 1))}
                  className="w-full bg-orange border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md font-medium"
                >
                  Back
                </button>
              )}
              <Link to="/preview">
                <button className="w-full bg-orange border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md font-medium">
                  Preview
                </button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="mb-6 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-start py-3 border-b">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.images || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
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
                      onClick={() => dispatch(removeCoupon())}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      ref={couponInputRef}
                      onFocus={() => handleFocus('couponCode')}
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => dispatch(applyCoupon(couponCode))}
                      disabled={!couponCode.trim()}
                      className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
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
      </main>
    </div>
  );
};

export default CheckoutPage;