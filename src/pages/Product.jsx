import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, Share2, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/cards.jsx';

const Product = ({ productId, onProductChange }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  // Stable fetch function with retry logic
const fetchProduct = useCallback(async (id, retry = 0) => {
  try {
    setLoading(true);
    setError(null);

    // ✅ Load from 'selectedProduct' in localStorage
    const cached = localStorage.getItem('selectedProduct');
    console.log('Cached product:', cached);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.id == id || parsed._id == id) {
        setProduct(parsed);
        setLoading(false);
        return;
      }
    }

    // 🌐 Try multiple API endpoints
    const endpoints = [
      `https://api.escuelajs.co/api/v1/products/${id}`,
      `https://fakestoreapi.com/products/${id}`,
      `https://jsonplaceholder.typicode.com/posts/${id}`
    ];

    let data = null;
    let success = false;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          data = await response.json();
          success = true;
          break;
        }
      } catch (fetchError) {
        console.warn(`Failed to fetch from ${endpoint}:`, fetchError);
        continue;
      }
    }

    if (!success) throw new Error('All API endpoints failed');

    const transformedProduct = transformProductData(data);
    setProduct(transformedProduct);

    // 💾 Optional: Update localStorage for next time
    localStorage.setItem('selectedProduct', JSON.stringify(transformedProduct));
    setRetryCount(0);
  } catch (err) {
    console.error('Error fetching product:', err);

    if (retry < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchProduct(id, retry + 1);
      }, Math.pow(2, retry) * 1000);
      return;
    }

    setError(err.message);
    const fallback = getFallbackProduct(id);
    setProduct(fallback);
  } finally {
    setLoading(false);
  }
}, []);


  // Transform API data to consistent format
  const transformProductData = (data) => {
    // Handle different API response structures
    if (data.title || data.name) {
      // E-commerce API format
      return {
        id: data.id,
        name: data.title || data.name,
        price: data.price || 99,
        images: Array.isArray(data.images) && data.images.length > 0 
          ? data.images 
          : data.image 
          ? [data.image]
          : ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"],
        description: data.description || "Premium product with excellent quality and craftsmanship. Perfect combination of elegance and style. Comes with warranty and certificate of authenticity.",
        specifications: {
          material: data.category?.name || data.category || "Premium Material",
          weight: "Standard",
          size: "Universal",
          quality: "Premium",
          category: data.category?.name || data.category || "General",
          warranty: "2 years warranty included"
        },
        rating: data.rating?.rate || 4.5,
        reviewCount: data.rating?.count || Math.floor(Math.random() * 20) + 5
      };
    } else {
      // JSONPlaceholder format (fallback)
      return {
        id: data.id,
        name: data.title,
        price: 99,
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"],
        description: data.body || "Premium product with excellent quality and craftsmanship.",
        specifications: {
          material: "Premium Material",
          weight: "Standard",
          size: "Universal",
          quality: "Premium",
          category: "General",
          warranty: "2 years warranty included"
        },
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 20) + 5
      };
    }
  };

  // Fetch single product with proper dependency management
  useEffect(() => {
    const id = productId;
    fetchProduct(id);
  }, [productId, fetchProduct]); // Only re-run if productId changes

  // Fetch similar products with error handling
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const endpoints = [
          'https://api.escuelajs.co/api/v1/products?limit=3&offset=10',
          'https://fakestoreapi.com/products?limit=3'
        ];
        
        let data = [];
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint);
            if (response.ok) {
              data = await response.json();
              break;
            }
          } catch (fetchError) {
            continue;
          }
        }
        
        setSimilarProducts(data.slice(0, 3)); // Ensure max 3 products
      } catch (err) {
        console.error('Error fetching similar products:', err);
        setSimilarProducts([]); // Set empty array on error
      }
    };

    fetchSimilarProducts();
  }, []); // Only run once

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

  // Load cart and wishlist from memory on component mount
  useEffect(() => {
    const savedWishlist = window.productWishlist || [];
    setWishlist(savedWishlist);
  }, []);

  // Save to global state
  const saveToGlobalState = (key, data) => {
    window[key] = data;
  };

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

  // Handle add/remove wishlist
const toggleWishlist = () => {
  if (!product) return;

  let updatedWishlist;
  if (wishlist.some(item => item.id === product.id)) {
    updatedWishlist = wishlist.filter(item => item.id !== product.id);
    setNotification('Removed from wishlist!');
  } else {
    updatedWishlist = [...wishlist, product];
    setNotification('Added to wishlist!');
  }

  setWishlist(updatedWishlist);

  // ✅ Save to global variable
  window.productWishlist = updatedWishlist;

  // ✅ Save to localStorage
  localStorage.setItem('productWishlist', JSON.stringify(updatedWishlist));

  // ✅ Dispatch event (optional, in case another component listens)
  window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: updatedWishlist }));

  setTimeout(() => setNotification(''), 2000);
};


  // Handle add to cart
  const [availableQty, setAvailableQty] = useState(Math.floor(Math.random() * 10) + 1);
const [cartQty, setCartQty] = useState(0);

const addToCart = () => {
  if (!product) return;

  // Get the current cart from global or fallback to empty array
  const currentCart = window.productCart || [];
  const existingItem = currentCart.find(item => item.id === product.id);

  let updatedCart;

  if (existingItem) {
    // Check if adding one more exceeds available quantity
    if (existingItem.quantity < availableQty) {
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setNotification('Quantity updated in cart!');
      setCartQty(prev => prev + 1);
    } else {
      setNotification('Cannot add more. Stock limit reached!');
    }
  } else {
    // Add new item if availableQty is at least 1
    if (availableQty > 0) {
            setAvailableQty(prev => prev - 1); // Decrease available quantity

      const cartItem = {
        ...product,
        quantity: 1,
        image: product.images[0]
      };
      updatedCart = [...currentCart, cartItem];
      setNotification('Successfully added to cart!');
      setCartQty(1);
    } else {
      setNotification('Out of stock!');
      return;
    }
  }

  // Save updated cart if it changed
  if (updatedCart) {
    window.productCart = updatedCart;
    localStorage.setItem('productCart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart }));
  }

  // Clear notification after 3 seconds
  setTimeout(() => setNotification(''), 3000);
};

  // Handle similar product click
  const handleSimilarProductClick = (clickedProduct) => {
    const transformedProduct = transformProductData(clickedProduct);
    setProduct(transformedProduct);
    setSelectedImage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manual retry function
  const handleRetry = () => {
    setRetryCount(0);
    const id = productId || 1;
    fetchProduct(id);
  };

  // Handle back navigation
  const handleBackClick = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-stone-800 font-['Mulish']">Loading product details...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-600 mt-2">Retry attempt: {retryCount}/2</p>
          )}
        </div>
      </div>
    );
  }

  if (error && !product) {
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
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gray-600 text-white px-6 py-2 rounded font-['Mulish']"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isInWishlist = product && wishlist.some(item => item.id === product.id);

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Back Button with Icon - No borders */}
      <div className="p-6 pb-0">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Error notification for API issues */}
      {error && product && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 mx-6">
          <p className="font-bold">Warning</p>
          <p>Some data may be incomplete due to API issues. Using fallback data.</p>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}

      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* Product Images */}
        <div className="lg:w-1/2">
        {product?.images && product.images.length > 0 && ( <img
            src={product?.images[selectedImage] || product?.images[0]}
            alt={product?.name || 'Product'}
            className="w-full h-96 lg:h-[500px] object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop";
            }}
          />)}
         
           {product?.imageSrc &&  ( <img
            src={product?.imageSrc }
            alt={product?.name || 'Product'}
            className="w-full h-96 lg:h-[500px] object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop";
            }}
          />)}
          {/* Thumbnail Images */}
          {product?.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop";
                  }}
                />
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

          <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product?.title
 || 'Product Name'}</h1>
           <p className="text-sm text-gray-700 mt-1">
  <strong>Available Quantity:</strong> {availableQty}
</p>
          <div className="text-3xl font-bold text-orange-600 mb-6">${product?.price || 299}</div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={addToCart}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              className={`px-4 py-3 border rounded-lg hover:bg-gray-50 border-gray-300 transition-colors ${
                isInWishlist ? 'text-red-500 bg-red-50' : ''
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart className="w-5 h-5" fill={isInWishlist ? 'red' : 'none'} />
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
          <h3 className=" font-semi-bold mb-3">description:</h3>
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
          <button className="text-orange-500 text-sm">View all →</button>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <div
                key={similarProduct.id}
                onClick={() => handleSimilarProductClick(similarProduct)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
              >
                <ProductCard
                  imageSrc={similarProduct.images?.[0] || similarProduct.image || "https://placehold.co/320x334"}
                  altText={similarProduct.title || similarProduct.name}
                  tags={[{ label: 'similar', bgColorClass: 'bg-blue-600' }]}
                  title={similarProduct.title || similarProduct.name}
                  price={similarProduct.price?.toString() || "0"}
                />
              </div>
            ))
          ) : (
            // Fallback products if API fails
            <>
              <ProductCard
                imageSrc="https://placehold.co/320x334"
                altText="Necklace"
                tags={[{ label: 'bestseller', bgColorClass: 'bg-pink-700' }, { label: 'sale', bgColorClass: 'bg-orange-600' }]}
                title="Necklace"
                oldPrice="2,350"
                price="1,432"
              />
              <ProductCard
                imageSrc="https://placehold.co/320x334"
                altText="Necklace"
                tags={[{ label: 'bestseller', bgColorClass: 'bg-pink-700' }]}
                title="Necklace"
                price="2,445"
              />
              <ProductCard
                imageSrc="https://placehold.co/320x334"
                altText="Ring"
                tags={[{ label: 'bestseller', bgColorClass: 'bg-pink-700' }]}
                title="Ring"
                price="489"
              />
            </>
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