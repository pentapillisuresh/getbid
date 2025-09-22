import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
           <img src="/images/getbidlogo.jpeg" alt="E-Tendering Logo" style={{width:"100px"}} />
              
            
            </div>
            <p className="text-gray-400">
              Transforming procurement with transparent, secure, and efficient digital tendering solutions.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FD9A00]">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Why Choose Us</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Vendor Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FD9A00]">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FD9A00]">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-[#FD9A00] transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 getbid E-Tendering Portal. All rights reserved. | Secure • Transparent • Efficient</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;