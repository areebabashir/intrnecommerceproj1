import React from 'react';
import female from '../assets/femaleh.png';
import a from '../assets/1.png';
import b from '../assets/2.png';  
import c from '../assets/3.png';
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="w-full h-screen min-h-[500px] max-h-[1000px] relative bg-stone-200 overflow-hidden">

      {/* ========== Desktop Layout ========== */}
      <div className="hidden md:block">
        {/* Main female image */}
        <img
          className="w-[32.3vw] h-[32.3vw] min-w-[280px] min-h-[280px] max-w-[620px] max-h-[620px] absolute left-[18.5vw] top-[2%] rounded-bl-[41.7vw] rounded-br-[41.7vw] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] object-cover"
          src={female}
          alt="main"
        />

        {/* Title text */}
        <div className="absolute text-center text-stone-800 font-bold font-serif">
          <div className="text-[4.17vw] left-[48.75vw] italic top-[2%] absolute">Litkovska</div>
          <div className="text-[4.17vw] left-[57.6vw] italic top-[8.18vw] absolute">Collection</div>
        </div>

        {/* Left decorative line */}
        <div className="w-[49.6vw] h-0 left-[12.73vw] top-[49.48vw] absolute origin-top-left -rotate-90 outline outline-1 outline-offset-[-0.5px] outline-stone-400" />

        {/* Left side images */}
        <div className="left-[10.5vw] top-[18.23vw] absolute inline-flex flex-col justify-start items-center gap-[1.26vw]">
          <img className="w-[2.5vw] h-[2.5vw] min-w-[70px] min-h-[70px] max-w-[90px] max-h-[90px] rounded-full border border-stone-400 object-cover" src={a} alt="circle1" />
          <img className="w-[2.5vw] h-[2.5vw] min-w-[70px] min-h-[70px] max-w-[90px] max-h-[90px] rounded-full border border-stone-400 object-cover" src={b} alt="circle2" />
          <img className="w-[2.5vw] h-[2.5vw] min-w-[70px] min-h-[70px] max-w-[90px] max-h-[90px] rounded-full border border-stone-400 object-cover" src={c} alt="circle3" />
        </div>

        {/* Right decorative line */}
        <div className="w-[21.27vw] h-0 left-[88.65vw] top-[49.48vw] absolute origin-top-left -rotate-90 outline outline-1 outline-offset-[-0.5px] outline-stone-400" />

        {/* Social Media Icons */}
        <div className="left-[87vw] top-[28.33vw] absolute backdrop-blur-[2px] inline-flex flex-col justify-start items-start gap-[0.26vw]">
          <div className="p-[0.9vw] bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-stone-400 hover:bg-gray-50 transition-colors cursor-pointer">
            <FaFacebookF className="w-[2.25vw] h-[2.25vw] text-stone-800" />
          </div>
          <div className="p-[0.9vw] bg-neutral-50 rounded-full outline outline-1 outline-offset-[-1px] outline-stone-400 hover:bg-gray-100 transition-colors cursor-pointer">
            <FaGithub className="w-[2.25vw] h-[2.25vw] text-stone-800" />
          </div>
          <div className="p-[0.9vw] bg-neutral-50 rounded-full outline outline-1 outline-offset-[-1px] outline-stone-400 hover:bg-gray-100 transition-colors cursor-pointer">
            <FaLinkedinIn className="w-[2.25vw] h-[2.25vw] text-stone-800" />
          </div>
        </div>

        {/* Decorative ear image */}
        <img 
          className="w-[7vw] h-[7vw] min-w-[280px] min-h-[280px] max-w-[196px] max-h-[196px] left-[50.78vw] top-[18.39vw] absolute rounded-full object-cover" 
          src={female} 
          alt="ear" 
        />

        {/* See More button */}
        <div className="w-[5.33vw] min-w-[150px] max-w-[200px] px-[0.92vw] py-[0.29vw] left-[61.15vw] top-[14.23vw] absolute bg-orange-600 inline-flex justify-center items-center rounded-full hover:bg-orange-700 transition-colors cursor-pointer">
          <div className="text-white text-[0.83vw] font-medium capitalize">See More</div>
        </div>
      </div>

      {/* ========== Mobile Layout ========== */}
      <div className="block md:hidden relative w-full h-full pt-10 px-6 text-center">
        {/* Centered Image */}
        <img
          className="w-[70vw] max-w-[320px] mx-auto rounded-full object-cover shadow-lg"
          src={female}
          alt="main"
        />

        {/* Title */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold font-serif italic text-stone-800">Litkovska</h1>
          <h2 className="text-3xl font-bold font-serif italic text-stone-800 mt-1">Collection</h2>
        </div>

        {/* See More Button */}
        <div className="mt-6">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors text-sm">
            See More
          </button>
        </div>

        {/* Social Media Icons */}
        
      </div>
    </div>
  );
};

export default Hero;
