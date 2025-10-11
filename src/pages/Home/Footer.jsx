import React from "react";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Replace with your actual logo image if you have one */}
              <img src="images/logo.jpeg" alt="GetBid Logo" className="w-20 h-20 object-contain" />
              <h3 className="text-2xl font-bold">GetBid</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              GetBid is your trusted partner in tendering success. We provide cutting-edge technology and expert guidance to help private companies and contractors win more tenders and grow their business.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Support</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-4">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Tender Search</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Bid Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Compliance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Analytics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Training</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 GetBid. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap">
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
