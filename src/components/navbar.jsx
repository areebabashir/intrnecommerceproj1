import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, User, Menu, X, ShoppingCart } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('productCart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    setCartItemCount(cart.length);
    setWishlistItemCount(wishlist.length);

    // Optional: listen for cart/wishlist updates from other components
    const handleCartUpdate = (e) => {
      const updatedCart = e.detail || [];
      setCartItemCount(updatedCart.length);
      localStorage.setItem('productCart', JSON.stringify(updatedCart));
    };

    const handleWishlistUpdate = (e) => {
      const updatedWishlist = e.detail || [];
      setWishlistItemCount(updatedWishlist.length);
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  return (
    <nav className="bg-stone-200 border">
      <div className="w-full px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-40 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-14 h-20" />
        </Link>

        <div className="hidden md:flex items-center gap-10 font-['Libre_Bodoni'] text-stone-800 text-xl font-medium">
          <Link to="/" className="hover:text-blue-700">Jewelry</Link>
          <Link to="/catogary" className="hover:text-blue-700">Collections</Link>
          <Link to="/outletview" className="hover:text-blue-700">%Outlet</Link>
          <Link to="/production" className="hover:text-blue-700">Our Production</Link>
        </div>

        <div className="hidden md:flex items-center gap-10 text-stone-800">
          <Link to="/wishlist" className="relative">
            <Heart className="w-5 h-5 hover:text-black" />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {wishlistItemCount}
              </span>
            )}
          </Link>
          <Link to="/search"><Search className="w-5 h-5 hover:text-black" /></Link>
          <Link to="/profile"><User className="w-5 h-5 hover:text-black" /></Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 hover:text-black" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-black">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="px-6 pb-4 md:hidden">
          <ul className="flex flex-col gap-4 font-['Libre_Bodoni'] text-stone-800 text-xl font-medium">
            <Link to="/" className="hover:text-blue-700">Jewelry</Link>
            <Link to="/catogary" className="hover:text-blue-700">Collections</Link>
            <Link to="/outletview" className="hover:text-blue-700">%Outlet</Link>
            <Link to="/production" className="hover:text-blue-700">Our Production</Link>
          </ul>
          <div className="flex justify-center gap-10 mt-4 text-stone-800">
            <Link to="/wishlist" className="relative">
              <Heart className="w-5 h-5 hover:text-black" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            <Link to="/search"><Search className="w-5 h-5 hover:text-black" /></Link>
            <Link to="/profile"><User className="w-5 h-5 hover:text-black" /></Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 hover:text-black" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2  text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
