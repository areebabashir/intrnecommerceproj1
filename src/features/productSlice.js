import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper functions for localStorage with error handling
const getStoredData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error parsing stored ${key}:`, error);
    return defaultValue;
  }
};

const setStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
  }
};

// Initial state
const initialState = {
  products: [],
  selectedProduct: getStoredData('selectedProduct', null),
  status: 'idle',
  error: null,
  wishlist: getStoredData('wishlistItems', []),
  cart: getStoredData('productCart', []),
  similarProducts: [],
  availableQuantity: 10, // Default quantity
  selectedImageIndex: 0,
  notification: null,
  retryCount: 0,
  categories: {
    bestsellers: [],
    outlet: [],
    newCollection: []
  }
};

// Product data normalization
const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title || product.name || 'Unnamed Product',
  price: product.price || 0,
  description: product.description || 'No description available',
  images: Array.isArray(product.images) 
    ? product.images 
    : product.image 
      ? [product.image] 
      : ['https://via.placeholder.com/400'],
  rating: product.rating?.rate || Math.floor(Math.random() * 2) + 3.5, // 3.5-5.5
  reviewCount: product.rating?.count || Math.floor(Math.random() * 50) + 5,
  category: product.category?.name || product.category || 'Uncategorized',
  specifications: {
    material: product.material || 'Various materials',
    weight: product.weight || 'Varies',
    size: product.size || 'One size',
    quality: 'Premium',
    warranty: product.warranty || '2 years'
  }
});

// Async Thunks
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products?limit=20');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.map(normalizeProduct);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      const product = normalizeProduct(data);
      
      dispatch(setAvailableQuantity(Math.floor(Math.random() * 10) + 1));
      
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  'products/fetchSimilar',
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products/?categoryId=${category.id || 1}&limit=4`
      );
      if (!response.ok) throw new Error('Failed to fetch similar products');
      const data = await response.json();
      return data.map(normalizeProduct);
    } catch (error) {
      console.error('Using fallback similar products');
      return [
        { id: 101, title: "Classic Necklace", price: 299, category: "Jewelry" },
        { id: 102, title: "Silver Ring", price: 199, category: "Jewelry" },
        { id: 103, title: "Gold Bracelet", price: 399, category: "Jewelry" },
        { id: 104, title: "Diamond Earrings", price: 499, category: "Jewelry" }
      ].map(normalizeProduct);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Product actions
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      setStoredData('selectedProduct', action.payload);
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      localStorage.removeItem('selectedProduct');
    },
    setSelectedImageIndex: (state, action) => {
      state.selectedImageIndex = action.payload;
    },
    
    // Wishlist actions
    addToWishlist: (state, action) => {
      if (!state.wishlist.some(item => item.id === action.payload.id)) {
        state.wishlist.push(action.payload);
        setStoredData('wishlistItems', state.wishlist);
        state.notification = `${action.payload.title} added to wishlist!`;
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
      setStoredData('wishlistItems', state.wishlist);
      state.notification = 'Item removed from wishlist';
    },
    toggleWishlist: (state, action) => {
      const index = state.wishlist.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.wishlist.splice(index, 1);
        state.notification = `${action.payload.title} removed from wishlist`;
      } else {
        state.wishlist.push(action.payload);
        state.notification = `${action.payload.title} added to wishlist!`;
      }
      setStoredData('wishlistItems', state.wishlist);
    },
    
    // Cart actions
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        if (existingItem.quantity < state.availableQuantity) {
          existingItem.quantity += 1;
          state.notification = `Increased quantity of ${action.payload.title}`;
        } else {
          state.notification = `Maximum quantity reached for ${action.payload.title}`;
        }
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
        state.notification = `${action.payload.title} added to cart!`;
      }
      setStoredData('productCart', state.cart);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      setStoredData('productCart', state.cart);
      state.notification = 'Item removed from cart';
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter(item => item.id !== id);
          state.notification = 'Item removed from cart';
        } else if (quantity <= state.availableQuantity) {
          item.quantity = quantity;
          state.notification = 'Cart updated';
        } else {
          state.notification = `Maximum quantity is ${state.availableQuantity}`;
        }
      }
      setStoredData('productCart', state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      setStoredData('productCart', []);
    },
    
    // Utility actions
    setAvailableQuantity: (state, action) => {
      state.availableQuantity = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    },
    
    // Categorization
    categorizeProducts: (state) => {
      if (state.products.length > 0) {
        state.categories = {
          bestsellers: [...state.products].sort(() => 0.5 - Math.random()).slice(0, 4),
          outlet: [...state.products]
            .filter(p => p.price < 100)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4),
          newCollection: [...state.products].slice(8, 12)
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        productSlice.caseReducers.categorizeProducts(state);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.products = Array(20).fill().map((_, i) => normalizeProduct({
          id: i + 1,
          title: `Product ${i + 1}`,
          price: Math.floor(Math.random() * 300) + 50,
          category: i % 2 ? 'Jewelry' : 'Accessories'
        }));
        productSlice.caseReducers.categorizeProducts(state);
      })
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
        state.selectedImageIndex = 0;
        setStoredData('selectedProduct', action.payload);
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.retryCount += 1;
        state.selectedProduct = normalizeProduct({
          id: 999,
          title: 'Fallback Product',
          price: 199,
          description: 'This is a fallback product',
          category: 'Jewelry'
        });
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.similarProducts = [
          { id: 101, title: "Classic Necklace", price: 299 },
          { id: 102, title: "Silver Ring", price: 199 },
          { id: 103, title: "Gold Bracelet", price: 399 },
          { id: 104, title: "Diamond Earrings", price: 499 }
        ].map(normalizeProduct);
      });
  }
});

// Action creators
export const { 
  setSelectedProduct,
  clearSelectedProduct,
  setSelectedImageIndex,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setAvailableQuantity,
  setNotification,
  clearNotification,
  incrementRetryCount,
  resetRetryCount,
  categorizeProducts
} = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products?.products || [];
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductStatus = (state) => state.products?.status || 'idle';
export const selectProductError = (state) => state.products?.error ?? null;
export const selectWishlistItems = (state) => state.products.wishlist;
export const selectCartItems = (state) => state.products?.cart || [];
export const selectCategories = (state) => state.products.categories;
export const selectBestsellers = (state) => state.products.categories.bestsellers;
export const selectOutletProducts = (state) => state.products.categories.outlet;
export const selectNewCollection = (state) => state.products.categories.newCollection;
export const selectSimilarProducts = (state) => state.products.similarProducts;
export const selectAvailableQuantity = (state) => state.products.availableQuantity;
export const selectSelectedImageIndex = (state) => state.products.selectedImageIndex;
export const selectNotification = (state) => state.products?.notification || null;
export const selectRetryCount = (state) => state.products.retryCount;

// Derived selectors
export const selectIsInWishlist = (productId) => (state) => 
  state.products.wishlist.some(item => item.id === productId);
export const selectWishlistItemCount = (state) => state.products.wishlist.length;
export const selectCartItemCount = (state) => 
  state.products?.cart?.reduce((total, item) => total + item.quantity, 0) || 0;
export const selectCartTotal = (state) =>
  state.products.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItem = (productId) => (state) =>
  state.products.cart.find(item => item.id === productId);

export default productSlice.reducer;