import React from 'react';
import { BookOpen, Users, Award, TrendingUp, Wrench, HeadphonesIcon } from 'lucide-react';
import Header from "../../pages/Home/Header";
import Footer from "../../pages/Home/Footer";

const TrainingSupport = () => {
  return (
    <section>
      <Header />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-600 font-semibold mb-3">Expert Knowledge Transfer</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Training & Support Services
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Master government tendering with comprehensive training and ongoing support. Build your team's expertise and confidence in navigating complex tender processes.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start Learning
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
                View Programs
              </button>
            </div>
          </div>
          <div>
            <img
              src="/images/tra1.jpg"
              alt="Training Session"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Comprehensive Training Programs */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Training Programs</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              From beginner basics to advanced strategies, our training programs cover every aspect of government tendering.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fundamentals Course</h3>
              <p className="text-gray-700 leading-relaxed">
                Learn the basics of government tendering, understanding tender documentation, eligibility criteria, and submission processes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bid Writing Workshop</h3>
              <p className="text-gray-700 leading-relaxed">
                Master the art of writing compelling bids with proven frameworks that deliver results from industry experts.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Compliance Training</h3>
              <p className="text-gray-700 leading-relaxed">
                Understand regulatory requirements, compliance standards, and best practices for government contract participation.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Strategies</h3>
              <p className="text-gray-700 leading-relaxed">
                Advanced techniques for competitive bidding, pricing strategies, and winning that secure maximum success.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Wrench className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Training</h3>
              <p className="text-gray-700 leading-relaxed">
                Hands-on training on using our tendering platform, tools, and features to maximize your efficiency and success.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <div className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <HeadphonesIcon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ongoing Support</h3>
              <p className="text-gray-700 leading-relaxed">
                Continuous support with regular updates, Q&A sessions, and access to our expert consultation team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flexible Learning Options */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Flexible Learning Options</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Choose the learning format that works best for your team and schedule.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="text-white" size={28} />
              </div>
              <div className="text-center">
                <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold">Popular</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Online Courses</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Self-paced online courses with video lessons, interactive modules, and downloadable resources.
                </p>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> 24/7 Access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Video Tutorials
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Certificate of Completion
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="text-white" size={28} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Workshops</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Interactive live sessions with expert instructors and real-time Q&A opportunities.
                </p>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Expert Instruction
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Live Q&A Sessions
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Networking Opportunities
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Award className="text-white" size={28} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Training</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Customized on-site or virtual programs designed specifically for your organization.
                </p>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Customized Content
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Flexible Schedule
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Team Building
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Support Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Support Services</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Beyond training, we provide ongoing support to ensure your continued success in government tendering.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <HeadphonesIcon className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Help Desk</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Round-the-clock technical support and assistance for all of your tendering platform needs.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">✓</span> Email Support
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">✓</span> Live Chat Assistance
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">✓</span> Remote Screen Sharing
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Consultation</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                One-on-one consultations with tendering experts for strategic guidance and advice on complex tenders.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span> Strategy Review
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span> Document Review
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span> Bid Optimization
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resource Library</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Comprehensive library of templates, guides, and best practices for successful government tendering.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span> Bid Templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span> Compliance Checklists
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span> Industry Guides
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Regular Webinars</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Monthly webinars covering latest trends, regulatory updates, and advanced tendering strategies.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">✓</span> Industry Updates
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">✓</span> Expert Presentations
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">✓</span> Q&A Sessions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Training Success Stories */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Training Success Stories</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              See how our training programs have transformed businesses and improved their tendering success rates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">400% Increase in Win Rate</h4>
                    <p className="text-gray-600 text-sm mb-2">After completing our advanced training program</p>
                    <p className="text-gray-700 leading-relaxed">
                      "Our team's confidence in government tendering has grown significantly. The comprehensive training transformed our approach to bid writing and helped boost our success rate dramatically."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">B</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">90% faster Bid Preparation</h4>
                    <p className="text-gray-600 text-sm mb-2">With platform training and tools</p>
                    <p className="text-gray-700 leading-relaxed">
                      "The platform training was invaluable. We now prepare and submit bids in half the time compared to before, freeing up our team to focus on bid quality and strategy."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Enhanced Team Confidence</h4>
                    <p className="text-gray-600 text-sm mb-2">Through comprehensive training programs</p>
                    <p className="text-gray-700 leading-relaxed">
                      "Our team feels equipped to tackle any tender. The expert-led workshops and continuous support have been game-changers, fostering expertise and knowledge for success."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/images/tra2.jpg"
                alt="Success Team"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Invest in Your Team's Success</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Empower your team with the knowledge and skills needed to excel in government tendering. Start your training journey today.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Explore Courses
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              Contact Training Team
            </button>
          </div>
        </div>
      </section>
    </div>
      <Footer/>
    </section>
  );
};

export default TrainingSupport;
