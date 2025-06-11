import React, { useState, useEffect } from "react";
import Card from "../components/cards"; // Ensure this file exists and is exported properly

const ProductionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Transform API data to match your Card component props
        const transformedProducts = data.map((product) => ({
          id: product.id,
          imageSrc: product.images[0] || '', // Use first image or empty string
          altText: product.title,
          tags: generateTags(product), // Generate tags based on product data
          title: product.title,
          oldPrice: calculateOldPrice(product.price), // Generate old price for demo
          price: product.price.toString(),
          category: product.category?.name || 'Uncategorized',
          description: product.description
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Generate tags based on product data (you can customize this logic)
  const generateTags = (product) => {
    const tags = [];
    
    // Add "New" tag for products with id divisible by 5 (just for demo)
    if (product.id % 5 === 0) {
      tags.push({ label: "New", bgColorClass: "bg-green-600" });
    }
    
    // Add "Sale" tag for products with price less than 100
    if (product.price < 100) {
      tags.push({ label: "Sale", bgColorClass: "bg-red-600" });
    }
    
    // Add "Featured" tag for products with id divisible by 7
    if (product.id % 7 === 0) {
      tags.push({ label: "Featured", bgColorClass: "bg-blue-600" });
    }
    
    return tags;
  };

  // Calculate old price (just adds 20-50% for demo purposes)
  const calculateOldPrice = (currentPrice) => {
    const increase = Math.random() * 0.3 + 0.2; // 20-50% increase
    return Math.round(currentPrice * (1 + increase)).toString();
  };

  // Filter products based on selected filter
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.tags.some(tag => tag.label === filter)
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">Failed to load products: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Our Productions
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Discover our finest products crafted with passion and precision.
        </p>
      </div>

      {/* Filter UI */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4 bg-white p-2 rounded-lg shadow-md">
          {["All", "New", "Sale", "Featured"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Product Count */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="w-full">
              <Card
                imageSrc={product.imageSrc}
                altText={product.altText}
                tags={product.tags}
                title={product.title}
                oldPrice={product.oldPrice}
                price={product.price}
              />
            </div>
          ))}
        </div>
      </div>

      {/* No products message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found for the selected filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductionPage;