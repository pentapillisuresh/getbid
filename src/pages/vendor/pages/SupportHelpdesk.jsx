import React, { useState } from "react";
import {
  HeadphonesIcon,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Plus,
  Send,
  Paperclip,
  User,
  Calendar,
} from "lucide-react";

const SupportHelpdesk = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);

  const tabs = [
    {
      id: "tickets",
      label: "Support Tickets",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    { id: "faq", label: "FAQ", icon: <FileText className="w-4 h-4" /> },
    {
      id: "contact",
      label: "Contact Support",
      icon: <HeadphonesIcon className="w-4 h-4" />,
    },
  ];

  const supportTickets = [
    {
      id: "TKT-2024-001",
      subject: "Unable to upload documents for tender submission",
      description:
        "Getting error message when trying to upload PDF files for the highway construction tender. Files are under 10MB size limit.",
      status: "open",
      priority: "high",
      category: "Technical",
      createdDate: "2024-04-14 10:30",
      lastUpdate: "2024-04-14 14:20",
      assignedTo: "Tech Support Team",
      messages: 3,
    },
    {
      id: "TKT-2024-002",
      subject: "Payment gateway issue during subscription renewal",
      description:
        "Transaction failed multiple times while trying to renew starter pack subscription. Money debited but subscription not activated.",
      status: "in-progress",
      priority: "high",
      category: "Billing",
      createdDate: "2024-04-13 15:45",
      lastUpdate: "2024-04-14 09:15",
      assignedTo: "Billing Support Team",
      messages: 5,
    },
    {
      id: "TKT-2024-003",
      subject: "Question about bid evaluation timeline",
      description:
        "Need clarification on when bid evaluation results will be published for the medical equipment procurement tender.",
      status: "resolved",
      priority: "medium",
      category: "General",
      createdDate: "2024-04-12 11:20",
      lastUpdate: "2024-04-13 16:30",
      assignedTo: "Customer Success Team",
      messages: 2,
    },
    {
      id: "TKT-2024-004",
      subject: "Profile verification status query",
      description:
        "Submitted all required documents but verification status still shows pending. Need update on timeline.",
      status: "resolved",
      priority: "medium",
      category: "Account",
      createdDate: "2024-04-10 09:15",
      lastUpdate: "2024-04-12 14:45",
      assignedTo: "Verification Team",
      messages: 4,
    },
  ];

  const faqItems = [
    {
      category: "Account & Registration",
      questions: [
        {
          question: "How do I register as a vendor on the platform?",
          answer:
            'To register as a vendor, click on "Register" and choose "Vendor/Supplier". Fill in your company details, upload required documents like company registration, GST certificate, and PAN card. Complete the verification process to start bidding on tenders.',
        },
        {
          question: "What documents are required for vendor verification?",
          answer:
            "Required documents include: Company Registration Certificate, GST Registration Certificate, PAN Card, Bank Account Statement, and relevant industry certifications or licenses. All documents should be clear, valid, and in PDF format.",
        },
        {
          question: "How long does the verification process take?",
          answer:
            "The verification process typically takes 2-3 business days. You will receive email notifications at each stage. If additional documents are needed, our team will contact you directly.",
        },
      ],
    },
    {
      category: "Bidding Process",
      questions: [
        {
          question: "How do I submit a bid for a tender?",
          answer:
            'Browse available tenders, click "View Details" on the tender you\'re interested in, review all requirements, prepare your technical and financial proposals, and click "Submit Bid" before the deadline. Ensure all required documents are uploaded.',
        },
        {
          question: "Can I modify my bid after submission?",
          answer:
            "Bids cannot be modified after the submission deadline. However, if the tender is still open and you haven't reached your submission limit, you can submit a revised bid. The latest submission will be considered for evaluation.",
        },
        {
          question: "What happens after I submit a bid?",
          answer:
            "After submission, you'll receive a confirmation email. Your bid will go through technical evaluation first, followed by financial evaluation. You'll be notified of the results at each stage through email and dashboard notifications.",
        },
      ],
    },
    {
      category: "Payment & Subscriptions",
      questions: [
        {
          question: "What are the different subscription plans available?",
          answer:
            "We offer three plans: Basic (5 tenders - ₹5,000), Starter Pack (5 tenders - ₹7,000 with enhanced features), and Pro Pack (10 tenders - ₹13,000 with premium features). All plans include full tender access and support.",
        },
        {
          question: "Can I upgrade my subscription plan?",
          answer:
            "Yes, you can upgrade your plan at any time. The remaining credits from your current plan will be adjusted, and you'll pay the difference for the new plan. Contact support for assistance with upgrades.",
        },
        {
          question: "What payment methods are accepted?",
          answer:
            "We accept all major payment methods including credit cards, debit cards, net banking, UPI, and digital wallets. All transactions are secured with 256-bit SSL encryption.",
        },
      ],
    },
  ];

  const contactInfo = [
    {
      type: "Phone Support",
      details: "+91 1800-123-4567",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      icon: <Phone className="w-6 h-6 text-green-600" />,
      description: "Call us for immediate assistance with urgent issues",
    },
    {
      type: "Email Support",
      details: "support@etenderportal.com",
      hours: "Response within 24 hours",
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      description: "Send us detailed queries and get comprehensive responses",
    },
    {
      type: "Live Chat",
      details: "Available on website",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      description: "Chat with our support team for quick assistance",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-block px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "open":
        return `${baseClasses} bg-orange-100 text-orange-600`;
      case "in-progress":
        return `${baseClasses} bg-blue-100 text-blue-600`;
      case "resolved":
        return `${baseClasses} bg-green-100 text-green-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses =
      "inline-block px-2 py-1 rounded-full text-xs font-medium";

    switch (priority) {
      case "high":
        return `${baseClasses} bg-red-100 text-red-600`;
      case "medium":
        return `${baseClasses} bg-yellow-100 text-yellow-600`;
      case "low":
        return `${baseClasses} bg-blue-100 text-blue-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const stats = [
    {
      label: "Open Tickets",
      value: "2",
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
    },
    {
      label: "Avg Response Time",
      value: "2.5h",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Resolution Rate",
      value: "94%",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Total Tickets",
      value: "8",
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support & Helpdesk
          </h1>
          <p className="text-gray-600">Get help and support for your queries</p>
        </div>
        {activeTab === "tickets" && (
          <button
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-900">
                Create Support Ticket
              </h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Technical</option>
                    <option>Billing</option>
                    <option>Account</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Medium</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="6"
                  placeholder="Provide detailed information about your issue..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">Max file size: 10MB</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4 flex-shrink-0">
              <button
                onClick={() => setShowNewTicket(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewTicket(false)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Support Tickets */}
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="card border-l-4 border-primary-500 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-full bg-gray-50">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          #{ticket.id}
                        </h3>
                        <span className={getPriorityBadge(ticket.priority)}>
                          {ticket.priority}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          {ticket.category}
                        </span>
                      </div>

                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {ticket.subject}
                      </h4>
                      <p className="text-gray-600 mb-4">{ticket.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {ticket.createdDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Last Update: {ticket.lastUpdate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Assigned to: {ticket.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {ticket.messages} messages
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                    <MessageSquare className="w-4 h-4" />
                    View Conversation
                  </button>

                  <div className="flex items-center gap-2">
                    {ticket.status === "resolved" ? (
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Mark as Helpful
                      </button>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Add Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQ..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          {faqItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => (
                  <details
                    key={questionIndex}
                    className="group border border-gray-200 rounded-lg"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                      <h4 className="font-medium text-gray-900">
                        {item.question}
                      </h4>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-6">
          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-center mb-4">{contact.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {contact.type}
                </h3>
                <p className="text-primary-600 font-medium mb-1">
                  {contact.details}
                </p>
                <p className="text-sm text-gray-600 mb-3">{contact.hours}</p>
                <p className="text-sm text-gray-500">{contact.description}</p>
                <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  {contact.type.includes("Phone")
                    ? "Call Now"
                    : contact.type.includes("Email")
                    ? "Send Email"
                    : "Start Chat"}
                </button>
              </div>
            ))}
          </div>

          {/* Quick Contact Form */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Quick Contact Form
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of your query"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your query or issue..."
                ></textarea>
                <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Support Hours
                </h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
                  </p>
                  <p>
                    <strong>Saturday:</strong> 10:00 AM - 4:00 PM
                  </p>
                  <p>
                    <strong>Sunday:</strong> Closed
                  </p>
                  <p className="text-blue-600 mt-2">
                    <strong>Emergency Support:</strong> Available 24/7 for
                    critical issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportHelpdesk;
