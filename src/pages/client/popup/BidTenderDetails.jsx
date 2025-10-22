import React from 'react';
import { ArrowLeft, Download, Bookmark, Share2, CheckCircle, FileText, Phone, Mail } from 'lucide-react';

const BidTenderDetails = ({ tender, onBack }) => {
  const tenderData = {
    title: 'Construction of 4-Lane Highway from Mumbai to Pune',
    organization: 'Maharashtra State Road Development Corporation',
    location: 'Mumbai, Maharashtra',
    value: '₹25.0Cr',
    id: tender.id,
    status: 'Under Evaluation',
    statusColor: 'bg-yellow-100 text-yellow-700',
    category: 'Infrastructure',
    published: '15/01/2024',
    closes: '28/02/2024',
    timeRemaining: 'Expired',
    contact: {
      name: 'Mr. Rajesh Kumar',
      designation: 'Chief Engineer',
      phone: '+91-9876543210',
      email: 'rajesh.kumar@msrdc.gov.in'
    },
    description: 'This tender is for the construction of a modern 4-lane highway connecting Mumbai to Pune. The project includes construction of bridges, toll plazas, service roads, and related infrastructure. The contractor will be responsible for design, construction, and maintenance for the first 2 years.',
    technicalSpecs: 'The highway will be constructed as per IRC specifications with concrete pavement, steel reinforcement, and modern drainage systems. Detailed technical specifications are available in the tender document.',
    eligibility: [
      'Minimum 10 years experience in highway construction',
      'Annual turnover of at least ₹100 crores in last 3 years',
      'Valid contractor license and ISO certifications',
      'Previous experience in similar highway projects',
      'Financial capability to handle projects worth ₹200+ crores'
    ],
    timeline: [
      {
        step: 1,
        title: 'Tender Publication',
        description: 'Tender notice published and documents available for download',
        date: '15/01/2024'
      },
      {
        step: 2,
        title: 'Pre-bid Meeting',
        description: 'Clarification meeting with potential bidders',
        date: '05/02/2024'
      },
      {
        step: 3,
        title: 'Bid Submission Deadline',
        description: 'Last date for online bid submission',
        date: '28/02/2024'
      },
      {
        step: 4,
        title: 'Technical Bid Opening',
        description: 'Technical evaluation of submitted bids',
        date: '02/03/2024'
      },
      {
        step: 5,
        title: 'Financial Bid Opening',
        description: 'Financial bid opening for qualified bidders',
        date: '10/03/2024'
      }
    ],
    documents: [
      'Technical Specifications Document',
      'Financial Bid Format',
      'Eligibility Criteria Details',
      'Site Survey Report',
      'Environmental Clearance Requirements'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{tenderData.title}</h1>
              <p className="text-gray-600 mb-4">{tenderData.organization}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                  {tenderData.status === 'Open' ? 'Open' : 'Under Evaluation'}
                </span>
                <span className="text-sm text-gray-600">ID: {tenderData.id}</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">{tenderData.category}</span>
                <span className={`px-3 py-1 rounded text-sm font-medium ${tenderData.timeRemaining === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {tenderData.timeRemaining}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{tenderData.value}</div>
              <div className="text-sm text-gray-600">{tenderData.location}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
              <p className="text-gray-700 leading-relaxed">{tenderData.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h2>
              <p className="text-gray-700 leading-relaxed">{tenderData.technicalSpecs}</p>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h2>
              <ul className="space-y-3">
                {tenderData.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h2>
              <div className="space-y-4">
                {tenderData.timeline.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {item.step}
                      </div>
                      {item.step < tenderData.timeline.length && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  Download Tender Document
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Bookmark className="w-4 h-4" />
                  Save to Favorites
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                  Share Tender
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Key Dates</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Published</div>
                  <div className="font-semibold text-gray-900">{tenderData.published}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Closes</div>
                  <div className="font-semibold text-red-600">{tenderData.closes}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Time Remaining</div>
                  <div className="font-semibold text-red-600">{tenderData.timeRemaining}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-gray-900">{tenderData.contact.name}</div>
                  <div className="text-sm text-gray-600">{tenderData.contact.designation}</div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{tenderData.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{tenderData.contact.email}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Required Documents</h3>
              <ul className="space-y-2">
                {tenderData.documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-2">Tender Under Evaluation</h3>
              <p className="text-sm text-gray-600 text-center">
                Bids are currently being evaluated by the committee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidTenderDetails;
