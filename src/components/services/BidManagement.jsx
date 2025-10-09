import React from 'react';
import { Briefcase, Users, Calendar, FileText, DollarSign, BarChart3, CheckSquare, Zap } from 'lucide-react';

const BidManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-green-600 font-semibold mb-3">Complete Bid Lifecycle Management</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Bid Management System
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Streamline your entire bidding process from opportunity identification to contract award. Manage multiple bids efficiently with our comprehensive bid management platform.
            </p>
            <div className="flex gap-4">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Start Managing Bids
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
                Explore Features
              </button>
            </div>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Bid Management Dashboard"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Comprehensive Bid Management */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Bid Management</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              From concept to contract award, our platform covers every aspect of the bidding process with precision and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bid Planning & Strategy</h3>
              <p className="text-gray-700 leading-relaxed">
                Create comprehensive bid strategies with risk assessment, resource allocation, and go/no-go automated workflows and decision frameworks.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
              <p className="text-gray-700 leading-relaxed">
                Coordinate with team members, track progress, assign tasks, and ensure everyone stays aligned throughout the bidding process.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Calendar className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deadline Management</h3>
              <p className="text-gray-700 leading-relaxed">
                Never miss a deadline with automated reminders, milestone tracking, and critical path analysis for all your active bids.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Document Assembly</h3>
              <p className="text-gray-700 leading-relaxed">
                Automatically compile bid documents from your template library and integrate seamlessly with your company database. Ensure consistency and completeness in every bid.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <div className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing & Costing</h3>
              <p className="text-gray-700 leading-relaxed">
                Built-in pricing tools with cost calculators, margin analysis, and competitive pricing strategies to optimize your bid values for success.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl">
              <div className="bg-teal-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                Monitor bid success rates, analyze win/loss opportunities, and gain comprehensive performance analytics with dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Streamlined Bid Workflow */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Streamlined Bid Workflow</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our systematic approach ensures no detail is missed and every bid is submitted on time with maximum quality.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Opportunity Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Evaluate tender requirements, assess your capabilities, and make data-driven go/no-go decisions with structured analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bid Planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Create detailed project plans, assign team roles, set milestones, and establish timelines for bid preparation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Content Development</h3>
              <p className="text-gray-600 leading-relaxed">
                Develop technical proposals, pricing strategies, and supporting documents with collaborative editing tools.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Review & Submit</h3>
              <p className="text-gray-600 leading-relaxed">
                Final quality checks, compliance verification, and secure submission through government portals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Maximize Your Bid Success Rate */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Successful Team"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Maximize Your Bid Success Rate</h2>

              <div className="flex gap-4">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">40% Higher Win Rate</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Structured bid processes and quality controls significantly improve your chances of winning government contracts.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">60% Faster Bid Preparation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Templates, automation, and collaboration tools reduce bid preparation time while maintaining high quality standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Improved Team Collaboration</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Enhanced communication and task management ensure all team members stay aligned and productive throughout the bid lifecycle.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Zero Missed Deadlines</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Automated reminders and milestone tracking ensure you never miss a critical submission date or deadline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Bid Management Tools */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Bid Management Tools</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Everything you need to manage successful bids in one integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Kanban Board Management</h3>
                  <p className="text-gray-600 mb-3">
                    Visual project management with Kanban boards to track bid progress at a glance.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span> Custom workflow stages
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span> Task assignment and tracking
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span> Progress visualization
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Template Library</h3>
                  <p className="text-gray-600 mb-3">
                    Pre-built templates for common bid documents, proposals, and compliance requirements to speed up bid preparation.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center">
                      <span className="text-blue-600 mr-2">✓</span> Industry-specific templates
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-600 mr-2">✓</span> Customizable content
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-600 mr-2">✓</span> Version control
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cost Calculator</h3>
                  <p className="text-gray-600 mb-3">
                    Advanced pricing tools with cost estimation, margin analysis, and competitive pricing to develop winning bid strategies.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center">
                      <span className="text-purple-600 mr-2">✓</span> Cost breakdown
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-600 mr-2">✓</span> Margin optimization
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-600 mr-2">✓</span> Scenario analysis
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Compliance Checker</h3>
                  <p className="text-gray-600 mb-3">
                    Automated compliance verification to ensure all bid requirements are met before submission.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center">
                      <span className="text-orange-600 mr-2">✓</span> Requirement tracking
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 mr-2">✓</span> Document completeness check
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 mr-2">✓</span> Pre-submission validation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Bidding Process Today</h2>
          <p className="text-green-100 text-lg mb-8 leading-relaxed">
            Join successful businesses who have improved their win rates and streamlined their bid management with our platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BidManagement;
