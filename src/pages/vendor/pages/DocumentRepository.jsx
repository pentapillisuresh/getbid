import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Search,
  FolderOpen,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import UploadDocumentModal from "../popups/UploadDocumentModal";
import ViewDocumentModal from "../popups/ViewDocumentModal";
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";

const DocumentRepository = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Company Registration Certificate",
      type: "certificates",
      size: "2.4 MB",
      format: "PDF",
      uploadDate: "2024-01-15",
      lastModified: "2024-01-15",
      status: "active",
      expiryDate: "2025-01-15",
      description:
        "Official company registration certificate from Registrar of Companies",
      tags: ["registration", "legal", "mandatory"],
      isShared: true,
    },
    {
      id: 2,
      name: "GST Registration Certificate",
      type: "certificates",
      size: "1.8 MB",
      format: "PDF",
      uploadDate: "2024-01-15",
      lastModified: "2024-01-15",
      status: "active",
      expiryDate: "2025-01-15",
      description: "GST registration and tax compliance certificate",
      tags: ["gst", "tax", "compliance"],
      isShared: true,
    },
    {
      id: 3,
      name: "Highway Construction Proposal",
      type: "proposals",
      size: "15.6 MB",
      format: "PDF",
      uploadDate: "2024-04-10",
      lastModified: "2024-04-12",
      status: "active",
      expiryDate: null,
      description: "Technical and financial proposal for highway project",
      tags: ["proposal", "construction", "highway"],
      isShared: false,
    },
    {
      id: 4,
      name: "IT Infrastructure Quotation",
      type: "proposals",
      size: "8.2 MB",
      format: "PDF",
      uploadDate: "2024-04-08",
      lastModified: "2024-04-09",
      status: "active",
      expiryDate: null,
      description: "Detailed quotation for government IT infrastructure setup",
      tags: ["quotation", "it", "infrastructure"],
      isShared: false,
    },
    {
      id: 5,
      name: "Medical Equipment Contract",
      type: "contracts",
      size: "3.7 MB",
      format: "PDF",
      uploadDate: "2024-04-14",
      lastModified: "2024-04-14",
      status: "active",
      expiryDate: "2025-04-14",
      description: "Signed contract for medical equipment supply",
      tags: ["contract", "medical", "equipment"],
      isShared: true,
    },
    {
      id: 6,
      name: "Annual Financial Statement",
      type: "financial",
      size: "6.3 MB",
      format: "PDF",
      uploadDate: "2024-03-31",
      lastModified: "2024-03-31",
      status: "active",
      expiryDate: null,
      description: "Audited financial statements for FY 2023-24",
      tags: ["financial", "audit", "annual"],
      isShared: false,
    },
    {
      id: 7,
      name: "ISO 9001 Certificate",
      type: "certificates",
      size: "1.2 MB",
      format: "PDF",
      uploadDate: "2024-01-20",
      lastModified: "2024-01-20",
      status: "expiring",
      expiryDate: "2024-06-30",
      description: "ISO 9001:2015 quality management system certificate",
      tags: ["iso", "quality", "certification"],
      isShared: true,
    },
    {
      id: 8,
      name: "Technical Specifications",
      type: "technical",
      size: "12.8 MB",
      format: "PDF",
      uploadDate: "2024-04-05",
      lastModified: "2024-04-07",
      status: "active",
      expiryDate: null,
      description: "Detailed technical specifications for project requirements",
      tags: ["technical", "specifications", "requirements"],
      isShared: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch documents from API and normalize shape
    handleRefreshDocuments();
  }, []);

  const handleRefreshDocuments = async () => {
    (async () => {
      try {
        setIsLoading(true);
        const resp = await api.get("/v1/documents");
        const items = (resp && resp.data) || [];
        const mapped = items.map((d) => {
          const fileObj = d.file && typeof d.file === "object" ? d.file : null;
          const fileName = fileObj ? fileObj.fileName : d.fileName || "";
          const format = fileName
            ? (fileName.split(".").pop() || "").toUpperCase()
            : "";
          return {
            id: d._id,
            name: d.name || "",
            // map API category label to internal type keys
            type:
              d.category === "Legal Documents"
                ? "certificates"
                : d.category === "Financial Documents"
                ? "financial"
                : d.category === "Technical Documents"
                ? "technical"
                : d.category === "Marketing Materials"
                ? "proposals"
                : d.category === "Experience Documents"
                ? "contracts"
                : d.type || "certificates",
            size: d.size || "",
            format: format,
            uploadDate: d.createdAt ? d.createdAt.split("T")[0] : "",
            lastModified: d.updatedAt ? d.updatedAt.split("T")[0] : "",
            status: "active",
            expiryDate: d.expiryDate ? d.expiryDate.split("T")[0] : null,
            description: d.description || "",
            tags: Array.isArray(d.tags) ? d.tags : [],
            isShared: false,
            fileId: fileObj ? fileObj._id : d.file || null,
            fileName: fileName,
            fileUrl: fileObj ? fileObj.url : null,
          };
        });
        setDocuments(mapped);
      } catch (err) {
        console.error("Failed to load documents", err);
        toastService.showError(
          (err && err.message) || "Failed to load documents"
        );
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const categories = [
    { value: "all", label: "All Categories", count: documents.length },
    {
      value: "certificates",
      label: "Legal Documents",
      count: documents.filter((d) => d.type === "certificates").length,
    },
    {
      value: "proposals",
      label: "Proposals",
      count: documents.filter((d) => d.type === "proposals").length,
    },
    {
      value: "contracts",
      label: "Contracts",
      count: documents.filter((d) => d.type === "contracts").length,
    },
    {
      value: "financial",
      label: "Financial Documents",
      count: documents.filter((d) => d.type === "financial").length,
    },
    {
      value: "technical",
      label: "Technical Documents",
      count: documents.filter((d) => d.type === "technical").length,
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const name = (doc.name || "").toString();
    const description = (doc.description || "").toString();
    const tags = Array.isArray(doc.tags) ? doc.tags : [];
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(lowerSearch) ||
      description.toLowerCase().includes(lowerSearch) ||
      tags.some((tag) =>
        (tag || "").toString().toLowerCase().includes(lowerSearch)
      );

    const matchesCategory =
      selectedCategory === "all" || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (format) => {
    const fmt = (format || "").toString().toLowerCase();
    switch (fmt) {
      case "pdf":
        return <FileText className="w-8 h-8 text-primary-500" />;
      default:
        return <FileText className="w-8 h-8 text-secondary-400" />;
    }
  };

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleUploadDocument = (newDocument) => {
    // Normalize fields: newDocument may come from the API create response or local form
    const document = {
      id: newDocument._id || newDocument.id || Date.now(),
      name: newDocument.name || "Untitled Document",
      // map API category label back to internal type keys if needed
      type:
        newDocument.category === "Legal Documents"
          ? "certificates"
          : newDocument.category === "Financial Documents"
          ? "financial"
          : newDocument.category === "Technical Documents"
          ? "technical"
          : newDocument.category === "Marketing Materials"
          ? "proposals"
          : newDocument.category === "Experience Documents"
          ? "contracts"
          : newDocument.type || "certificates",
      size:
        newDocument.size ||
        (newDocument.file
          ? newDocument.file.size
            ? `${(newDocument.file.size / (1024 * 1024)).toFixed(1)} MB`
            : ""
          : ""),
      format:
        newDocument.format ||
        (newDocument.fileName || "").split(".").pop().toUpperCase(),
      uploadDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      status: "active",
      expiryDate: newDocument.expiryDate || null,
      description: newDocument.description || "",
      tags: Array.isArray(newDocument.tags)
        ? newDocument.tags
        : newDocument.tags
        ? newDocument.tags.split(",").map((t) => t.trim())
        : [],
      isShared: false,
      fileId: newDocument.file || newDocument.file?._id || null,
      fileName: newDocument.fileName || null,
    };
    setDocuments([...documents, document]);
    setShowUploadModal(false);
  };

  const handleUpdateDocument = (updatedDocument) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === updatedDocument.id ? updatedDocument : doc
      )
    );
  };

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
    setShowViewModal(false);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  Document Repository
                </h1>
                <p className="text-primary-600 font-medium">
                  Manage your business documents and certifications
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary-600" />
              <span className="text-secondary-600">5 Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-secondary-600">1 Pending</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>All Categories</option>
              <option>Legal Documents</option>
              <option>Financial Documents</option>
              <option>Technical Documents</option>
            </select>
            <select className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Expired</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-primary-500 text-white"
                    : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="bg-white rounded-lg p-6 text-center">
            Loading documents...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer"
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.format)}
                      <div>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            doc.status === "active"
                              ? "bg-primary-50 text-primary-600"
                              : doc.status === "expiring"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {doc.status === "expiring"
                            ? "Verified"
                            : doc.status === "expired"
                            ? "Expired"
                            : "Verified"}
                        </span>
                      </div>
                    </div>
                    <button className="p-1 text-secondary-400 hover:text-secondary-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    {doc.description || ""}
                  </p>

                  <div className="space-y-2 text-xs text-secondary-500 mb-4">
                    <div className="flex justify-between">
                      <span>
                        {categories.find((c) => c.value === doc.type)?.label ||
                          doc.type}
                      </span>
                      <span className="font-medium">{doc.size || ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded: {doc.uploadDate}</span>
                      {doc.expiryDate && (
                        <span className="font-medium text-red-600">
                          Expires: {doc.expiryDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(doc.tags) ? doc.tags : []).map(
                      (tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No documents found
            </h3>
            <p className="text-secondary-500 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Upload your first document to get started"}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Upload Document
            </button>
          </div>
        )}

        {/* Modals */}
        {showUploadModal && (
          <UploadDocumentModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUploadDocument}
          />
        )}

        {showViewModal && selectedDocument && (
          <ViewDocumentModal
            isOpen={showViewModal}
            onRefreshDocuments={handleRefreshDocuments}
            onClose={() => setShowViewModal(false)}
            document={selectedDocument}
            onUpdate={handleUpdateDocument}
            onDelete={handleDeleteDocument}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentRepository;
