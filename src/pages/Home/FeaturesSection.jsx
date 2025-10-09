function FeaturesSection() {
  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-400 rounded"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Customer Care</h3>
            <p className="text-gray-600 leading-relaxed">
              GenMall is an organization dedicated to help Indian companies with comprehensive solutions for their procurement needs.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-10 bg-blue-600 rounded-t-full"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Fee</h3>
            <p className="text-gray-600 leading-relaxed">
              Optimizing bidding processes to increase efficiency and reduce procurement costs
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Top Industry Specialist</h3>
            <p className="text-gray-600 leading-relaxed">
              We are a top-tier bidding and sourcing a huge gateway with access to a large network of vendors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
