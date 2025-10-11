import React from 'react';
import { BarChart3, Target, TrendingUp, Layout, FileText, Zap } from 'lucide-react';

const AnalyticsReporting = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-600 font-semibold mb-3">Data-Driven Insights</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Analytics & Reporting Solutions
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Transform your tendering performance with powerful analytics and comprehensive reporting. Make data-driven decisions to improve your success rate and optimize your bidding strategy.
            </p>
            <div className="flex gap-4">
              <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
                View Analytics
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
                Explore Features
              </button>
            </div>
          </div>
          <div>
            <img
              src="/images/ana1.jpg"
              alt="Analytics Dashboard"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Powerful Analytics Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Analytics Features</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Gain deep insights into your tendering performance with comprehensive analytics and intelligent reporting tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-xl">
              <div className="bg-cyan-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h3>
              <p className="text-gray-700 leading-relaxed">
                Track key performance indicators including win rates, bid success ratios, and revenue generated from government contracts.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Analysis</h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive market intelligence with competitor analysis, tender trends, and opportunity identification across sectors.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trend Analysis</h3>
              <p className="text-gray-700 leading-relaxed">
                Identify emerging trends in government spending, tender patterns, and market opportunities to stay ahead of your competition.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Layout className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Dashboards</h3>
              <p className="text-gray-700 leading-relaxed">
                Create personalized dashboards with the metrics that matter most to your business and decision-making process.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Reports</h3>
              <p className="text-gray-700 leading-relaxed">
                Generate comprehensive reports automatically with customizable templates for stakeholders and management reviews.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <div className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Predictive Analytics</h3>
              <p className="text-gray-700 leading-relaxed">
                Use AI-powered predictions to forecast tender outcomes, identify high-probability opportunities, and optimize resource allocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Analytics Dashboard */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Analytics Dashboard</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Get a complete view of your tendering performance with our intuitive and powerful analytics dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-cyan-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Win Rate Analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track your success rate across different tender categories and identify improvement opportunities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Revenue Tracking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitor contract values, revenue growth, and financial performance from government tenders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Timeline Analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Analyze bid preparation times, submission patterns, and deadline management efficiency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Layout className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Performance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Evaluate team productivity, workload distribution, and individual contribution metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Make Smarter Decisions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/ana2.jpg"
                alt="Data Analytics"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Make Smarter Decisions</h2>

              <div className="flex gap-4">
                <div className="bg-teal-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Data-Driven Strategy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transform raw data into actionable insights that drive better bidding strategies and improved success rates.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Identify Opportunities</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Spot emerging market trends and high-value opportunities before your competitors do.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Optimize Performance</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Continuously improve your processes based on performance analytics and benchmarking data.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Executive Reporting</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Generate professional reports for stakeholders with key metrics and strategic recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Start Making Data-Driven Decisions</h2>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            Unlock the power of analytics to transform your tendering performance and achieve better results.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              View Demo
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsReporting;
