import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Card = ({ product }) => {
  const navigate = useNavigate();

  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case 'sale': return 'bg-orange-600';
      case 'new': return 'bg-emerald-900';
      case 'bestseller': return 'bg-pink-700';
      default: return 'bg-gray-600';
    }
  };

  const handleProductClick = () => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleProductClick}
      className="p-3 sm:p-4 lg:p-5 outline outline-1 outline-offset-[-1px] outline-stone-200 bg-white hover:shadow-lg transition-shadow cursor-pointer inline-flex flex-col justify-start items-start gap-4 lg:gap-6 relative w-full max-w-[320px] mx-auto"
    >
      <div className="relative w-full aspect-square">
        <img 
          className="w-full h-full object-cover" 
          src={product.images?.[0]} 
          alt={product.title} 
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 sm:gap-2">
          <div className={`h-6 sm:h-8 px-2 sm:px-4 py-1 sm:py-2 inline-flex justify-center items-center gap-2.5 rounded ${getTagColor('new')}`}>
            <div className="text-stone-200 text-sm sm:text-base font-normal font-['Mulish'] lowercase">new</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-center gap-2 w-full">
        <div className="text-stone-800 text-lg sm:text-xl font-semibold font-['Mulish'] uppercase text-center w-full">
          {product.title}
        </div>
        <div className="inline-flex justify-center items-center gap-2">
          <div className="flex justify-start items-start gap-1.5">
            <div className="text-stone-800 text-2xl sm:text-3xl font-bold font-['Libre_Bodoni']">$</div>
            <div className="text-stone-800 text-2xl sm:text-3xl font-bold font-['Libre_Bodoni']">{product.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Category = () => {
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({ category: [] });
  const [expandedFilters, setExpandedFilters] = useState({ category: true });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://api.escuelajs.co/api/v1/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(products.map(p => p.category?.name).filter(Boolean))
    ];
    return categories.map(cat => ({
      value: cat,
      count: products.filter(p => p.category?.name === cat).length,
      selected: selectedFilters.category.includes(cat)
    }));
  }, [products, selectedFilters.category]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory =
        selectedFilters.category.length === 0 ||
        selectedFilters.category.includes(p.category?.name);
      return matchCategory;
    });
  }, [products, selectedFilters]);

  const handleFilterToggle = (type) => {
    setExpandedFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const isSelected = prev[type].includes(value);
      const updated = isSelected
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="flex flex-col justify-start items-start gap-2 w-full">
      <div 
        className="w-full flex justify-between items-center p-1.5 cursor-pointer hover:bg-stone-50 transition-colors rounded" 
        onClick={onToggle}
      >
        <div className="text-stone-800 text-base sm:text-lg font-medium font-['Mulish']">{title}</div>
        <div className="w-5 h-5 flex items-center justify-center">
          {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-800" /> : <ChevronDown className="w-4 h-4 text-stone-800" />}
        </div>
      </div>
      {isExpanded && <div className="w-full pl-3 flex flex-col gap-1">{children}</div>}
    </div>
  );

  const FilterOption = ({ checked, onChange, label, count }) => (
    <div 
      className={`w-full flex justify-between items-center p-1.5 cursor-pointer hover:bg-stone-50 transition-colors rounded ${
        checked ? 'bg-stone-100' : ''
      }`}
      onClick={onChange}
    >
      <div className="flex items-center gap-2.5">
        <div 
          className={`w-4 h-4 rounded-sm border-2 ${
            checked ? 'bg-stone-800 border-stone-800' : 'border-stone-400'
          } flex items-center justify-center flex-shrink-0`}
        >
          {checked && <div className="w-2 h-1.5 bg-white rounded-sm" />}
        </div>
        <div className={`text-stone-800 text-sm sm:text-base font-['Mulish'] ${checked ? 'font-medium' : 'font-normal'}`}>
          {label}
        </div>
      </div>
      <div className="text-stone-800/70 text-sm sm:text-base font-normal font-['Mulish']">({count})</div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Sidebar filters */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6">
        <FilterSection 
          title="Categories" 
          isExpanded={expandedFilters.category} 
          onToggle={() => handleFilterToggle('category')}
        >
          {categoryOptions.map(option => (
            <FilterOption
              key={option.value}
              checked={option.selected}
              onChange={() => handleFilterChange('category', option.value)}
              label={option.value}
              count={option.count}
            />
          ))}
        </FilterSection>
      </div>

      {/* Products */}
      <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Category;
