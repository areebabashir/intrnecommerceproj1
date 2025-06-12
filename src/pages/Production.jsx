import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/cards";

const ProductionPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const navigate = useNavigate();

const handleProductClick = (product) => {
  localStorage.setItem('selectedProduct', JSON.stringify(product));
  navigate(`/product/${product.id}`);
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://api.escuelajs.co/api/v1/products");

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        const transformed = data.map((product) => ({
          id: product.id,
          imageSrc: product.images[0] || "",
          altText: product.title,
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          tags: generateTags(product),
          category: product.category?.name || "Uncategorized",
        }));

        setProducts(transformed);
        setFilteredProducts(transformed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const generateTags = (product) => {
    const tags = [];
    if (product.id % 5 === 0) tags.push({ label: "New", bgColorClass: "bg-green-600" });
    if (product.price < 100) tags.push({ label: "Sale", bgColorClass: "bg-red-600" });
    if (product.id % 7 === 0) tags.push({ label: "Featured", bgColorClass: "bg-blue-600" });
    return tags;
  };

  const calculateOldPrice = (price) => {
    const increase = Math.random() * 0.3 + 0.2;
    return Math.round(price * (1 + increase)).toString();
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.tags.some((tag) => tag.label === filter)
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Productions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our finest products crafted with passion and precision.
        </p>
      </div>

      {/* Filter Buttons */}
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

      {/* Count */}
      <div className="text-center mb-6 text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="cursor-pointer hover:scale-105 transform transition-transform duration-200"
            >
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-lg">
          No products found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default ProductionPage;
