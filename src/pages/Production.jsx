import React, { useEffect, useState } from 'react';
import { Star, Search, Zap, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllProducts,
  selectProducts,
  selectProductStatus,
  selectProductError,
  setSelectedProduct
} from '../features/productSlice';

const ProductGallery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch products
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Extract categories
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = searchTerm === '' || 
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategories.length === 0 || 
          selectedCategories.includes(product.category?.name);
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return (a.price || 0) - (b.price || 0);
          case 'price-high': return (b.price || 0) - (a.price || 0);
          case 'rating': return (b.rating || 0) - (a.rating || 0);
          case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
          default: return 0; // 'featured' uses default sorting
        }
      });
  }, [products, searchTerm, sortBy, selectedCategories]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const ProductCard = ({ product }) => {
    const imageSrc = product.images?.[0]?.startsWith('http') 
      ? product.images[0] 
      : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
      <div 
        className="bg-white  rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
        onClick={() => {
          dispatch(setSelectedProduct(product));
          navigate(`/product/${product.id}`);
        }}
      >
        {/* Image with overlay */}
        <div className="relative pt-[100%] overflow-hidden">
          <img
            src={imageSrc}
            alt={product.title}
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Discount badge */}
          {product.price < product.originalPrice && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg flex items-center z-10">
              <Zap size={14} className="mr-1" />
              <span>{Math.round(100 - (product.price / product.originalPrice * 100))}% OFF</span>
            </div>
          )}
          
          {/* Category tag */}
          {product.category?.name && (
            <div className="absolute bottom-4 left-4 bg-white/90 text-stone-800 text-xs font-semibold px-2 py-1 rounded">
              {product.category.name}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-stone-600 text-sm mb-4 line-clamp-3 flex-grow">
            {product.description}
          </p>
          
          {/* Price and rating */}
          <div className="mt-auto">
            <div className="flex items-end justify-between mb-2">
              <div>
                {product.price < product.originalPrice && (
                  <span className="text-sm text-stone-500 line-through mr-2">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-bold text-orange-600">
                  ${product.price?.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center bg-stone-100 px-2 py-1 rounded-full">
                <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-xs font-semibold text-stone-700">
                  {product.rating?.toFixed(1) || '4.5'}
                </span>
              </div>
            </div>
            
            {/* Stock status */}
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
              ></div>
            </div>
         
          </div>
        </div>
      </div>
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse flex space-x-4 mb-4 justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-full bg-orange-200 h-12 w-12"></div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-stone-800">Loading Our Collection</h2>
          <p className="text-stone-600 mt-2">Curating the finest products for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Oops!</h2>
          <p className="text-stone-700 mb-4">We encountered an error: {error}</p>
          <button
            onClick={() => dispatch(fetchAllProducts())}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-all"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 w-[80%]">
      {/* Hero header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
          Discover Our <span className="text-orange-600">Exclusive Collection</span>
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Handpicked selection of premium products curated just for you
        </p>
      </div>

      {/* Filters and search */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-orange-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search our collection..."
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm w-full md:w-64"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <div className="absolute right-3 top-3.5 text-stone-400 pointer-events-none">
              <ChevronDown size={20} />
            </div>
          </div>

          {/* Filter toggle (mobile) */}
          <button
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border border-stone-300 rounded-lg bg-white shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            <span>Filters</span>
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Category filters */}
        {(showFilters || window.innerWidth >= 768) && (
          <div className="bg-stone-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-stone-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {category}
                </button>
              ))}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-stone-500 hover:text-orange-500"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-stone-100 rounded-full mb-4">
            <Search size={48} className="text-stone-400" />
          </div>
          <h3 className="text-2xl font-semibold text-stone-800 mb-2">No products match your search</h3>
          <p className="text-stone-600 mb-6">Try adjusting your filters or search term</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategories([]);
              setSortBy('featured');
            }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-24 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">Stay Updated</h2>
        <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter for exclusive offers and new arrivals
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition-all whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;