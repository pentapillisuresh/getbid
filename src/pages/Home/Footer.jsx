import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo2.png" alt="GetBid Logo" className="w-24 h-auto" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mb-4">
              GetBid is your trusted partner in tendering success. We provide cutting-edge technology 
              and expert guidance to help private companies and contractors win more tenders and grow their business.
            </p>
            
            {/* Social Links - Exact same as image */}
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="/services/tendersearch" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Tender Search
                </a>
              </li>
              <li>
                <a href="/services/bid-management" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Bid Management
                </a>
              </li>
              <li>
                <a href="/services/compliancesupport" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Compliance Support
                </a>
              </li>
              <li>
                <a href="/services/analytics-reporting" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Analytics
                </a>
              </li>
              <li>
                <a href="/services/training-support" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Training
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300 text-sm">© 2025 GetBid. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Website Builder
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;