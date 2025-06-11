import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronDown, Star, User, Heart, ShoppingCart, ArrowLeft, Plus, Minus, Share2, Shield, Truck, RefreshCw } from 'lucide-react';

// Router simulation for demo purposes
const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [productId, setProductId] = useState(null);
  
  const navigate = (path, id = null) => {
    setCurrentRoute(path);
    setProductId(id);
  };
  
  return { currentRoute, productId, navigate };
};

const ProductPage = ({ productId, onBack, products }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (productId && products.length > 0) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [productId, products]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 text-lg font-['Mulish']">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors duration-200 font-['Mulish']"
          >
            <ArrowLeft size={20} />
            Back to Catalog
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200">
              <img
                src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? 'border-orange-600 ring-2 ring-orange-600/20'
                      : 'border-stone-200 hover:border-orange-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full font-['Mulish']">
                {product.category.name}
              </span>
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-4xl font-bold text-stone-800 mb-3 font-['Libre_Bodoni']">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < 4 ? 'text-orange-600 fill-current' : 'text-stone-300'}
                    />
                  ))}
                </div>
                <span className="text-stone-600 font-['Mulish']">(4.0) • 127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-stone-800 font-['Libre_Bodoni']">
                ${product.price}
              </span>
              <span className="text-xl text-stone-500 line-through font-['Mulish']">
                ${Math.round(product.price * 1.3)}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded font-['Mulish']">
                23% OFF
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-stone-700 font-semibold font-['Mulish']">Quantity:</span>
              <div className="flex items-center border border-stone-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-stone-50 transition-colors duration-200"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-semibold font-['Mulish']">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-stone-50 transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-['Mulish']">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200">
                <Heart size={20} />
              </button>
              <button className="p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200">
                <Share2 size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-stone-200">
              <div className="text-center">
                <Truck className="mx-auto text-orange-600 mb-2" size={24} />
                <p className="text-sm font-semibold font-['Mulish']">Free Shipping</p>
                <p className="text-xs text-stone-500 font-['Mulish']">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto text-orange-600 mb-2" size={24} />
                <p className="text-sm font-semibold font-['Mulish']">2 Year Warranty</p>
                <p className="text-xs text-stone-500 font-['Mulish']">Full coverage</p>
              </div>
              <div className="text-center">
                <RefreshCw className="mx-auto text-orange-600 mb-2" size={24} />
                <p className="text-sm font-semibold font-['Mulish']">Easy Returns</p>
                <p className="text-xs text-stone-500 font-['Mulish']">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-stone-200">
            <nav className="flex gap-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-semibold capitalize transition-colors duration-200 font-['Mulish'] ${
                    activeTab === tab
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-stone-600 hover:text-stone-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-stone-700 leading-relaxed font-['Mulish'] text-lg">
                  {product.description}
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 font-['Libre_Bodoni']">Key Features</h3>
                    <ul className="space-y-2 text-stone-600 font-['Mulish']">
                      <li>• Premium quality materials</li>
                      <li>• Durable construction</li>
                      <li>• Modern design aesthetic</li>
                      <li>• Easy to use and maintain</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 font-['Libre_Bodoni']">What's Included</h3>
                    <ul className="space-y-2 text-stone-600 font-['Mulish']">
                      <li>• 1x {product.title}</li>
                      <li>• User manual</li>
                      <li>• Warranty card</li>
                      <li>• Original packaging</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 font-['Libre_Bodoni']">Technical Specifications</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between border-b border-stone-100 pb-2">
                      <dt className="font-semibold text-stone-700 font-['Mulish']">Brand:</dt>
                      <dd className="text-stone-600 font-['Mulish']">{product.category.name}</dd>
                    </div>
                    <div className="flex justify-between border-b border-stone-100 pb-2">
                      <dt className="font-semibold text-stone-700 font-['Mulish']">Model:</dt>
                      <dd className="text-stone-600 font-['Mulish']">#{product.id}</dd>
                    </div>
                    <div className="flex justify-between border-b border-stone-100 pb-2">
                      <dt className="font-semibold text-stone-700 font-['Mulish']">Weight:</dt>
                      <dd className="text-stone-600 font-['Mulish']">2.5 lbs</dd>
                    </div>
                    <div className="flex justify-between border-b border-stone-100 pb-2">
                      <dt className="font-semibold text-stone-700 font-['Mulish']">Dimensions:</dt>
                      <dd className="text-stone-600 font-['Mulish']">10" x 8" x 6"</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold font-['Libre_Bodoni']">Customer Reviews</h3>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-['Mulish']">
                    Write a Review
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border border-stone-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold font-['Mulish']">John Doe</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < 4 ? 'text-orange-600 fill-current' : 'text-stone-300'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-stone-500 font-['Mulish']">2 days ago</span>
                      </div>
                      <p className="text-stone-700 font-['Mulish']">
                        Great product! Exactly as described and arrived quickly. Would definitely recommend to others.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CatalogView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  
  const { currentRoute, productId, navigate } = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(product => product.category.name))];
      setCategories(uniqueCategories);
      
      // Set price range based on product prices
      const prices = data.map(product => product.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const toggleCart = (productId) => {
    const newCart = new Set(cart);
    if (newCart.has(productId)) {
      newCart.delete(productId);
    } else {
      newCart.add(productId);
    }
    setCart(newCart);
  };

  const filteredProducts = products
    .filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === 'all' || product.category.name === selectedCategory
    )
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const ProductCard = ({ product, isListView = false }) => (
    <div 
      onClick={() => navigate('/product', product.id)}
      className={`bg-white rounded-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer ${
        isListView ? 'flex max-w-none h-48' : 'max-w-sm'
      }`}
    >
      <div className={`relative overflow-hidden ${isListView ? 'w-48 flex-shrink-0' : 'h-64'}`}>
        <img
          src={product.images[0] || 'https://via.placeholder.com/320'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full font-['Mulish']">
            {product.category.name}
          </span>
        </div>
        
        {/* Floating action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              favorites.has(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-stone-600 hover:bg-white'
            }`}
          >
            <Heart size={16} className={favorites.has(product.id) ? 'fill-current' : ''} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCart(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              cart.has(product.id)
                ? 'bg-orange-600 text-white'
                : 'bg-white/80 text-stone-600 hover:bg-white'
            }`}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      <div className={`p-6 flex flex-col justify-between ${isListView ? 'flex-1' : ''}`}>
        <div>
          <h3 className="text-xl font-bold text-stone-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200 font-['Libre_Bodoni']">
            {product.title}
          </h3>
          <p className="text-stone-600 text-sm mb-4 line-clamp-3 font-['Mulish']">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-stone-800 font-['Libre_Bodoni']">
              ${product.price}
            </span>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < 4 ? 'text-orange-600 fill-current' : 'text-stone-300'}
                />
              ))}
              <span className="text-xs text-stone-500 ml-1 font-['Mulish']">(4.0)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Route to product page
  if (currentRoute === '/product' && productId) {
    return (
      <ProductPage
        productId={productId}
        onBack={() => navigate('/')}
        products={products}
      />
    );
  }

  // Catalog page
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 text-lg font-['Mulish']">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-600 text-6xl mb-4">⚠️</div>
          <p className="text-stone-600 text-lg font-['Mulish'] mb-4">Error: {error}</p>
          <button 
            onClick={fetchProducts}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-['Mulish']"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-800 font-['Libre_Bodoni']">
                Product Catalog
              </h1>
              <p className="text-stone-600 mt-1 font-['Mulish']">
                Discover {filteredProducts.length} amazing products
              </p>
            </div>
            
            {/* Search and filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent w-64 font-['Mulish']"
                />
              </div>

              {/* Category filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-stone-200 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-orange-600 focus:border-transparent font-['Mulish']"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-stone-200 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-orange-600 focus:border-transparent font-['Mulish']"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
              </div>

              {/* View mode toggle */}
              <div className="flex bg-stone-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-stone-600'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-stone-600'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid/list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-stone-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-stone-600 mb-2 font-['Libre_Bodoni']">No products found</h3>
            <p className="text-stone-500 font-['Mulish']">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
              : 'flex flex-col gap-6'
          }>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-orange-700 transform hover:scale-110 transition-all duration-200 z-30"
      >
        <ChevronDown className="rotate-180" size={24} />
      </button>
    </div>
  );
};

export default CatalogView;