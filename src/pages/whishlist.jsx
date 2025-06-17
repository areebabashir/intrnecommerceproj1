import React, { useEffect } from "react";
import { X, ShoppingCart, Heart, Star } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWishlistItems,
  removeFromWishlist,
  selectWishlistNotification,
  clearNotification,
  selectWishlistCount
} from "../features/wishlistSlice";
import { addToCart } from "../features/cartSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const notification = useSelector(selectWishlistNotification);

  // Clear notification after timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const handleAddToCart = (item) => {
    // Prepare cart item data
    const cartItem = {
      ...item,
      quantity: 1,
      image: item.image || item.images?.[0] || "https://placehold.co/150"
    };

    // Add to cart
    dispatch(addToCart(cartItem));
    
    // Remove from wishlist
    dispatch(removeFromWishlist(item.id));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderCategory = (category) => {
    if (!category) return null;
    return typeof category === "object" ? category.name || category.title : category;
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
          <h1 className="text-3xl font-semibold">My Wishlist ({wishlistCount})</h1>
          {wishlistCount > 0 && (
            <button
              onClick={handleClearWishlist}
              className="px-4 py-2 text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {wishlistCount === 0 ? (
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
                    src={item.image || item.images?.[0] || "https://placehold.co/150x120"}
                    alt={item.name || item.title}
                    className="w-full md:w-32 h-32 md:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg mb-1">
                      {item.name || item.title}
                    </h3>
                    {item.model && (
                      <p className="text-base text-gray-500 mb-2">{item.model}</p>
                    )}
                    {item.category && (
                      <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded mb-2 inline-block">
                        {renderCategory(item.category)}
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
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto">
                  <span className="font-semibold text-xl md:text-2xl text-gray-900 flex-1 md:flex-none">
                    ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
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
                      onClick={() => handleRemoveItem(item.id)}
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

        {wishlistCount > 0 && (
          <div className="mt-8 bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Wishlist Summary</h3>
                <p className="text-gray-600">
                  {wishlistCount} item{wishlistCount !== 1 ? "s" : ""} • Total value: $
                  {wishlistItems
                    .reduce((sum, item) => sum + (typeof item.price === "number" ? item.price : 0), 0)
                    .toFixed(2)}
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