import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-zinc-950 border-b border-emerald-900/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
            E
          </div>
          <div>
            <h1 className="text-2xl font-serif tracking-wider text-white">EMERALD</h1>
            <p className="text-[10px] text-emerald-400 -mt-1 tracking-[2px]">BISTRO</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 relative group">
            HOME
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all"></span>
          </a>
          <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 relative group">
            RESERVATIONS
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all"></span>
          </a>
          <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 relative group">
            MENU
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all"></span>
          </a>
          <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 relative group">
            CONTACT
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all"></span>
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-all duration-300 shadow-lg shadow-emerald-900/50 hover:shadow-emerald-600/50">
            BOOK A TABLE
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6h12v12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-emerald-900/50">
          <div className="flex flex-col px-6 py-8 space-y-6 text-lg font-medium text-gray-300">
            <a href="#" className="hover:text-emerald-400 transition-colors">HOME</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">RESERVATIONS</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">MENU</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">CONTACT</a>
            
            <div className="pt-4 border-t border-emerald-900/50">
              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all">
                BOOK A TABLE
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;