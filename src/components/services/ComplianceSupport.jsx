import React from 'react';
import { ShieldCheck, FileCheck, Award, AlertCircle, CheckCircle, Users, Briefcase, DollarSign, ClipboardCheck, Scale ,HeadphonesIcon} from 'lucide-react';

const ComplianceSupport = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-orange-600 font-semibold mb-3">Regulatory Compliance Made Easy</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Compliance Support Services
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Navigate complex government regulations with confidence. Our compliance experts ensure your bids meet all requirements and regulatory standards for successful tender submissions.
            </p>
            <div className="flex gap-4">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
                Get Compliance Help
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
                Learn More
              </button>
            </div>
          </div>
          <div>
            <img
              src="/images/sup1.jpg"
              alt="Compliance Office"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Comprehensive Compliance Solutions */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Compliance Solutions</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Stay compliant with ever-changing government regulations and tender requirements with our expert guidance and automated compliance tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Regulatory Compliance</h3>
              <p className="text-gray-700 leading-relaxed">
                Stay updated with latest government regulations, compliance standards, and requirements across all departments and jurisdictions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <FileCheck className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Document Verification</h3>
              <p className="text-gray-700 leading-relaxed">
                Automated verification of all required documents, licenses, and supporting materials before bid submission to prevent rejections.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Certification Management</h3>
              <p className="text-gray-700 leading-relaxed">
                Track and manage all business certifications, licenses, insurance policies, and renewal reminders and compliance deadlines.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Compliance Audits</h3>
              <p className="text-gray-700 leading-relaxed">
                Regular compliance audits and assessments to identify potential issues and ensure adherence to regulatory requirements.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <div className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive risk and obligation analysis to identify compliance risks and protect your business interests.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl">
              <div className="bg-teal-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Consultation</h3>
              <p className="text-gray-700 leading-relaxed">
                Access to compliance experts and legal professionals for complex tender queries and specialized guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Compliance Areas */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Compliance Areas</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We cover all critical compliance areas to ensure your business meets government tendering requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Briefcase className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business Registration</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Company registration, tax identification, and legal business registrations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <DollarSign className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Compliance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Financial reporting, insurance coverage, and government contract requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ClipboardCheck className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Standards</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ISO certifications, quality management, and industry-specific standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Scale className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Labor Compliance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Employment laws, labor standards, and workforce requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Compliance Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Compliance Process</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              A systematic approach to ensure complete compliance with all government tendering requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compliance Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive review of your current compliance status and identification of gaps or requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Action Plan</h3>
              <p className="text-gray-600 leading-relaxed">
                Develop a detailed action plan with timelines and priorities to achieve full compliance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Implementation</h3>
              <p className="text-gray-600 leading-relaxed">
                Execute compliance measures with expert guidance and support throughout the process.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ongoing Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Ongoing monitoring and maintenance to ensure continued compliance with changing regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Compliance Matters */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/sup2.jpg"
                alt="Compliance Team"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Compliance Matters</h2>

              <div className="flex gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Avoid Disqualification</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Ensure your bids are never rejected due to compliance issues or missing documentation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scale className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Reduce Legal Risks</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Minimize potential legal issues with our compliance and risk management approach.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Advantage</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Stand out from competitors with superior compliance records and certifications.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Faster Approvals</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Streamlined approval processes with complete and accurate compliance documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Compliance Experts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Compliance Experts</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Work with experienced professionals who understand government regulations and compliance requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl text-center">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Scale className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Experts</h3>
              <p className="text-gray-600 leading-relaxed">
                Qualified legal professionals with deep expertise in government contract compliance law.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Industry Specialists</h3>
              <p className="text-gray-600 leading-relaxed">
                Sector-specific experts who understand the unique compliance requirements of different industries.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl text-center">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <HeadphonesIcon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Personal consultants assigned to provide ongoing support and answer your compliance guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ensure Perfect Compliance Today</h2>
          <p className="text-orange-100 text-lg mb-8 leading-relaxed">
            Don't let compliance issues prevent you from winning government contracts. Get expert help to ensure your business meets all requirements.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Compliance Support
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition">
              Speak to Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComplianceSupport;
