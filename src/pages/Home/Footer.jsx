function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">GenMall</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              GenMall is a cloud-based project to developing country-led globally cutting edge platforms where we connect buyers and sellers through our e-marketplace, e-auction and reverse auction.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                f
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                in
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                ▶
              </a>
            </div>
          </div>

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

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 GenMall. All rights reserved.</p>
          <div className="flex gap-6">
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
