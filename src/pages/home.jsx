import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllProducts,
  selectBestsellers,
  selectOutletProducts,
  selectNewCollection,
  selectProductStatus,
  selectProductError,
  setSelectedProduct
} from '../features/productSlice';
import Hero from '../components/hero.jsx';
import ProductCard from '../components/cards.jsx';
import a1 from '../assets/a1.png';
import female from '../assets/aaaaa.png';
import d from '../assets/abc.png';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select data from Redux store
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  const bestsellers = useSelector(selectBestsellers);
  const outletProducts = useSelector(selectOutletProducts);
  const newCollection = useSelector(selectNewCollection);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Handle product click
  const handleProductClick = (product) => {
    dispatch(setSelectedProduct(product));
    navigate(`/product/${product.id}`);
  };

  // Handle "View All" click
  const handleViewAllClick = (section) => {
    navigate(`/products?category=${section}`);
  };

  // Create ProductCard component
  const createApiProductCard = (product, tags = []) => (
    <div 
      key={product.id} 
      onClick={() => handleProductClick(product)}
      className="cursor-pointer transform hover:scale-105 transition-transform duration-200 w-full"
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

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-stone-800 font-['Mulish']">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  // Error state
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
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Bestsellers Section */}
      <section className="py-8 sm:py-12">
        <div className="container  px-4 sm:px-6 lg:px-8 w-[90%] m-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-4 sm:mb-0">
              Bestsellers
            </h2>
            <button 
              onClick={() => handleViewAllClick('bestsellers')}
              className="text-orange-600 text-base sm:text-lg font-semibold font-['Mulish'] uppercase hover:text-orange-700 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {bestsellers.map(product => 
              createApiProductCard(product, [{ label: 'bestseller', bgColorClass: 'bg-pink-700' }])
            )}
          </div>
        </div>
      </section>

      {/* Outlet Section */}
      <section className="py-8 sm:py-12 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8  w-[90%] m-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-4 sm:mb-0">
              Outlet Deals
            </h2>
            <button 
              onClick={() => handleViewAllClick('outlet')}
              className="text-orange-600 text-base sm:text-lg font-semibold font-['Mulish'] uppercase hover:text-orange-700 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {outletProducts.map(product => 
              createApiProductCard(product, [
                { label: 'sale', bgColorClass: 'bg-orange-600' },
                { label: 'outlet', bgColorClass: 'bg-green-700' }
              ])
            )}
          </div>
        </div>
      </section>

      {/* New Collection Banner */}
      <section className="py-12 sm:py-16 bg-stone-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-24">
            <div className="relative w-full lg:w-1/2">
              <div className="relative aspect-square max-w-md mx-auto">
                <img
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full border-4 border-white w-full h-full object-cover shadow-lg"
                  src={female}
                  alt="New Collection"
                />
                <img
                  className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-1/4 rounded-full border-4 border-white w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover shadow-md"
                  src={d}
                  alt="Collection Detail"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-4 sm:mb-6">
                New Collection
              </h2>
              <p className="text-stone-800 font-['Mulish'] leading-relaxed text-sm sm:text-base">
                <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']">Breeze</span> - a collection of variability. 
                That we adapt to circumstances just like water adapts to wind currents. 
                <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']"> Adaptation is an important human skill</span>.
                <br /><br />
                Sometimes the mood is calm, like a sea surface, and sometimes it is stormy. 
                But as soon as the storm subsides, thoughts 
                <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']"> fly to the shores </span>
                in a breeze - to where it is cozy and carefree. 
                Where a ring of yellow gold with mother-of-pearl makes sense.
                <br /><br />
                After all, the 
                <span className="text-orange-600 text-base sm:text-lg font-['Libre_Bodoni']"> details become noticeable </span>
                when significant problems subside. And we dream that thanks to this jewelry story you will feel the ease of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Collection Products */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8  w-[90%] m-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-4 sm:mb-0">
              New Arrivals
            </h2>
            <button 
              onClick={() => handleViewAllClick('new')}
              className="text-orange-600 text-base sm:text-lg font-semibold font-['Mulish'] uppercase hover:text-orange-700 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {newCollection.map((product) => (
              <div 
                key={product.id} 
                className="group relative border border-stone-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={product.images?.[0] || a1} 
                    alt={product.title} 
                  />
                </div>

                <div className="p-4 sm:p-6 ">
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-800 font-['Mulish'] mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-stone-600 font-['Mulish'] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <span className="text-xl sm:text-2xl font-bold text-stone-800 font-['Libre_Bodoni']">
                      ${product.price}
                    </span>
                    <button className="px-3 py-1 sm:px-4 sm:py-2 border border-stone-800 text-stone-800 text-xs sm:text-sm font-medium hover:bg-stone-800 hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-8 sm:py-12 bg-stone-100">
        <div className="container  px-4 sm:px-6 lg:px-8  w-[90%] m-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 font-['Libre_Bodoni'] text-center mb-8 sm:mb-12">
            Why People Choose Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-1 sm:mb-2">
                Premium Quality
              </h3>
              <p className="text-stone-600 font-['Mulish'] text-xs sm:text-sm">
                All products undergo strict quality control to ensure excellence in every detail.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-1 sm:mb-2">
                Easy Returns
              </h3>
              <p className="text-stone-600 font-['Mulish'] text-xs sm:text-sm">
                Our hassle-free return policy makes shopping with us risk-free.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 font-['Libre_Bodoni'] mb-1 sm:mb-2">
                24/7 Support
              </h3>
              <p className="text-stone-600 font-['Mulish'] text-xs sm:text-sm">
                Our dedicated team is always ready to assist you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;   