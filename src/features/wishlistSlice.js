import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely handle localStorage
const getStoredWishlist = () => {
  try {
    const stored = localStorage.getItem("wishlistItems");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading wishlist from localStorage:", error);
    return [];
  }
};

const initialState = {
  wishlistItems: getStoredWishlist(),
  notification: ""
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    initializeWishlist: (state) => {
      state.wishlistItems = getStoredWishlist();
    },
    
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existingItem = state.wishlistItems.find(
        (wishlistItem) => wishlistItem.id === item.id
      );
      
      if (!existingItem) {
        state.wishlistItems.push(item);
        localStorage.setItem(
          "wishlistItems",
          JSON.stringify(state.wishlistItems)
        );
        state.notification = `Added ${item.name || item.title} to wishlist!`;
      } else {
        state.notification = `${item.name || item.title} is already in your wishlist!`;
      }
    },
    
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== id
      );
      localStorage.setItem(
        "wishlistItems",
        JSON.stringify(state.wishlistItems)
      );
      state.notification = "Item removed from wishlist!";
    },
    
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem("wishlistItems");
      state.notification = "Wishlist cleared!";
    },
    
    clearNotification: (state) => {
      state.notification = "";
    }
  }
});

// Selectors
export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export const selectWishlistCount = (state) => state.wishlist.wishlistItems.length;
export const selectWishlistNotification = (state) => state.wishlist.notification;

// Actions
export const {
  initializeWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  clearNotification
} = wishlistSlice.actions;

export default wishlistSlice.reducer;