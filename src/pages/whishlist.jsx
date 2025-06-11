import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [notification, setNotification] = useState('');

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = getWishlistFromStorage();
    setWishlistItems(savedWishlist);

    const handleWishlistUpdate = (event) => {
      setWishlistItems(event.detail);
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const getWishlistFromStorage = () => {
    try {
      const stored = localStorage.getItem('productWishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return [];
    }
  };

  const saveToGlobalState = (key, data) => {
    if (key === 'productWishlist') {
      localStorage.setItem('productWishlist', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: data }));
    }
  };

  const handleAddToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem('productCart') || '[]');
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setNotification(`Quantity updated for ${item.name} in cart!`);
    } else {
      const cartItem = {
        ...item,
        quantity: 1,
        image: item.image || item.images?.[0]
      };
      updatedCart = [...currentCart, cartItem];
      setNotification(`Added ${item.name} to cart!`);
    }

    localStorage.setItem('productCart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart }));

    setTimeout(() => setNotification(''), 3000);
  };

  const removeItem = (id) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updatedWishlist);
    saveToGlobalState('productWishlist', updatedWishlist);
    setNotification('Item removed from wishlist!');
    setTimeout(() => setNotification(''), 2000);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    saveToGlobalState('productWishlist', []);
    setNotification('Wishlist cleared!');
    setTimeout(() => setNotification(''), 2000);
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">My Wishlist ({wishlistItems.length})</h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Start adding items you love to your wishlist</p>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 flex-1">
                  <img
                    src={item.image || item.images?.[0] || 'https://placehold.co/150x120'}
                    alt={item.name}
                    className="w-full md:w-32 h-32 md:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{item.name}</h3>
                    {item.model && (
                      <p className="text-base text-gray-500 mb-2">{item.model}</p>
                    )}
                    {item.category && (
                      <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded mb-2 inline-block">
                        {item.category}
                      </span>
                    )}
                    {item.rating && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {renderStars(item.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({item.rating})
                          {item.reviewCount && ` • ${item.reviewCount} reviews`}
                        </span>
                      </div>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto">
                  <span className="font-semibold text-xl md:text-2xl text-gray-900 flex-1 md:flex-none">
                    ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from wishlist"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Wishlist Summary</h3>
                <p className="text-gray-600">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} •
                  Total value: ${wishlistItems.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0), 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => wishlistItems.forEach(item => handleAddToCart(item))}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
