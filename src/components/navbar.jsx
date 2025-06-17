import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Menu, X, ShoppingCart } from 'lucide-react';
import logo from '../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectNotification, 
  clearNotification,
  selectCartItemCount,
  selectWishlistItemCount,
  toggleWishlist,
  selectWishlistItems
} from '../features/productSlice';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();
  
  // Get counts and items from Redux store
  const cartItemCount = useSelector(selectCartItemCount);
  const wishlistItemCount = useSelector(selectWishlistItemCount);
  const wishlistItems = useSelector(selectWishlistItems);
  const notification = useSelector(selectNotification);

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    // Redirect to wishlist page instead of toggling here
    // Actual toggling would be done on product pages
    window.location.href = '/wishlist';
  };

  // Handle notification display and auto-dismiss
  useEffect(() => {
    if (notification) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('nav')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {notification}
        </div>
      )}

      <nav className="bg-stone-200 border sticky top-0 z-40">
        <div className="w-full px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-40 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Logo" className="w-14 h-20" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 font-['Libre_Bodoni'] text-stone-800 text-xl font-medium">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>Jewelry</NavLink>
            <NavLink to="/catogary" onClick={() => setMenuOpen(false)}>Collections</NavLink>
            <NavLink to="/outletview" onClick={() => setMenuOpen(false)}>%Outlet</NavLink>
            <NavLink to="/production" onClick={() => setMenuOpen(false)}>Our Production</NavLink>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-10 text-stone-800">
            <WishlistLink  
              count={wishlistItemCount} 
              onClick={handleWishlistToggle}
            />
            <NavIcon to="/profile">
              <User className="w-5 h-5 hover:text-black" />
            </NavIcon>
            <CartLink count={cartItemCount} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }} 
              className="text-gray-700 hover:text-black"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="px-6 pb-4 md:hidden bg-stone-200">
            <ul className="flex flex-col gap-4 font-['Libre_Bodoni'] text-stone-800 text-xl font-medium">
              <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>Jewelry</MobileNavLink>
              <MobileNavLink to="/catogary" onClick={() => setMenuOpen(false)}>Collections</MobileNavLink>
              <MobileNavLink to="/outletview" onClick={() => setMenuOpen(false)}>%Outlet</MobileNavLink>
              <MobileNavLink to="/production" onClick={() => setMenuOpen(false)}>Our Production</MobileNavLink>
            </ul>
            <div className="flex justify-center gap-10 mt-4 text-stone-800">
              <WishlistLink 
                count={wishlistItemCount} 
                onClick={(e) => {
                  handleWishlistToggle(e);
                  setMenuOpen(false);
                }}
                mobile
              />
              <MobileNavIcon to="/profile">
                <User className="w-5 h-5 hover:text-black" />
              </MobileNavIcon>
              <CartLink 
                count={cartItemCount} 
                onClick={() => setMenuOpen(false)}
                mobile
              />
            </div>
          </div>
        )}
      </nav>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          10% { opacity: 1; transform: translateY(0) translateX(-50%); }
          90% { opacity: 1; transform: translateY(0) translateX(-50%); }
          100% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}

// Reusable component for desktop nav links
const NavLink = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="hover:text-blue-700 transition-colors"
  >
    {children}
  </Link>
);

// Reusable component for mobile nav links
const MobileNavLink = ({ to, onClick, children }) => (
  <li>
    <Link 
      to={to} 
      onClick={onClick}
      className="hover:text-blue-700 block py-2"
    >
      {children}
    </Link>
  </li>
);

// Reusable component for icons
const NavIcon = ({ to, children }) => (
  <Link to={to} className="hover:text-black transition-colors">
    {children}
  </Link>
);

const MobileNavIcon = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="hover:text-black transition-colors"
  >
    {children}
  </Link>
);

// Wishlist link with counter
const WishlistLink = ({ count, onClick, mobile = false }) => (
  <div className={`relative ${mobile ? '' : 'hover:text-black'}`}>
    <Link to="/wishlist" onClick={onClick} className="flex items-center">
      <Heart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </Link>
  </div>
);

// Cart link with counter
const CartLink = ({ count, onClick, mobile = false }) => (
  <div className={`relative ${mobile ? '' : 'hover:text-black'}`}>
    <Link 
      to="/cart" 
      onClick={onClick}
      className="flex items-center"
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </Link>
  </div>
);