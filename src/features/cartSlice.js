import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely get cart from localStorage
const getInitialCart = () => {
  try {
    const cart = localStorage.getItem("productCart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error parsing cart from localStorage", error);
    return [];
  }
};

const initialState = {
  items: getInitialCart(),
  appliedCoupon: null,
  notification: null,
  coupons: {
    'SAVE10': { discount: 0.10, type: 'percentage', minOrder: 50, description: '10% off' },
    'FLAT50': { discount: 50, type: 'flat', minOrder: 100, description: '$50 off' },
    'WELCOME': { discount: 0.15, type: 'percentage', minOrder: 0, description: '15% off for new customers' }
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Initialize cart from localStorage
    initializeCart: (state) => {
      state.items = getInitialCart();
    },
    
    // Add item to cart or increment quantity
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ 
          ...action.payload, 
          quantity: 1,
          addedAt: new Date().toISOString() // Track when item was added
        });
      }
      
      localStorage.setItem("productCart", JSON.stringify(state.items));
      state.notification = `${action.payload.title} added to cart`;
    },
    
    // Update item quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
          state.notification = 'Item removed from cart';
        } else {
          item.quantity = quantity;
          state.notification = 'Quantity updated';
        }
        localStorage.setItem("productCart", JSON.stringify(state.items));
      }
    },
    
    // Remove item from cart
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("productCart", JSON.stringify(state.items));
      state.notification = 'Item removed from cart';
    },
    
    // Apply coupon code
    applyCoupon: (state, action) => {
      const code = action.payload.toUpperCase();
      const coupon = state.coupons[code];
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      if (!coupon) {
        state.notification = 'Invalid coupon code';
        return;
      }

      if (subtotal < coupon.minOrder) {
        state.notification = `Minimum order of $${coupon.minOrder} required`;
        return;
      }

      state.appliedCoupon = { 
        code, 
        ...coupon,
        appliedAt: new Date().toISOString() 
      };
      state.notification = `Coupon "${code}" applied! ${coupon.description}`;
    },
    
    // Remove applied coupon
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.notification = 'Coupon removed';
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.items = [];
  state.count = 0;
  state.subtotal = 0;
  state.shippingCost = 0;
  state.discount = 0;
  state.tax = 0;
  state.total = 0;
  state.appliedCoupon = null;
  localStorage.removeItem('cart');
    },
    
    // Clear current notification
    clearNotification: (state) => {
      state.notification = null;
    },
    
    // Save cart for checkout process
    prepareCheckout: (state) => {
      localStorage.setItem("checkoutItems", JSON.stringify(state.items));
      state.notification = 'Proceeding to checkout';
    }
  }
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectSubtotal = (state) => 
  state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
export const selectShippingCost = (state) => 
  selectSubtotal(state) > 100 ? 0 : 15;
export const selectDiscount = (state) => {
  if (!state.cart.appliedCoupon) return 0;
  
  const subtotal = selectSubtotal(state);
  const coupon = state.cart.appliedCoupon;
  
  return coupon.type === 'percentage' 
    ? subtotal * coupon.discount 
    : Math.min(coupon.discount, subtotal);
};
export const selectTax = (state) => 
  (selectSubtotal(state) - selectDiscount(state)) * 0.08;
export const selectTotal = (state) => 
  selectSubtotal(state) + selectShippingCost(state) - selectDiscount(state) + selectTax(state);
export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;
export const selectNotification = (state) => state.cart.notification;
export const selectCouponCodes = (state) => Object.keys(state.cart.coupons);
export const selectIsItemInCart = (id) => (state) => 
  state.cart.items.some(item => item.id === id);

export const { 
  initializeCart,
  addToCart,
  updateQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
  clearNotification,
  prepareCheckout
} = cartSlice.actions;

export default cartSlice.reducer;