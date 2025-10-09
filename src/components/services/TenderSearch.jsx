import { Search, Filter, Bell, Database, Bookmark, TrendingUp, File, Phone, Mail } from 'lucide-react'

function TenderSearch() {
  return (
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
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl shadow-2xl p-8 transform lg:scale-105">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded px-3 py-1 text-xs text-gray-600">Dashboard</div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="bg-blue-100 rounded p-2 flex-1 h-16"></div>
                    <div className="bg-green-100 rounded p-2 flex-1 h-16"></div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 space-y-2">
                    <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                    <div className="h-2 bg-blue-200 rounded w-1/2"></div>
                    <div className="h-2 bg-blue-200 rounded w-5/6"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-purple-50 rounded p-2 h-12"></div>
                    <div className="bg-pink-50 rounded p-2 h-12"></div>
                  </div>
                </div>
              </div>
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
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-2xl p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-blue-500 rounded-lg h-32"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-green-400 rounded-lg h-15"></div>
                      <div className="bg-purple-400 rounded-lg h-15"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-orange-300 rounded-lg h-20"></div>
                    <div className="bg-cyan-300 rounded-lg h-20"></div>
                    <div className="bg-pink-300 rounded-lg h-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                  </div>
                </div>
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
      <footer className="bg-gray-900 text-gray-300 px-6 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">E-Tendering Portal</span>
            </div>
            <p className="text-sm leading-relaxed">
              Advanced tender search and discovery platform helping businesses find the right government opportunities with AI-powered matching and real-time alerts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Bid Management</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Document Management</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Login</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 91001 55553</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@etenderingportal.tech</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>E-Tendering Portal © 2024 | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}

export default TenderSearch
