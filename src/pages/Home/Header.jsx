import React from 'react';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  return (
    <header className=" bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
          
           <img src="/images/getlogo.png" alt="E-Tendering Logo" style={{width:"100px"}} />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-[#FD9A00] transition-colors duration-200">
              Features
            </a>
            <a href="#plans" className="text-gray-700 hover:text-[#FD9A00] transition-colors duration-200">
              Plans
            </a>
            <a href="#contact" className="text-gray-700 hover:text-[#FD9A00] transition-colors duration-200">
              Contact
            </a>
            <button className="bg-[#FD9A00] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-105">
              Login
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <Menu className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;