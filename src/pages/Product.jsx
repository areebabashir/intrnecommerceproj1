import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Share2, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/cards.jsx';
import {
  fetchProduct,
  fetchSimilarProducts,
  setSelectedImageIndex,
  toggleWishlist,
  addToCart,
  clearNotification,
  selectSelectedProduct,
  selectProductStatus,
  selectProductError,
  selectSimilarProducts,
  selectAvailableQuantity,
  selectSelectedImageIndex,
  selectRetryCount,
  selectIsInWishlist,
  selectCartItemCount
} from '../features/productSlice';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux selectors
  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  const similarProducts = useSelector(selectSimilarProducts);
  const availableQuantity = useSelector(selectAvailableQuantity);
  const selectedImageIndex = useSelector(selectSelectedImageIndex);
  const retryCount = useSelector(selectRetryCount);
  const isInWishlist = useSelector(selectIsInWishlist(product?.id));
  const cartItemCount = useSelector(selectCartItemCount);

  // Local state
  const [cartAnimation, setCartAnimation] = useState(false);
  const [wishlistAnimation, setWishlistAnimation] = useState(false);

  // Computed values
  const loading = status === 'loading';
  const hasError = status === 'failed';

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "LIZA",
      date: "11.10.23",
      rating: 5,
      text: "The overall experience was very positive. Very great quality, good packaging without damage. The product exceeded my expectations and arrived on time without any issues."
    },
    {
      id: 2,
      name: "BILL",
      date: "11.10.23",
      rating: 4,
      text: "Friendly customer service, patient with all my questions. Very accommodating and understanding. Great product quality and fast delivery."
    },
    {
      id: 3,
      name: "JOHN",
      date: "11.10.23",
      rating: 5,
      text: "They were very helpful explaining the purchase process. When I received my order I was blown away. Excellent quality, just as good as expected."
    }
  ];

  // Fetch product data when component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
    return () => {
      dispatch(clearNotification());
    };
  }, [id, dispatch]);

  // Fetch similar products when product changes
  useEffect(() => {
    if (product?.category) {
      dispatch(fetchSimilarProducts(product.category));
    }
  }, [product?.category, dispatch]);

  // Helper function to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Handle image selection
  const handleImageSelect = (index) => {
    dispatch(setSelectedImageIndex(index));
  };

  // Handle wishlist toggle with animation
  const handleToggleWishlist = () => {
    if (product) {
      dispatch(toggleWishlist(product));
      setWishlistAnimation(true);
      setTimeout(() => setWishlistAnimation(false), 1000);
      
      // Dispatch event to update other components
      const event = new CustomEvent('wishlistUpdated');
      window.dispatchEvent(event);
    }
  };

  // Handle add to cart with animation
 const handleAddToCart = () => {
  if (product && availableQuantity > 0) {
    dispatch(addToCart(product));
    setCartAnimation(true);
    setTimeout(() => setCartAnimation(false), 1000);
    
    // Dispatch event to update other components
    const event = new CustomEvent('cartUpdated', { 
      detail: [...cart, product] // Make sure you have access to current cart
    });
    window.dispatchEvent(event);
  }
};
  // Handle similar product click
  const handleSimilarProductClick = (clickedProduct) => {
    navigate(`/product/${clickedProduct.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle manual retry
  const handleRetry = () => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate(-1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-stone-800 font-['Mulish']">Loading product details...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-600 mt-2">Retry attempt: {retryCount}/3</p>
          )}
        </div>
      </div>
    );
  }

  // Error state without product
  if (hasError && !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-['Mulish'] mb-4">
            Failed to load product: {error}
          </p>
          <div className="space-x-4">
            <button 
              onClick={handleRetry}
              className="bg-orange-600 text-white px-6 py-2 rounded font-['Mulish']"
              disabled={retryCount >= 3}
            >
              {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="bg-gray-600 text-white px-6 py-2 rounded font-['Mulish']"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Back Button */}
      <div className="p-6 pb-0">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

  

      {/* Error notification for API issues */}
      {hasError && product && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 mx-6">
          <p className="font-bold">Warning</p>
          <p>Some data may be incomplete due to API issues. Using fallback data.</p>
        </div>
      )}

      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* Product Images */}
        <div className="lg:w-1/2">
          {/* Main Image */}
          {product?.images && product.images.length > 0 && (
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product?.title || 'Product'}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop";
              }}
            />
          )}
          
          {/* Thumbnail Images */}
          {product?.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`flex-shrink-0 focus:outline-none ${selectedImageIndex === index ? 'ring-2 ring-orange-500' : ''}`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-20 h-20 object-cover rounded border-2 border-transparent"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {renderStars(Math.floor(product?.rating || 4.5))}
            </div>
            <span className="text-sm text-gray-600">
              {product?.rating || 4.5} ({product?.reviewCount || 15} reviews)
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-4">
            {product?.title || 'Product Name'}
          </h1>
          
          <p className="text-sm text-gray-700 mt-1">
            <strong>Available Quantity:</strong> {availableQuantity}
          </p>
          
          <div className="text-3xl font-bold text-orange-600 mb-6">
            ${product?.price || 299}
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className={`flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors relative overflow-hidden ${
                availableQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={availableQuantity === 0}
              aria-label="Add to cart"
            >
              {availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              {cartAnimation && (
                <span className="absolute inset-0 flex items-center justify-center bg-green-500 animate-ping opacity-75"></span>
              )}
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`px-4 py-3 border rounded-lg hover:bg-gray-50 border-gray-300 transition-colors relative ${
                isInWishlist ? 'text-red-500 bg-red-50' : ''
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                className={`w-5 h-5 ${wishlistAnimation ? 'animate-ping' : ''}`} 
                fill={isInWishlist ? 'currentColor' : 'none'} 
              />
            </button>
            <button 
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Share this product"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-gray-600">✓ Free shipping</p>
            <p className="text-gray-600">✓ Money-back guarantee</p>
            <p className="text-gray-600">✓ Secure checkout</p>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-6 space-y-8">
        <div>
          <h3 className="font-semibold mb-3">About this Product</h3>
          <div className="text-sm space-y-1 text-gray-600">
            <p>Material: {product?.specifications?.material || 'Premium Material'}</p>
            <p>Weight: {product?.specifications?.weight || 'Standard'}</p>
            <p>Size: {product?.specifications?.size || 'Universal'}</p>
            <p>Quality: {product?.specifications?.quality || 'Premium'}</p>
            <p>Category: {product?.specifications?.category || 'General'}</p>
            <p>Warranty: {product?.specifications?.warranty || '2 years warranty included'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Description:</h3>
          <p className="text-sm text-gray-600">
            {product?.description || 'Premium product with excellent quality and craftsmanship.'}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Policy</h3>
          <div className="text-sm space-y-1 text-gray-600">
            <p>• Free shipping within 3-5 days</p>
            <p>• 30 days return policy</p>
            <p>• Warranty available for 2 years</p>
            <p>• Certificate of authenticity included</p>
            <p>• Free resizing within 30 days</p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="px-6 pt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Similar Products</h2>
          <button 
            className="text-orange-500 text-sm hover:text-orange-600"
            onClick={() => navigate('/collections')}
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <div
                key={similarProduct.id}
                onClick={() => handleSimilarProductClick(similarProduct)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                aria-label={`View ${similarProduct.title}`}
              >
                <ProductCard
                  imageSrc={similarProduct.images?.[0] || "https://placehold.co/320x334"}
                  altText={similarProduct.title}
                  tags={[{ label: 'similar', bgColorClass: 'bg-blue-600' }]}
                  title={similarProduct.title}
                  price={similarProduct.price?.toString() || "0"}
                />
              </div>
            ))
          ) : (
            // Fallback products if API fails
            [1, 2, 3, 4].map((i) => (
              <ProductCard
                key={i}
                imageSrc="https://placehold.co/320x334"
                altText={`Product ${i}`}
                tags={[{ label: 'bestseller', bgColorClass: 'bg-pink-700' }]}
                title={`Product ${i}`}
                price={(100 * i).toString()}
              />
            ))
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="p-6 mt-10 mb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="pb-6 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="font-bold text-gray-900 uppercase text-sm">
                    {review.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm italic">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;