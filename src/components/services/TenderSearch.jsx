import { Search, Filter, Bell, Database, Bookmark, TrendingUp, File, Phone, Mail } from 'lucide-react'
import Header from "../../pages/Home/Header";
import Footer from "../../pages/Home/Footer";

function TenderSearch() {
  return (

    <section>
      <Header />
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <p className="text-blue-600 font-medium text-sm">Advanced Search Technology</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Tender Search &<br />Discovery Solutions
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Discover government tenders with our powerful search engine. Find the right opportunities faster with advanced filters, real-time alerts, and comprehensive tender database.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Mockup */}
         {/* Right Image Section */}
<div className="relative">
  <div className="rounded-2xl overflow-hidden shadow-2xl transform lg:scale-105">
    <img
      src="/images/tender1.jpg" // <-- replace with your image path
      alt="Dashboard Preview"
      className="w-full h-auto object-cover"
    />
  </div>
</div>

        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Search Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our advanced tender search system helps you find the most relevant opportunities with precision and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-blue-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Search Algorithm</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered search engine understands your business needs and delivers highly relevant tender matches based on your industry, location, and capabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Filters</h3>
              <p className="text-gray-600 leading-relaxed">
                Narrow down results by industry, location, department, category, deadline, and more. Save your filter preferences for quick access to relevant opportunities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant notifications when new tenders matching your criteria are published. Never miss an opportunity with our customizable alert system.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-orange-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Database</h3>
              <p className="text-gray-600 leading-relaxed">
                Access tenders from central government, state governments, PSUs, and local bodies. Our platform covers major tendering authorities across India.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-red-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save & Organize</h3>
              <p className="text-gray-600 leading-relaxed">
                Bookmark interesting tenders, create custom lists, and organize opportunities by priority. Streamline your personalized tender pipeline efficiently.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-cyan-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Market Intelligence</h3>
              <p className="text-gray-600 leading-relaxed">
                Get insights into tender trends, competition analysis, and market opportunities. Make informed decisions with our comprehensive market data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Our Search Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, powerful, and efficient - discover tenders in just a few clicks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Set Your Criteria</h3>
              <p className="text-gray-600">
                Define your search parameters including industry, location, tender value, and keywords to match your business capabilities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Matching</h3>
              <p className="text-gray-600">
                Our intelligent algorithm scans millions of tenders and presents the most relevant opportunities based on your profile.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Review & Analyze</h3>
              <p className="text-gray-600">
                Access detailed tender information, documents, eligibility criteria, and competition analysis to make informed decisions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Take Action</h3>
              <p className="text-gray-600">
                Save interesting tenders, set reminders for deadlines, and proceed with bid preparation using our integrated tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Why Choose Our Search Platform?
              </h2>

              <div className="space-y-6">
                {/* Benefit 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Save 80% Search Time</h4>
                    <p className="text-gray-600">
                      Our automated search and filtering system reduces manual effort, letting you focus on bid preparation instead of finding tenders.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Higher Success Rate</h4>
                    <p className="text-gray-600">
                      Find tenders that perfectly match your capabilities and experience, increasing your chances of winning contracts.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Verified Information</h4>
                    <p className="text-gray-600">
                      All tender information is verified and updated in real-time from official government sources for accuracy and reliability.
                    </p>
                  </div>
                </div>

                {/* Benefit 4 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Pan-India Coverage</h4>
                    <p className="text-gray-600">
                      Access tenders from all states, union territories, and central government departments in one unified platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
          <div className="relative">
  <div className="rounded-2xl overflow-hidden shadow-2xl transform lg:scale-105">
    <img
      src="/images/tender2.jpg" // <-- replace with your image path
      alt="Dashboard Preview"
      className="w-full h-auto object-cover"
    />
  </div>
</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Discover Your Next Opportunity?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses who trust our platform to find the right government tenders.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
   
    </div>
      <Footer/>
    </section>
  )
}

export default TenderSearch
