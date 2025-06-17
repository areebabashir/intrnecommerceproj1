// features/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialFormData = {
  contactInfo: { email: '' },
  shippingInfo: {
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
    smsUpdates: false,
    showAddressLine2: false
  },
  paymentInfo: {
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    sameAsShipping: true
  }
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    // Form data
    formData: initialFormData,
    
    // UI state
    currentStep: 1,
    errors: {},
    loading: false,
    showSuccessDialog: false,
    
    // Sample checkout items (you can remove this if using cart items)
    items: [
      {
        id: 122,
        title: "Chic Transparent Fashion Handbag",
        slug: "chic-transparent-fashion-handbag",
        price: 61,
        description: "Elevate your style with our Chic Transparent Fashion Handbag...",
        category: {
          id: 5,
          name: "Miscellaneous",
          slug: "miscellaneous",
          image: "https://i.imgur.com/BG8J0Fj.jpg",
          creationAt: "2025-06-13T02:51:40.000Z",
          updatedAt: "2025-06-13T02:51:40.000Z"
        },
        images: [
          "https://i.imgur.com/Lqaqz59.jpg",
          "https://i.imgur.com/uSqWK0m.jpg",
          "https://i.imgur.com/atWACf1.jpg"
        ],
        creationAt: "2025-06-13T05:45:34.000Z",
        updatedAt: "2025-06-13T05:45:34.000Z",
        quantity: 1,
        image: "https://i.imgur.com/Lqaqz59.jpg",
        size: "Medium"
      }
    ],
    error: null
  },
  reducers: {
    // Form data actions
    setFormData: (state, action) => {
      const { section, field, value } = action.payload;
      state.formData[section][field] = value;
      
      // Clear error when user types
      if (state.errors[field]) {
        delete state.errors[field];
      }
    },
    
    setFormSection: (state, action) => {
      const { section, data } = action.payload;
      state.formData[section] = { ...state.formData[section], ...data };
    },
    
    // UI state actions
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    
    clearError: (state, action) => {
      const field = action.payload;
      if (state.errors[field]) {
        delete state.errors[field];
      }
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setSuccessDialog: (state, action) => {
      state.showSuccessDialog = action.payload;
    },
    
    // Validation action
    validateStep: (state, action) => {
      const step = action.payload;
      const newErrors = {};
      
      if (step === 1) {
        if (!state.formData.contactInfo.email) {
          newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(state.formData.contactInfo.email)) {
          newErrors.email = 'Invalid email format';
        }
      }

      if (step === 2) {
        if (!state.formData.shippingInfo.firstName) newErrors.firstName = 'First name is required';
        if (!state.formData.shippingInfo.lastName) newErrors.lastName = 'Last name is required';
        if (!state.formData.shippingInfo.streetAddress) newErrors.streetAddress = 'Address is required';
        if (!state.formData.shippingInfo.city) newErrors.city = 'City is required';
        if (!state.formData.shippingInfo.state) newErrors.state = 'State is required';
        if (!state.formData.shippingInfo.zipCode) newErrors.zipCode = 'ZIP code is required';
        if (!state.formData.shippingInfo.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      }

      if (step === 3) {
        if (!state.formData.paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required';
        if (!state.formData.paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!state.formData.paymentInfo.cvv) newErrors.cvv = 'CVV is required';
        if (!state.formData.paymentInfo.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
      }

      state.errors = newErrors;
      return Object.keys(newErrors).length === 0;
    },
    
    // Checkout items actions (if needed)
    addItemToCheckout: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    
    removeItemFromCheckout: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    
    clearCheckout: (state) => {
      state.items = [];
    },
    
    // Reset actions
    clearCheckoutData: (state) => {
      state.formData = initialFormData;
      state.currentStep = 1;
      state.errors = {};
      state.loading = false;
      state.showSuccessDialog = false;
    },
    
    resetForm: (state) => {
      state.formData = initialFormData;
      state.errors = {};
    },
    
    setCheckoutError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Action exports
export const {
  setFormData,
  setFormSection,
  setCurrentStep,
  setErrors,
  clearError,
  setLoading,
  setSuccessDialog,
  validateStep,
  addItemToCheckout,
  removeItemFromCheckout,
  updateItemQuantity,
  clearCheckout,
  clearCheckoutData,
  resetForm,
  setCheckoutError
} = checkoutSlice.actions;

// Selectors
export const selectCheckoutFormData = (state) => state.checkout.formData;
export const selectCheckoutCurrentStep = (state) => state.checkout.currentStep;
export const selectCheckoutErrors = (state) => state.checkout.errors;
export const selectCheckoutLoading = (state) => state.checkout.loading;
export const selectShowSuccessDialog = (state) => state.checkout.showSuccessDialog;
export const selectCheckoutItems = (state) => state.checkout.items;
export const selectCheckoutError = (state) => state.checkout.error;

// Complex selectors
export const selectContactInfo = (state) => state.checkout.formData.contactInfo;
export const selectShippingInfo = (state) => state.checkout.formData.shippingInfo;
export const selectPaymentInfo = (state) => state.checkout.formData.paymentInfo;

export const selectIsStepValid = (step) => (state) => {
  const errors = state.checkout.errors;
  const formData = state.checkout.formData;
  
  if (step === 1) {
    return formData.contactInfo.email && 
           /^\S+@\S+\.\S+$/.test(formData.contactInfo.email) &&
           !errors.email;
  }
  
  if (step === 2) {
    const shipping = formData.shippingInfo;
    return shipping.firstName && shipping.lastName && 
           shipping.streetAddress && shipping.city && 
           shipping.state && shipping.zipCode && 
           shipping.phoneNumber &&
           !errors.firstName && !errors.lastName && 
           !errors.streetAddress && !errors.city && 
           !errors.state && !errors.zipCode && 
           !errors.phoneNumber;
  }
  
  if (step === 3) {
    const payment = formData.paymentInfo;
    return payment.cardNumber && payment.expiryDate && 
           payment.cvv && payment.cardholderName &&
           !errors.cardNumber && !errors.expiryDate && 
           !errors.cvv && !errors.cardholderName;
  }
  
  return false;
};

export const selectCheckoutSummary = (state) => {
  const formData = state.checkout.formData;
  return {
    email: formData.contactInfo.email,
    fullName: `${formData.shippingInfo.firstName} ${formData.shippingInfo.lastName}`,
    address: {
      street: formData.shippingInfo.streetAddress,
      addressLine2: formData.shippingInfo.addressLine2,
      city: formData.shippingInfo.city,
      state: formData.shippingInfo.state,
      zipCode: formData.shippingInfo.zipCode,
      country: formData.shippingInfo.country
    },
    phone: formData.shippingInfo.phoneNumber,
    paymentMethod: formData.paymentInfo.paymentMethod,
    cardLast4: formData.paymentInfo.cardNumber.slice(-4)
  };
};

export default checkoutSlice.reducer;