import React from 'react';
import { FileText, Lock, Users, Share2, Edit3, Cloud, FolderOpen, CheckCircle, Globe, Mail } from 'lucide-react';
import Header from "../../pages/Home/Header";
import Footer from "../../pages/Home/Footer";

const DocumentManagement = () => {
  return (
    <section>
      <Header />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-purple-600 font-semibold mb-3">Secure Document Solutions</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Document Management System
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Secure, organized, and accessible document management for all your tendering needs. Store, share, and collaborate on tender documents with enterprise-grade security.
            </p>
            <div className="flex gap-4">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                Start Managing
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
                View Features
              </button>
            </div>
          </div>
          <div>
            <img
              src="/images/doc1.jpg"
              alt="Document Management"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Advanced Document Management */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Document Management</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Streamline your document workflows with powerful organization, security, and collaboration features designed for tendering professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <FolderOpen className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Organization</h3>
              <p className="text-gray-700 leading-relaxed">
                Automatically categorize and organize documents by tender, project, or client with powerful search capabilities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Lock className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-700 leading-relaxed">
                Bank-level encryption, secure controls, and audit trails ensure your sensitive documents are protected at all times.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Version Control</h3>
              <p className="text-gray-700 leading-relaxed">
                Track document changes, maintain version history, and prevent conflicts with advanced version control and change tracking.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Share2 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Sharing</h3>
              <p className="text-gray-700 leading-relaxed">
                Share documents securely with team members, partners, or clients with granular access controls and permissions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <div className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Edit3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborative Editing</h3>
              <p className="text-gray-700 leading-relaxed">
                Work together on documents in real-time with collaborative editing, comments, and team insights throughout the bidding process.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-xl">
              <div className="bg-cyan-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Cloud className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cloud Storage</h3>
              <p className="text-gray-700 leading-relaxed">
                Access your documents from anywhere with secure cloud storage, automatic backups, and unlimited scalability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manage All Document Types */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Manage All Document Types</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our system handles every type of document you need for successful tendering processes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tender Documents</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                RFPs, RFQs, bid documents, addenda, and all official tender documentation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proposals & Bids</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Technical proposals, pricing documents, and supporting documentation for submissions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certificates</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Insurance policies, compliance documents, and qualification proofs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Documents</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Balance sheets, financial statements, and other financial documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Security */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Enterprise-Grade Security</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Your sensitive tender documents deserve the highest level of protection. Our security measures ensure complete confidentiality and integrity.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="text-white" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">256-bit Encryption</h4>
                    <p className="text-gray-600 text-sm">
                      Your documents are encrypted both in transit and at rest using military-grade encryption.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Role-Based Access</h4>
                    <p className="text-gray-600 text-sm">
                      Granular permissions ensure only authorized personnel can access sensitive documents.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Complete Audit Trail</h4>
                    <p className="text-gray-600 text-sm">
                      Track every action, download, and edit with comprehensive audit logs of who accessed, modified, or shared documents.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Cloud className="text-white" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Compliance Ready</h4>
                    <p className="text-gray-600 text-sm">
                      Meet all industry and regulatory compliance requirements with built-in security controls.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/images/doc2.jpg"
                alt="Security"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Streamlined Document Workflow */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Streamlined Document Workflow</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              From upload to approval, our workflow ensures efficient document management throughout your tendering process.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload & Organize</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop documents in bulk, upload with automatic categorization, and smart tagging.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Review & Collaborate</h3>
              <p className="text-gray-600 leading-relaxed">
                Team members can review, comment, and collaborate on documents in real-time with integrated editing tools.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Approve & Finalize</h3>
              <p className="text-gray-600 leading-relaxed">
                Structured approval workflows ensure documents are reviewed and approved before submission.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share & Submit</h3>
              <p className="text-gray-600 leading-relaxed">
                Securely share approved documents with stakeholders or submit directly to tendering portals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Integrations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Connect with your existing tools and government portals for a unified document management experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Government Portals</h3>
              <p className="text-gray-600 leading-relaxed">
                Direct integration with major government tendering portals for seamless document submission and status updates.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl text-center">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Office Suite</h3>
              <p className="text-gray-600 leading-relaxed">
                Native integration with Microsoft Office, Google Workspace, and other productivity tools for seamless editing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl text-center">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email & Communication</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrate with email systems and communications tools for automated notifications and document sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Secure Your Documents Today</h2>
          <p className="text-purple-100 text-lg mb-8 leading-relaxed">
            Join thousands of businesses who trust our platform to manage their critical tender documents securely and efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
              Request Demo
            </button>
          </div>
        </div>
      </section>
    </div>
      <Footer/>
    </section>
  );
};

export default DocumentManagement;
