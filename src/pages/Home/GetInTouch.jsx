import React from "react";
import { Phone, Mail, MapPin, Send, Star } from "lucide-react";

function CTASection() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold mb-2">Get In Touch</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Tendering Success?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Contact our expert team today and discover how GenMall can help you win more tenders and grow your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600">+91-8287117152</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">contact@genmall.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600">
                    A-06, Sector 60,<br/>
                    Noida, Uttar Pradesh<br/>
                    India 201301
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-purple-600 to-green-600 rounded-2xl p-8 text-white">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300" /> Ready to Get Started?
              </h4>
              <p className="mb-6">Join thousands of successful bidders and transform your procurement process today!</p>
              <div className="flex gap-4 flex-wrap">
                <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  View Plans
                </button>
                <button className="bg-purple-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-800 transition">
                  Login
                </button>
              </div>
            </div>
          </div>

          {/* Message Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your phone"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-green-700 transition w-full flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTASection;
