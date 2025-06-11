import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import log from '../assets/logo.png';

const Footer = () => {
  return (
    <div className="w-full bg-stone-200 py-8 sm:py-12 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Section */}
        <div className="flex flex-col xl:flex-row justify-between gap-8 lg:gap-12 items-center xl:items-start text-center xl:text-left">
          {/* Logo */}
          <div className="flex-shrink-0 mb-4 xl:mb-0">
            <img className="w-20 sm:w-24 h-auto object-contain mx-auto xl:mx-0" src={log} alt="Logo" />
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full xl:flex-1 max-w-4xl">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-medium font-['Libre_Bodoni'] text-stone-800">
                To the buyer
              </h3>
              <ul className="space-y-2 text-stone-800 text-sm sm:text-base font-normal font-['Mulish']">
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Payment and delivery</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Exchange and return</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Shops</li>
              </ul>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-medium font-['Libre_Bodoni'] text-stone-800">
                About
              </h3>
              <ul className="space-y-2 text-stone-800 text-sm sm:text-base font-normal font-['Mulish']">
                <li className="hover:text-stone-600 cursor-pointer transition-colors">About us</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">SOVA CLUB</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Contract offers</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Contacts</li>
              </ul>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-medium font-['Libre_Bodoni'] text-stone-800">
                Catalog
              </h3>
              <ul className="space-y-2 text-stone-800 text-sm sm:text-base font-normal font-['Mulish']">
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Jewelry</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">Collections</li>
                <li className="hover:text-stone-600 cursor-pointer transition-colors">%Outlet</li>
              </ul>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-medium font-['Libre_Bodoni'] text-stone-800">
                Work Time
              </h3>
              <div className="text-stone-800 text-sm sm:text-base font-normal font-['Mulish'] leading-relaxed">
                <p>Mon-Th 9:00 - 20:00</p>
                <p>Fri 9:00 - 19:00</p>
                <p>Sat 9:00 - 17:00</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 w-full sm:w-auto xl:w-80 xl:flex-shrink-0">
            <h3 className="text-lg sm:text-xl font-medium font-['Libre_Bodoni'] text-stone-800">
              Subscribe our Newsletters
            </h3>
            
            <div className="flex flex-col gap-2 w-full">
              <input
                type="email"
                placeholder="Your email"
                className="border border-stone-800 px-3 sm:px-4 py-2 sm:py-3 w-full text-stone-400 font-['Mulish'] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-stone-600 transition-all"
              />
              <button className="bg-stone-800 text-stone-200 px-3 sm:px-4 py-2 sm:py-3 font-['Libre_Bodoni'] capitalize w-full hover:bg-stone-900 transition-colors text-sm sm:text-base">
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 sm:gap-4 mt-2 justify-center xl:justify-start">
              <a 
                href="#" 
                aria-label="Facebook" 
                className="p-2 sm:p-3 rounded-full outline outline-1 outline-stone-800 hover:bg-stone-800 hover:text-white transition-all duration-200 hover:scale-105"
              >
                <FaFacebookF className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a 
                href="#" 
                aria-label="Twitter" 
                className="p-2 sm:p-3 rounded-full outline outline-1 outline-stone-800 hover:bg-stone-800 hover:text-white transition-all duration-200 hover:scale-105"
              >
                <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram" 
                className="p-2 sm:p-3 rounded-full outline outline-1 outline-stone-800 hover:bg-stone-800 hover:text-white transition-all duration-200 hover:scale-105"
              >
                <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 sm:my-8 border-stone-400" />

        {/* Bottom Text */}
        <div className="text-center text-stone-400 text-sm sm:text-base font-normal font-['Mulish']">
          © 2021 Watches. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;