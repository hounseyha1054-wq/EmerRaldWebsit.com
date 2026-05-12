import React from 'react';
import bgImage from '../assets/hero.png';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark Elegant Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
        
        {/* Small Tagline */}
        <div className="mb-6">
          <p className="inline-block px-6 py-2 text-emerald-300 text-sm tracking-[4px] font-medium border border-emerald-800/50 rounded-full backdrop-blur-sm">
            PHNOM PENH • CAMBODIA
          </p>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif tracking-tighter text-white leading-none mb-4">
          EMERALD
        </h1>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tighter text-emerald-400 -mt-3 mb-8">
          BISTRO
        </h2>

        {/* Subtitle */}
        <p className="max-w-2xl text-xl md:text-2xl text-gray-300 font-light tracking-wide mb-12">
          Where timeless luxury meets unforgettable dining
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-950/50 hover:shadow-emerald-600/40">
            BOOK A TABLE
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button className="px-10 py-5 border-2 border-white/70 hover:border-white text-white text-lg font-medium rounded-full transition-all duration-300 backdrop-blur-sm">
            VIEW MENU
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-emerald-300/70 text-xs tracking-widest">
          <span>SCROLL TO DISCOVER</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-emerald-300/50 to-transparent"></div>
        </div>
      </div>

      {/* Subtle Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Hero;