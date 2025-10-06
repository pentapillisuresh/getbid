import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Building2, IndianRupee, Calendar } from 'lucide-react';
import VerifyBidPopup from './VerifyBidPopup';

const SubmitBidPopup = ({ tender, onClose }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTimeline, setDeliveryTimeline] = useState('');
  const [techProposal, setTechProposal] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [quotationFile, setQuotationFile] = useState(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedFinancial, setAgreedFinancial] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  const quotationFileRef = useRef(null);

  const companyDocs = [
    { id: 1, name: 'Company Registration Certificate.pdf', selected: true },
    { id: 2, name: 'Tax Registration.pdf', selected: true },
    { id: 3, name: 'ISO Certifications.pdf', selected: true },
    { id: 4, name: 'Audited Financial Statements.pdf', selected: true },
    { id: 5, name: 'Company Profile.pdf', selected: true },
    { id: 6, name: 'Previous Project References.pdf', selected: true },
  ];

  const [documents, setDocuments] = useState(companyDocs);

  const toggleDocument = (id) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, selected: !doc.selected } : doc
    ));
  };

  const handleFileUpload = (file) => {
    setQuotationFile(file);
  };

  const handleQuotationFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only PDF or Excel files');
        return;
      }

      handleFileUpload(file);
    }
  };

  const triggerQuotationUpload = () => {
    quotationFileRef.current?.click();
  };

  const handleProceedToVerify = () => {
    setShowVerifyPopup(true);
  };

  const handleVerifyClose = () => {
    setShowVerifyPopup(false);
  };

  const handleVerifySubmit = () => {
    // Handle successful verification
    setShowVerifyPopup(false);
    onClose();
  };

  const selectedDocCount = documents.filter(doc => doc.selected).length;
  const isFormValid = bidAmount && deliveryTimeline && techProposal && quotationFile && agreedTerms && agreedFinancial;

  // Create bid data for verification popup
  const bidData = {
    tender: tender?.title || 'Highway Construction Project Phase II',
    bidAmount: bidAmount,
    timeline: deliveryTimeline,
    email: 'john.smith@techcorp.com'
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[97vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Submit Bid</h2>
              <p className="text-gray-600 text-sm mt-1">{tender?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[80vh]">
            <div className="p-6 space-y-8">
              {/* Company Information */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Company Information (Auto-filled from Profile)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <div className="font-semibold text-gray-900">TechCorp Ltd.</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Registration:</span>
                    <div className="font-semibold text-gray-900">TC-2019-001</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact Person:</span>
                    <div className="font-semibold text-gray-900">John Smith</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-semibold text-blue-600">john.smith@techcorp.com</div>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Contract Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estimated Contract Value:</span>
                    <div className="font-bold text-green-600 text-xl">{tender?.estimatedValue}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tender Category:</span>
                    <div className="font-semibold text-gray-900">{tender?.category}</div>
                  </div>
                </div>
              </div>

              {/* Bid Form */}
              <div className="space-y-6">
                {/* Bid Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Bid Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">
                      Note: Your bid amount must be below the estimated contract value of {tender?.estimatedValue}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your competitive bid amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Delivery Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Timeline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={deliveryTimeline}
                      onChange={(e) => setDeliveryTimeline(e.target.value)}
                      placeholder="e.g., 30 days, 3 months, etc."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Technical Proposal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Proposal Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={techProposal}
                    onChange={(e) => setTechProposal(e.target.value)}
                    placeholder="Brief description of your technical approach and solution..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  ></textarea>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{techProposal.length}/500 characters</span>
                  </div>
                </div>

                {/* Quotation Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Quotation <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Upload your detailed quotation file (visible to client)</p>
                  <div
                    onClick={triggerQuotationUpload}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Choose Quotation File</p>
                    <p className="text-xs text-gray-500 mt-1">Supported: PDF, Excel (.xls, .xlsx) • Max 10MB</p>
                    {quotationFile && (
                      <div className="mt-2 text-xs text-green-600 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {quotationFile.name}
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={quotationFileRef}
                    onChange={handleQuotationFileChange}
                    accept=".pdf,.xls,.xlsx"
                    className="hidden"
                  />
                </div>

                {/* Document Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Documents from Your Profile <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            id={`doc-${doc.id}`}
                            checked={doc.selected}
                            onChange={() => toggleDocument(doc.id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <FileText className="w-4 h-4 text-blue-600" />
                          <label htmlFor={`doc-${doc.id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                            {doc.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-green-600 mt-3 font-medium">
                      Selected: {selectedDocCount} documents
                    </p>
                  </div>
                </div>

                {/* File Requirements */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-3">File Upload Requirements</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <span>• Quotation: Detailed pricing breakdown with line items</span>
                      {!quotationFile && <span className="text-red-600 text-xs">❌ Required</span>}
                      {quotationFile && <span className="text-green-600 text-xs">✅ Uploaded</span>}
                    </li>
                    <li>• Format: PDF or Excel files only (.pdf, .xls, .xlsx)</li>
                    <li>• Size Limit: Maximum 10MB per file</li>
                    <li>• Visibility: Quotation file will be visible to the client during evaluation</li>
                    <li>• Important: Files will be verified for completeness during evaluation</li>
                  </ul>
                </div>

                {/* Agreements */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="financial-agreement"
                      checked={agreedFinancial}
                      onChange={(e) => setAgreedFinancial(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 mt-1"
                    />
                    <div>
                      <label htmlFor="financial-agreement" className="text-sm font-medium text-red-800 cursor-pointer">
                        Financial Responsibility Agreement:
                      </label>
                      <p className="text-xs text-red-700 mt-1">
                        I acknowledge that this bidding portal is not responsible for any financial disputes, payment delays, or contractual issues between client and vendor. All financial matters are to be resolved directly between the contracting parties.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-agreement"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="terms-agreement" className="text-sm text-gray-700 cursor-pointer">
                      I accept all terms and conditions of the tender document and confirm that our company meets all eligibility criteria. I understand that false information may lead to disqualification. I also confirm that the uploaded quotation file is accurate and complete.
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                {!isFormValid && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Please complete all required fields
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!isFormValid}
                  onClick={handleProceedToVerify}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${isFormValid
                    ? 'bg-primary hover:bg-blue-700 text-white transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  proceed to verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVerifyPopup && (
        <VerifyBidPopup
          bidData={bidData}
          onClose={handleVerifyClose}
          onSubmit={handleVerifySubmit}
        />
      )}
    </>
  );
};

export default SubmitBidPopup;
