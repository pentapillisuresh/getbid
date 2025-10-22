import React, { useState } from 'react';
import { FileText, Award, CheckCircle } from 'lucide-react';
import EvaluationModal from '../popup/EvaluationModal';
import TechnicalReportModal from '../popup/TechnicalReportModal';
import FinancialReportModal from '../popup/FinancialReportModal';

const BidEvaluation = () => {
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [technicalModalOpen, setTechnicalModalOpen] = useState(false);
  const [financialModalOpen, setFinancialModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [evaluationType, setEvaluationType] = useState('technical');

  const tenders = [
    {
      id: 'TND2024001',
      title: 'Highway Construction Project Phase 2',
      status: 'Technical Evaluation',
      statusColor: 'bg-orange-100 text-orange-700',
      bidsReceived: 12,
      closedDate: '15/04/2024',
      estValue: '₹25.0 Cr',
      technicalStatus: 'in-progress',
      financialStatus: 'pending',
      approved: 0,
      disqualified: 0,
      awarded: 0,
      pending: 2,
      bids: [
        {
          id: 'BID001',
          vendorName: 'BuildMax Infrastructure Ltd',
          contactPerson: 'Amit Patel',
          bidAmount: '₹24.5 Cr',
          technicalScore: 0,
          financialScore: 0,
          submittedDate: '10/04/2024',
          status: 'pending',
          documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile']
        },
        {
          id: 'BID002',
          vendorName: 'Steel & Concrete Solutions',
          contactPerson: 'Priya Singh',
          bidAmount: '₹23.8 Cr',
          technicalScore: 0,
          financialScore: 0,
          submittedDate: '12/04/2024',
          status: 'pending',
          documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile']
        }
      ]
    },
    {
      id: 'TND2024002',
      title: 'School Building Construction',
      status: 'Financial Evaluation',
      statusColor: 'bg-blue-100 text-blue-700',
      bidsReceived: 8,
      closedDate: '20/03/2024',
      estValue: '₹8.5 Cr',
      technicalStatus: 'completed',
      financialStatus: 'in-progress',
      approved: 2,
      disqualified: 1,
      awarded: 0,
      pending: 0,
      bids: [
        {
          id: 'BID003',
          vendorName: 'Modern Constructions',
          bidAmount: '₹8.2 Cr',
          technicalScore: 85,
          financialScore: 0,
          submittedDate: '15/03/2024',
          status: 'technical-approved',
          documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile']
        },
        {
          id: 'BID004',
          vendorName: 'BuildTech Solutions',
          bidAmount: '₹8.0 Cr',
          technicalScore: 82,
          financialScore: 0,
          submittedDate: '18/03/2024',
          status: 'technical-approved',
          documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile']
        }
      ]
    },
    {
      id: 'TND2024003',
      title: 'Water Treatment Plant Upgrade',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      bidsReceived: 6,
      closedDate: '10/02/2024',
      estValue: '₹12.0 Cr',
      technicalStatus: 'completed',
      financialStatus: 'completed',
      approved: 1,
      disqualified: 0,
      awarded: 1,
      pending: 0,
      bids: [
        {
          id: 'BID005',
          vendorName: 'AquaTech Industries',
          bidAmount: '₹11.5 Cr',
          technicalScore: 92,
          financialScore: 88,
          submittedDate: '05/02/2024',
          status: 'awarded',
          documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile']
        }
      ]
    }
  ];

  const stats = [
    {
      label: 'Total Evaluations',
      value: '3',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Technical Phase',
      value: '1',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Financial Phase',
      value: '1',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Completed',
      value: '1',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-50'
    }
  ];

  const handleEvaluateBids = (tender, type = 'technical') => {
    setCurrentEvaluation(tender);
    setEvaluationType(type);
    setEvaluationModalOpen(true);
  };

  const handleTechnicalReport = (tender) => {
    setCurrentEvaluation(tender);
    setTechnicalModalOpen(true);
  };

  const handleFinancialReport = (tender) => {
    setCurrentEvaluation(tender);
    setFinancialModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bid Evaluation</h1>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Evaluations</option>
              <option>Technical Phase</option>
              <option>Financial Phase</option>
              <option>Completed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FileText className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {tenders.map((tender) => (
            <div key={tender.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{tender.title}</h2>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${tender.statusColor}`}>
                      {tender.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span>ID: {tender.id}</span>
                    <span>Bids Received: {tender.bidsReceived}</span>
                    <span>Closed: {tender.closedDate}</span>
                    <span>Est. Value: {tender.estValue}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${tender.technicalStatus === 'completed' ? 'bg-green-500' : tender.technicalStatus === 'in-progress' ? 'bg-orange-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm text-gray-700">Technical Evaluation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${tender.financialStatus === 'completed' ? 'bg-green-500' : tender.financialStatus === 'in-progress' ? 'bg-orange-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm text-gray-700">Financial Evaluation</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Approved: {tender.approved}
                    </span>
                    <span className="text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Disqualified: {tender.disqualified}
                    </span>
                    <span className="text-blue-600 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Awarded: {tender.awarded}
                    </span>
                    <span className="text-orange-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending: {tender.pending}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleTechnicalReport(tender)}
                      className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded text-sm font-medium hover:bg-orange-100"
                    >
                      Technical Report
                    </button>
                    <button
                      onClick={() => handleFinancialReport(tender)}
                      className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded text-sm font-medium hover:bg-blue-100"
                    >
                      Financial Report
                    </button>
                    <button className="px-4 py-1.5 bg-green-50 text-green-700 rounded text-sm font-medium hover:bg-green-100">
                      Full Report
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => {
                      if (tender.title === 'Highway Construction Project Phase 2') {
                        handleEvaluateBids(tender, 'technical');
                      } else if (tender.technicalStatus === 'completed') {
                        handleEvaluateBids(tender, 'financial');
                      } else {
                        handleEvaluateBids(tender, 'technical');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                  >
                    <FileText className="w-4 h-4" />
                    Evaluate Bids
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Manage Q&A
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {evaluationModalOpen && currentEvaluation && (
        <EvaluationModal
          tender={currentEvaluation}
          evaluationType={evaluationType}
          onClose={() => setEvaluationModalOpen(false)}
        />
      )}

      {technicalModalOpen && currentEvaluation && (
        <TechnicalReportModal
          tender={currentEvaluation}
          onClose={() => setTechnicalModalOpen(false)}
        />
      )}

      {financialModalOpen && currentEvaluation && (
        <FinancialReportModal
          tender={currentEvaluation}
          onClose={() => setFinancialModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BidEvaluation;
