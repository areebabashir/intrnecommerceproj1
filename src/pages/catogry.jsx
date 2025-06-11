import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

// Placeholder images - replace with your actual imports
const b1 = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop";
const b2 = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop";
const b3 = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop";
const b4 = "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400&h=400&fit=crop";
const b5 = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop";
const b6 = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop";
const b7 = "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop";

// Card component
const Card = ({ imageSrc, altText, tags = [], title, oldPrice, price }) => {
  return (
    <div className="p-3 sm:p-4 lg:p-5 outline outline-1 outline-offset-[-1px] outline-stone-200 bg-white hover:shadow-lg transition-shadow cursor-pointer inline-flex flex-col justify-start items-start gap-4 lg:gap-6 relative w-full max-w-[320px] mx-auto">
      <div className="relative w-full aspect-square">
        <img className="w-full h-full object-cover" src={imageSrc} alt={altText} />
        {/* Tags on top */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 sm:gap-2">
          {tags.map(({ label, bgColorClass }, index) => (
            <div
              key={index}
              className={`h-6 sm:h-8 px-2 sm:px-4 py-1 sm:py-2 inline-flex justify-center items-center gap-2.5 rounded ${bgColorClass}`}
            >
              <div className="text-stone-200 text-sm sm:text-base font-normal font-['Mulish'] lowercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-start items-center gap-2 w-full">
        <div className="text-stone-800 text-lg sm:text-xl font-semibold font-['Mulish'] uppercase text-center w-full">
          {title}
        </div>
        <div className="inline-flex justify-center items-center gap-2">
          {oldPrice && (
            <div className="text-stone-400 text-sm sm:text-base font-normal font-['Libre_Bodoni'] line-through uppercase">
              $ {oldPrice}
            </div>
          )}
          <div className="flex justify-start items-start gap-1.5">
            <div className="text-stone-800 text-2xl sm:text-3xl font-bold font-['Libre_Bodoni'] uppercase">
              $
            </div>
            <div className="text-stone-800 text-2xl sm:text-3xl font-bold font-['Libre_Bodoni'] uppercase">
              {price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Category = () => {
  // State for managing expanded filter sections
  const [expandedFilters, setExpandedFilters] = useState({
    sample: true,
    productType: true
  });

  // State for managing selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    sample: [],
    productType: []
  });

  // State for mobile filter visibility
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sample product data with corrected categories
  const products = [
    { 
      id: 1, 
      name: 'Gold Necklace', 
      price: '455', 
      originalPrice: '680', 
      tags: ['Sale'], 
      image: b2,
      category: 'Necklaces',
      sample: '585'
    },
    { 
      id: 2, 
      name: 'Silver Chain Necklace', 
      price: '686', 
      originalPrice: '888', 
      tags: ['New', 'Sale'], 
      image: b3,
      category: 'Necklaces',
      sample: '925'
    },
    { 
      id: 3, 
      name: 'Diamond Ring', 
      price: '3345', 
      originalPrice: '5434', 
      tags: ['New', 'Sale'], 
      image: b4,
      category: 'Rings',
      sample: '750'
    },
    { 
      id: 4, 
      name: 'Wedding Ring', 
      price: '521', 
      originalPrice: '886', 
      tags: ['Sale'], 
      image: b5,
      category: 'Rings',
      sample: '585'
    },
    { 
      id: 5, 
      name: 'Pearl Earrings', 
      price: '321', 
      originalPrice: '860', 
      tags: ['Bestseller', 'New', 'Sale'], 
      image: b6,
      category: 'Earrings',
      sample: '585'
    },
    { 
      id: 6, 
      name: 'Pearl Ring', 
      price: '541', 
      originalPrice: '676', 
      tags: ['Sale'], 
      image: b7,
      category: 'Rings',
      sample: '750'
    },
    { 
      id: 7, 
      name: 'Statement Necklace', 
      price: '1432', 
      originalPrice: '2350', 
      tags: ['Bestseller', 'Sale'], 
      image: b2,
      category: 'Necklaces',
      sample: '750'
    },
    { 
      id: 8, 
      name: 'Engagement Ring', 
      price: '489', 
      originalPrice: null, 
      tags: ['New'], 
      image: b3,
      category: 'Rings',
      sample: '958'
    },
    { 
      id: 9, 
      name: 'Gold Bracelet', 
      price: '521', 
      originalPrice: '886', 
      tags: ['Sale'], 
      image: b4,
      category: 'Bracelets',
      sample: '585'
    },
    { 
      id: 10, 
      name: 'Diamond Earrings', 
      price: '1250', 
      originalPrice: '1800', 
      tags: ['Bestseller'], 
      image: b5,
      category: 'Earrings',
      sample: '750'
    }
  ];

  // Generate filter options based on actual product data
  const sampleOptions = useMemo(() => {
    const samples = [...new Set(products.map(p => p.sample))].sort();
    return samples.map(sample => ({
      value: sample,
      count: products.filter(p => p.sample === sample).length,
      selected: selectedFilters.sample?.includes(sample)
    }));
  }, [products, selectedFilters.sample]);

  const productTypeOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))].sort();
    return categories.map(category => ({
      value: category,
      count: products.filter(p => p.category === category).length,
      selected: selectedFilters.productType?.includes(category)
    }));
  }, [products, selectedFilters.productType]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const sampleMatch = selectedFilters.sample?.length === 0 || selectedFilters.sample?.includes(product.sample);
      const categoryMatch = selectedFilters.productType?.length === 0 || selectedFilters.productType?.includes(product.category);
      return sampleMatch && categoryMatch;
    });
  }, [products, selectedFilters]);

  // Toggle filter section expansion
  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Handle checkbox selection
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType]?.includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...(prev[filterType] || []), value]
    }));
  };

  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case 'sale': return 'bg-orange-600';
      case 'new': return 'bg-emerald-900';
      case 'bestseller': return 'bg-pink-700';
      default: return 'bg-gray-600';
    }
  };

  // Transform tags for Card component
  const transformTagsForCard = (tags) => {
    return tags.map(tag => ({
      label: tag,
      bgColorClass: getTagColor(tag)
    }));
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
      {isExpanded && (
        <div className="w-full pl-3 flex flex-col gap-1">
          {children}
        </div>
      )}
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
          className={`w-4 h-4 relative rounded-sm border-2 ${
            checked ? 'bg-stone-800 border-stone-800' : 'border-stone-400'
          } flex items-center justify-center flex-shrink-0`}
        >
          {checked && <div className="w-2 h-1.5 bg-white rounded-sm" />}
        </div>
        <div className={`text-stone-800 text-sm sm:text-base font-normal font-['Mulish'] ${
          checked ? 'font-medium' : ''
        }`}>
          {label}
        </div>
      </div>
      <div className="text-stone-800/70 text-sm sm:text-base font-normal font-['Mulish']">
        ({count})
      </div>
    </div>
  );

  const CategoryList = () => {
    const categories = [
      { name: 'All Jewelry', count: products.length, active: selectedFilters.productType?.length === 0 },
      ...productTypeOptions.map(option => ({
        name: option.value,
        count: option.count,
        active: selectedFilters.productType?.includes(option.value)
      }))
    ];

    const handleCategoryClick = (categoryName) => {
      if (categoryName === 'All Jewelry') {
        setSelectedFilters(prev => ({ ...prev, productType: [] }));
      } else {
        setSelectedFilters(prev => ({ ...prev, productType: [categoryName] }));
      }
    };

    return (
      <div className="flex flex-col justify-start items-start gap-3 w-full">
        <div className="text-stone-800 text-2xl sm:text-3xl lg:text-4xl font-bold font-['Libre_Bodoni']">Categories</div>
        <div className="flex flex-col justify-start items-start gap-1 w-full">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`w-full flex justify-between items-center p-1.5 cursor-pointer hover:bg-stone-50 transition-colors rounded ${
                category.active ? 'bg-stone-100' : ''
              }`}
            >
              <div className={`text-stone-800 text-base sm:text-lg font-medium font-['Mulish'] ${
                category.active ? 'font-semibold' : ''
              }`}>
                {category.name}
              </div>
              <div className="text-stone-800/70 text-sm sm:text-base font-normal font-['Mulish']">
                ({category.count})
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FiltersContent = () => (
    <div className="inline-flex flex-col justify-start items-start gap-5 w-full">
      {/* Filters Section */}
      <div className="inline-flex flex-col justify-start items-start gap-4 w-full">
        <div className="w-full inline-flex justify-between items-center">
          <div className="text-stone-800 text-2xl sm:text-3xl lg:text-4xl font-bold font-['Libre_Bodoni']">Filters</div>
          <button 
            className="text-stone-800/50 text-lg sm:text-xl lg:text-2xl font-normal font-['Mulish'] leading-9 tracking-wide hover:text-stone-800/70 transition-colors"
            onClick={() => setSelectedFilters({ sample: [], productType: [] })}
          >
            Reset all
          </button>
        </div>
        
        <div className="flex flex-col justify-start items-start gap-1 w-full h-full">
          <FilterSection title="Price" isExpanded={false} onToggle={() => toggleFilter('price')} />
          <FilterSection title="Collection" isExpanded={false} onToggle={() => toggleFilter('collection')} />
          <FilterSection title="Insert" isExpanded={false} onToggle={() => toggleFilter('insert')} />
          <FilterSection title="Insert Color" isExpanded={false} onToggle={() => toggleFilter('insertColor')} />
          <FilterSection title="Metal" isExpanded={false} onToggle={() => toggleFilter('metal')} />
          <FilterSection title="Metal Color" isExpanded={false} onToggle={() => toggleFilter('metalColor')} />
          
          <FilterSection 
            title="Sample" 
            isExpanded={expandedFilters.sample} 
            onToggle={() => toggleFilter('sample')}
          >
            {sampleOptions.map((option) => (
              <FilterOption
                key={option.value}
                checked={selectedFilters.sample?.includes(option.value)}
                onChange={() => handleFilterChange('sample', option.value)}
                label={option.value}
                count={option.count}
              />
            ))}
          </FilterSection>

          <FilterSection 
            title="Product Type" 
            isExpanded={expandedFilters.productType} 
            onToggle={() => toggleFilter('productType')}
          >
            {productTypeOptions.map((option) => (
              <FilterOption
                key={option.value}
                checked={selectedFilters.productType?.includes(option.value)}
                onChange={() => handleFilterChange('productType', option.value)}
                label={option.value}
                count={option.count}
              />
            ))}
          </FilterSection>

          <FilterSection title="Size" isExpanded={false} onToggle={() => toggleFilter('size')} />
        </div>
      </div>

      {/* Category List Section */}
      <CategoryList />
    </div>
  );

  return (
    <div className='w-full max-w-[1900px] m-auto min-h-screen bg-white mb-70'> 
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="bg-stone-800 text-white p-3 rounded-full shadow-lg hover:bg-stone-700 transition-colors"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileFiltersOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-800">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-6 h-6 text-stone-800" />
                </button>
              </div>
              <FiltersContent />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-start items-start min-h-screen">
        {/* Desktop Filters Sidebar - Reduced height and spacing */}
        <div className="hidden lg:block lg:w-80 xl:w-[350px] bg-white border-r border-stone-200">
          <div className="p-4 xl:p-5 max-h-screen ">
            <FiltersContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
            <div className="inline-flex flex-col justify-start items-start gap-6 sm:gap-7 w-full">
              {/* Hero Image */}
              <img 
                className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-lg" 
                src={b1}
                alt="Jewelry Collection"
              />
              
              {/* Results Header */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-neutral-900 text-lg sm:text-xl font-medium font-['Libre_Bodoni']">
                  Results: {filteredProducts.length}
                </div>
                <div className="flex justify-start items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                  <div className="text-neutral-900 text-lg sm:text-xl font-medium font-['Libre_Bodoni']">Sort by</div>
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800" />
                </div>
              </div>
              
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 w-full">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    imageSrc={product.image}
                    altText={product.name}
                    tags={transformTagsForCard(product.tags)}
                    title={product.name}
                    oldPrice={product.originalPrice}
                    price={product.price}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;