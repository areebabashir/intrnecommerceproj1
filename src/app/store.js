import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice.js";
import wishlistReducer from "../features/wishlistSlice.js";
import productReducer from "../features/productSlice.js"; 
import checkoutReducer from "../features/checkoutSlice.js";

// Create store
const appStore = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    checkout: checkoutReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.timestamp'],
        ignoredPaths: ['items.dates']
      }
    })
});

// LocalStorage persistence
const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('reduxState', JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save state to localStorage", e);
  }
};

appStore.subscribe(() => {
  saveToLocalStorage(appStore.getState());
});

// Export as both named and default
export const store = appStore;
export default appStore;