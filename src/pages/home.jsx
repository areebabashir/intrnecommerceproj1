import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import Hero from '../components/hero.jsx';
import ProductCard from '../components/cards.jsx';
import a1 from '../assets/a1.png';
import female from '../assets/aaaaa.png';
import d from '../assets/abc.png';
import a from '../assets/a1.png';
import b from '../assets/a2.png';
import c from '../assets/a5.png';
import d1 from '../assets/a4.png';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Add navigation hook

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        console.log('Fetching products from API', response);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product click - Navigate to product page
const handleProductClick = (product) => {
  localStorage.setItem('selectedProduct', JSON.stringify(product));
  navigate(`/product/${product.id}`);
};



  // Handle "View All" clicks for different sections
  const handleViewAllClick = (section) => {
    navigate(`/products?category=${section}`);
  };

  // Get products by category for different sections
  const getBestsellerProducts = () => products.slice(0, 3);
  const getOutletProducts = () => products.slice(3, 6);
  const getNewCollectionProducts = () => products.slice(6, 10);
  const getCategoryProducts = () => products.slice(10, 13);

  // Create ProductCard with API data
  const createApiProductCard = (product, tags = []) => (
    <div 
      key={product.id} 
      onClick={() => handleProductClick(product)}
      className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
    >
      <ProductCard
        imageSrc={product.images?.[0] || a1}
        altText={product.title}
        tags={tags}
        title={product.title}
        price={product.price?.toString() || '0'}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-stone-800 font-['Mulish']">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-['Mulish'] mb-4">Error loading products: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-600 text-white px-6 py-2 rounded font-['Mulish']"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />

      {/* Heading before cards */}
      <div className="container mx-auto px-4 flex flex-col w-[90%] sm:flex-row justify-between items-center gap-4 my-8 pt-6 lg:px-10">
        <div className="text-stone-800 text-2xl sm:text-3xl lg:text-5xl font-bold font-['Libre_Bodoni']">
          Bestsellers
        </div>
        <div className="flex items-center gap-2 cursor-pointer lg:px-10">
          <div className="text-orange-600 text-base sm:text-lg lg:text-xl font-semibold font-['Mulish'] uppercase">
            <button>View All</button>
          </div>
         
        </div>
      </div>

      {/* Bestsellers Cards container */}
      <div className="flex justify-center py-4 sm:py-10 px-6 w-[95%] m-auto">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-7 max-w-[1530px] w-full">
          {getBestsellerProducts().map(product => 
            createApiProductCard(product, [{ label: 'bestseller', bgColorClass: 'bg-pink-700' }])
          )}
        </div>
      </div>
      
      {/* Outlet Section */}
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center my-8 pt-8 lg:px-10 w-[90%]">
        <div className="text-stone-800 text-2xl sm:text-3xl lg:text-5xl font-bold font-['Libre_Bodoni']">
          Outlet
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-orange-600 text-base sm:text-lg lg:text-xl font-semibold font-['Mulish'] uppercase">
            <button> view all</button>
          </div>
          
        </div>
      </div>

      {/* Outlet Products */}
      <div className="flex justify-center py-6 sm:py-10 px-4 lg:px-10 w-[95%] m-auto">
        <div className="flex flex-wrap justify-center items-start gap-4 sm:gap-7 max-w-[1530px] w-full">
          {getOutletProducts().map(product => 
            createApiProductCard(product, [
              { label: 'sale', bgColorClass: 'bg-orange-600' },
              { label: 'outlet', bgColorClass: 'bg-green-700' }
            ])
          )}
        </div>
      </div>

      {/* New Collection Banner */}
      <div className="w-full bg-stone-200 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 sm:gap-16 lg:gap-40">
          {/* Left Section - Images */}
          <div className="relative flex-shrink-0 w-full lg:w-auto flex justify-center">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[400px] lg:w-[490px] lg:h-[612px]">
              <img
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full border-2 sm:border-4 border-white w-full h-full object-cover"
                src={female}
                alt="Main"
              />
              <img
                className="absolute top-8 sm:top-12 md:top-16 lg:top-60 left-3/4 sm:left-4/5 lg:left-[490px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 sm:border-4 border-white w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-54 lg:h-54 object-cover"
                src={d}
                alt="Small"
              />
            </div>
          </div>

          {/* Right Section - Text */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-4 sm:mb-6">
              New Collection
            </h2>
            <p className="text-sm sm:text-base text-stone-800 font-['Mulish'] leading-relaxed">
              <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']">Breeze</span>
              <span className="text-sm sm:text-base"> - a collection of variability. That we adapt to circumstances just like water adapts to wind currents. </span>
              <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']">Adaptation is an important human skill</span>
              <span className="text-black">.</span>
              <span><br /></span>
              Sometimes the mood is calm, like a sea surface, and sometimes it is stormy. But as soon as the storm subsides, thoughts 
              <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']"> fly to the shores </span>
              in a breeze - to where it is cozy and carefree. Where a ring of yellow gold with mother-of-pearl makes sense. <br />
              After all, the 
              <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']"> details become noticeable </span>
              when significant problems subside. And we dream that thanks to this jewelry story you will feel the ease of life.
            </p>
          </div>
        </div>
      </div>

      {/* New Collection Products */}
      <div className="bg-white py-6 sm:py-10 w-[90%] m-auto flex justify-center px-4 lg:px-10">
        <div className="max-w-screen-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
            <div className="text-stone-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Libre_Bodoni']">New Collection</div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-7 w-[90%] m-auto">
            {getNewCollectionProducts().map((product, index) => (
              <div 
                key={product.id} 
                className="w-full h-auto relative border border-stone-200 flex flex-col sm:flex-row cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleProductClick(product)}
              >
                <img 
                  className="w-full sm:w-48 md:w-56 lg:w-64 h-48 sm:h-64 object-cover" 
                  src={product.images?.[0] || a1} 
                  alt={product.title} 
                />
                <div className="p-4 sm:p-6 flex flex-col justify-between flex-1">
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="text-stone-800 text-lg sm:text-xl lg:text-2xl font-semibold uppercase font-['Mulish']">
                      {product.title}
                    </div>
                    <div className="text-stone-800 text-sm sm:text-base font-normal font-['Mulish'] leading-normal tracking-wide">
                      {product.description || "Breeze - a collection of variability. That we adapt to circumstances just as water adapts to wind currents."}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <div className="text-stone-800 text-xl sm:text-2xl lg:text-3xl font-bold font-['Libre_Bodoni']">
                      ${product.price}
                    </div>
                    <div className="h-8 px-3 sm:px-5 py-2.5 mt-2 outline outline-1 outline-stone-800 flex items-center w-max">
                      <div className="text-stone-800 text-xs sm:text-sm font-medium font-['Playfair_Display'] capitalize">See More</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="py-12 sm:py-16 lg:py-26 bg-white relative w-[95%] m-auto">
        <h2 className="text-center text-stone-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Libre_Bodoni'] mb-6 sm:mb-10 px-4">
          Shop by Category
        </h2>

        {/* Product Cards Container */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 lg:gap-14 px-4 sm:px-8 md:px-16 lg:pl-20">
          {getCategoryProducts().map(product => 
            createApiProductCard(product, [{ label: 'category', bgColorClass: 'bg-purple-600' }])
          )}
        </div>

        {/* Sidebar Category List */}
        <div className="hidden xl:flex flex-col gap-10 absolute top-[200px] left-[250px] 2xl:left-[50px]">
          {['Bracelets', 'Necklace', 'Rings', 'Earrings', 'Chains', 'Brooches', 'Hairpins'].map((cat, index) => (
            <div
              key={cat}
              className={`text-center text-lg xl:text-xl font-['Mulish'] ${
                cat === 'Earrings' ? 'text-orange-600 font-bold' : 'text-stone-400 font-medium'
              } cursor-pointer hover:text-orange-600 transition-colors`}
              onClick={() => navigate(`/products?category=${cat.toLowerCase()}`)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Why People Choose Us */}
      <div className="w-full bg-stone-200 flex flex-col justify-center items-center py-8 sm:py-12 px-4">
        <h2 className="text-stone-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Libre_Bodoni'] mb-6 sm:mb-10 text-center">
          Why People Choose Us
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-start gap-8 sm:gap-10 lg:gap-16 max-w-6xl w-full">
          {/* Items remain the same */}
          <div className="flex flex-col items-center gap-4 sm:gap-5 max-w-xs mx-auto text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4m8-8h-4M4 12H0" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-2 sm:gap-2.5">
              <div className="text-stone-800 text-base sm:text-lg lg:text-xl font-medium font-['Libre_Bodoni'] capitalize">
                High Quality
              </div>
              <p className="text-stone-800 text-sm sm:text-base font-normal font-['Mulish'] leading-snug">
                All of our products go through very strict inspection before we dispatch them
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-5 max-w-xs mx-auto text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-2 sm:gap-2.5">
              <div className="text-stone-800 text-base sm:text-lg lg:text-xl font-medium font-['Libre_Bodoni'] capitalize">
                Easy Returns
              </div>
              <p className="text-stone-800 text-sm sm:text-base font-normal font-['Mulish'] leading-snug">
                Our return policy is simple and that is why customers love our shop
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-5 max-w-xs mx-auto text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8v6a2 2 0 01-2 2h-1l-2 2v-2H8a2 2 0 01-2-2v-4a2 2 0 012-2h8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 8V6a3 3 0 00-6 0v2" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-2 sm:gap-2.5">
              <div className="text-stone-800 text-base sm:text-lg lg:text-xl font-medium font-['Libre_Bodoni'] capitalize">
                Customer Service
              </div>
              <p className="text-stone-800 text-sm sm:text-base font-normal font-['Mulish'] leading-snug">
                We offer amazing customer service no matter what happens
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="w-full min-h-[20rem] sm:h-96 bg-white flex flex-col justify-center items-center py-8 sm:py-12 px-4">
        <h2 className="text-stone-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Libre_Bodoni'] text-center mb-3 sm:mb-4">
          Subscribe to our Newsletter
        </h2>
        <p className="text-stone-800 text-sm sm:text-base font-normal font-['Mulish'] leading-snug text-center mb-4 sm:mb-6">
          We promise to be polite and not bore you
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full sm:w-64 p-2 sm:p-3 outline outline-1 outline-offset-[-1px] outline-stone-800 text-stone-800 font-['Mulish'] text-sm sm:text-base"
          />
          <button className="w-full sm:w-44 h-10 sm:h-12 bg-stone-800 text-stone-200 text-sm sm:text-base font-medium font-['Libre_Bodoni'] capitalize">
            Subscribe
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;