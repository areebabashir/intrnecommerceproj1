import React, { useEffect } from 'react';
import { Star, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllProducts,
  selectProducts,
  selectProductStatus,
  selectProductError,
  setSelectedProduct,
  selectOutletProducts
} from '../features/productSlice';

const OutletView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state - using selectProducts instead of selectOutletProducts to get all products
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  
  // Local state for filtering/sorting
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('name');

  // Fetch all products on mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleProductClick = (product) => {
    dispatch(setSelectedProduct(product));
    navigate(`/product/${product.id}`);
  };

  const filteredProducts = React.useMemo(() => {
    return products
      .filter(product => {
        return product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return (a.price || 0) - (b.price || 0);
          case 'price-high': return (b.price || 0) - (a.price || 0);
          case 'name': return (a.title || '').localeCompare(b.title || '');
          default: return 0;
        }
      });
  }, [products, searchTerm, sortBy]);

  const ProductCard = ({ product }) => {
    const imageSrc = 
      product.images?.[0]?.startsWith('http') 
        ? product.images[0] 
        : 'https://via.placeholder.com/320x240?text=No+Image';

    return (
      <div
        className="bg-gradient-to-b from-white to-stone-50 rounded-xl border-2 border-stone-200 hover:border-orange-400 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer relative"
        onClick={() => handleProductClick(product)}
      >
        {/* Discount Ribbon - Only show if there's a discount */}
        {product.price < product.originalPrice && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
              <Zap size={14} className="mr-1" />
              <span>{Math.round(100 - (product.price / product.originalPrice * 100))}% OFF</span>
            </div>
          </div>
        )}

        <div className="relative h-64 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-stone-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {/* Show original price only if different from current price */}
              {product.price < product.originalPrice && (
                <span className="text-sm text-stone-500 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-orange-600">
                ${product.price?.toFixed(2) || '0.00'}
              </span>
            </div>
            
            <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-full">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-stone-700">4.8</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-stone-800">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <button 
            onClick={() => dispatch(fetchAllProducts())} 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-7xl mx-auto py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-12 border border-orange-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Our <span className="text-orange-600">Product Collection</span>
          </h1>
          <p className="text-lg text-stone-600 mb-6 max-w-2xl">
            Browse our complete selection of premium products. Find exactly what you're looking for.
          </p>
          <div className="flex items-center gap-4">
            <div className="relative flex-grow max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-orange-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search all products..."
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="py-3 px-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-right-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-200 opacity-40"></div>
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-red-200 opacity-30"></div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-stone-100 inline-block p-6 rounded-full mb-4">
            <Search size={40} className="text-stone-400" />
          </div>
          <h3 className="text-2xl font-semibold text-stone-800 mb-2">No products found</h3>
          <p className="text-stone-600 mb-6">Try adjusting your search criteria</p>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Reset Search
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Need help finding something?</h2>
        <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
          Contact our customer service team for personalized recommendations.
        </p>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default OutletView;