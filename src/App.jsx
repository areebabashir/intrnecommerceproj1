// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store.js';
import ErrorBoundary from './components/ErrorBoundary';

// Component imports
import Layout from './components/Layout.jsx';
import Home from './pages/home.jsx';
import Catogary from './pages/catogry.jsx';
import Product from './pages/Product.jsx';
import Price from './pages/cart.jsx';
import Checkout from './pages/Checkout.jsx';
import CheckoutForm from './pages/Checkout_Auth.jsx';
import Checkoutship from './pages/chechout_ship.jsx';
import Preview from './pages/Preview.jsx';
import Payment from './pages/Checkout_Payment.jsx';
import BestView from './pages/bestview.jsx';
import OutletPage from './pages/outletview.jsx';
import Wishlist from './pages/whishlist.jsx';
import ProductionPage from './pages/Production.jsx';
import ProfilePage from './pages/profile.jsx';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Routes WITH layout (Navbar + Footer) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="catogary" element={<Catogary />} />
              <Route path="product/:id" element={<Product />} />
              <Route path="cart" element={<Price />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="checkoutship" element={<Checkoutship />} />
              <Route path="preview" element={<Preview />} />
              <Route path="payment" element={<Payment />} />
              <Route path="bestview" element={<BestView />} />
              <Route path="outletview" element={<OutletPage />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="production" element={<ProductionPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Routes WITHOUT layout */}
            <Route path="login" element={<CheckoutForm />} />
            
            {/* You can add more layout-less routes as needed */}
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;