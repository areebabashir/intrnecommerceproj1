import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

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

      const uniqueCategories = [...new Set(data.map((product) => product.category.name))];
      setCategories(uniqueCategories);

      const prices = data.map((product) => product.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update this function to store full product data
  const handleProductClick = (product) => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(`/product/${product.id}`);
  };

  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    newFavorites.has(productId) ? newFavorites.delete(productId) : newFavorites.add(productId);
    setFavorites(newFavorites);
  };

  const toggleCart = (e, productId) => {
    e.stopPropagation();
    const newCart = new Set(cart);
    newCart.has(productId) ? newCart.delete(productId) : newCart.add(productId);
    setCart(newCart);
  };

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === 'all' || product.category.name === selectedCategory
    )
    .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
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

  const ProductCard = ({ product }) => (
    <div
      className="bg-white rounded-lg border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer max-w-sm "
      onClick={() => handleProductClick(product)} // ✅ Pass entire product
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.images[0] || 'https://via.placeholder.com/320'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
            {product.category.name}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-stone-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
          {product.title}
        </h3>
        <p className="text-stone-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-stone-800">
              ${product.price}
            </span>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Heart
              size={20}
              onClick={(e) => toggleFavorite(e, product.id)}
              className={`cursor-pointer ${favorites.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}
            />
            <ShoppingCart
              size={20}
              onClick={(e) => toggleCart(e, product.id)}
              className={`cursor-pointer ${cart.has(product.id) ? 'text-green-500' : 'text-gray-400'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center mt-10">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
     <div className="w-[85%] mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
  );
};

export default CatalogView;
