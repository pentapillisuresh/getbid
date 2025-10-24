// src/components/popups/TenderFormModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Upload, X, FileText, Trash2, FolderOpen } from "lucide-react";
import {
  createTender,
  updateTender,
  amendTender,
} from "../../../services/tenderApiService";
import toastService from "../../../services/toastService";

const TenderFormModal = ({
  show,
  onClose,
  onSubmit,
  user,
  editMode = false,
  amendMode = false,
  tenderData = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    estimatedValue: "",
    deadline: "",
    description: "",
    eligibility: [""],
    specifications: "",
    locationScope: "",
    preBidMeeting: false,
    meetingDate: "",
    venue: "",
    state: "",
    district: "",
    projectAddress: "",
    contactPerson: "",
    contactNumbers: "",
    createdBy: "",
    userType: "",
    supportingDocuments: [],
  });

  // File picker state
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-fill user info and tender data when modal opens
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        createdBy: user.name || "—",
        userType: user.type || "—",
      }));
    }

    // If editing or amending, populate form with existing data
    if ((editMode || amendMode) && tenderData) {
      setFormData((prev) => ({
        ...prev,
        title: tenderData.title || "",
        category: tenderData.category || "",
        estimatedValue: tenderData.value?.toString() || "",
        deadline: tenderData.bidDeadline
          ? new Date(tenderData.bidDeadline).toISOString().split("T")[0]
          : "",
        description: tenderData.description || "",
        eligibility:
          tenderData.eligibilityCriteria?.length > 0
            ? tenderData.eligibilityCriteria
            : [""],
        specifications: tenderData.technicalSpecifications || "",
        locationScope: tenderData.locationScope || "",
        preBidMeeting: !!(tenderData.meetingDate && tenderData.meetingVenue),
        meetingDate: tenderData.meetingDate
          ? new Date(tenderData.meetingDate).toISOString().split("T")[0]
          : "",
        venue: tenderData.meetingVenue || "",
        state: tenderData.state || "",
        district: tenderData.district || "",
        projectAddress: tenderData.address || "",
        contactPerson: tenderData.contactPerson || "",
        contactNumbers: tenderData.contactNumber || "",
        supportingDocuments:
          tenderData.documents?.map((doc) => {
            // Handle both string IDs and document objects
            if (typeof doc === "string") {
              return { _id: doc, fileName: "Document", url: "#" };
            }
            return doc;
          }) || [],
      }));
    } else if (show && !editMode && !amendMode) {
      // Reset form for new tender
      setFormData({
        title: "",
        category: "",
        estimatedValue: "",
        deadline: "",
        description: "",
        eligibility: [""],
        specifications: "",
        locationScope: "",
        preBidMeeting: false,
        meetingDate: "",
        venue: "",
        state: "",
        district: "",
        projectAddress: "",
        contactPerson: "",
        contactNumbers: "",
        createdBy: user?.name || "—",
        userType: user?.type || "—",
        supportingDocuments: [],
      });
    }
  }, [user, show, editMode, amendMode, tenderData]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCriteriaChange = (index, value) => {
    const updated = [...formData.eligibility];
    updated[index] = value;
    setFormData({ ...formData, eligibility: updated });
  };

  const addCriteria = () => {
    setFormData({ ...formData, eligibility: [...formData.eligibility, ""] });
  };

  // File handling functions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFileSelection(droppedFiles);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleFileSelection(selectedFiles);
    }
  };

  const handleFileSelection = (newFiles) => {
    const maxFiles = 10;
    const maxFileSize = 25 * 1024 * 1024; // 25MB
    const acceptedTypes = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".jpg",
      ".jpeg",
      ".png",
    ];

    const validFiles = [];
    const errors = [];

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large. Maximum size is 25MB.`);
        return;
      }

      // Check file type
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        errors.push(`${file.name} is not a supported file type.`);
        return;
      }

      // Check if file already exists
      const existingFileName = file.name;
      if (
        formData.supportingDocuments.some((existingFile) => {
          const currentFileName = existingFile.name || existingFile.fileName;
          return currentFileName === existingFileName;
        })
      ) {
        errors.push(`${file.name} is already selected.`);
        return;
      }

      validFiles.push(file);
    });

    // Check total file count
    if (formData.supportingDocuments.length + validFiles.length > maxFiles) {
      errors.push(
        `Maximum ${maxFiles} files allowed. Currently selected: ${formData.supportingDocuments.length}`
      );
    } else {
      const updatedFiles = [...formData.supportingDocuments, ...validFiles];
      setFormData((prev) => ({ ...prev, supportingDocuments: updatedFiles }));
    }

    // Show errors if any
    if (errors.length > 0) {
      alert(errors.join("\n"));
    }
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = formData.supportingDocuments.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({ ...prev, supportingDocuments: updatedFiles }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let response;

      if (editMode && tenderData?._id) {
        // Update existing tender
        response = await updateTender(tenderData._id, formData);
      } else if (amendMode && tenderData?._id) {
        // Amend existing tender
        response = await amendTender(tenderData._id, formData);
      } else {
        // Create new tender
        response = await createTender(formData);
      }

      // Call the parent onSubmit callback with the response
      if (onSubmit) {
        onSubmit(response);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting tender:", error);
      toastService.showError(
        error.message ||
          `Failed to ${
            editMode ? "update" : amendMode ? "amend" : "create"
          } tender. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{ marginTop: "0px" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {editMode
              ? "Edit Tender"
              : amendMode
              ? "Amend Tender"
              : "Create New Tender"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {/* Tender Creator Info */}
        <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex justify-between items-center flex-shrink-0">
          <div>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold text-blue-800">Created by:</span>{" "}
              {formData.createdBy}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold text-blue-800">User Type:</span>{" "}
              {formData.userType}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tender Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                placeholder="Enter tender title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Construction">Construction</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estimated Value (₹) *
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter estimated value"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bid Submission Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                rows="3"
                placeholder="Enter detailed description"
                required
              />
            </div>

            {/* Location & Contact Information */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Location & Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter district"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Address *
                </label>
                <textarea
                  name="projectAddress"
                  value={formData.projectAddress}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter complete project address"
                  rows="2"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Numbers *
                  </label>
                  <input
                    type="text"
                    name="contactNumbers"
                    value={formData.contactNumbers}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter contact numbers (e.g., +91-9876543210)"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Eligibility Criteria
              </h3>
              {formData.eligibility.map((crit, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={crit}
                    onChange={(e) =>
                      handleCriteriaChange(index, e.target.value)
                    }
                    className="mt-1 flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter eligibility criteria"
                  />
                  {formData.eligibility.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.eligibility.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, eligibility: updated });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addCriteria}
                className="text-sm text-primary-600 hover:underline"
              >
                + Add Another Criteria
              </button>
            </div>

            {/* Technical Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Technical Specifications
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                rows="3"
                placeholder="Enter technical specifications"
              />
            </div>

            {/* Supporting Documents Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <FolderOpen className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Supporting Documents
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload tender documents, specifications, and other
                    supporting files
                  </p>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100"
                    : "border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      dragActive
                        ? "bg-purple-600"
                        : "bg-gradient-to-br from-purple-100 to-blue-100"
                    }`}
                  >
                    <Upload
                      className={`w-8 h-8 ${
                        dragActive ? "text-white" : "text-purple-600"
                      }`}
                    />
                  </div>

                  <p className="text-gray-600 text-lg mb-4 font-medium">
                    Drag and drop your files here, or
                  </p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Browse Files
                  </button>

                  <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max
                    25MB each)
                  </p>

                  {formData.supportingDocuments.length > 0 && (
                    <p className="text-sm text-purple-600 mt-2 font-medium">
                      {formData.supportingDocuments.length} of 10 files selected
                    </p>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Selected Files Preview */}
              {formData.supportingDocuments.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="text-lg font-bold text-gray-900">
                    Selected Files
                  </h4>

                  <div className="grid gap-3">
                    {formData.supportingDocuments.map((file, index) => {
                      // Handle both File objects (new uploads) and existing documents (from API)
                      const isExistingDocument =
                        typeof file === "object" && file._id;
                      const fileName = isExistingDocument
                        ? file.fileName
                        : file.name;
                      const fileSize = isExistingDocument ? null : file.size;

                      return (
                        <div
                          key={
                            isExistingDocument
                              ? file._id
                              : `${file.name}-${index}`
                          }
                          className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-gray-500" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {fileName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {isExistingDocument ? (
                                  <span className="text-blue-600">
                                    Existing document
                                  </span>
                                ) : (
                                  formatFileSize(fileSize)
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isExistingDocument && (
                              <button
                                type="button"
                                onClick={() => window.open(file.url, "_blank")}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View document"
                              >
                                <FolderOpen className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formData.supportingDocuments.length} file
                          {formData.supportingDocuments.length !== 1
                            ? "s"
                            : ""}{" "}
                          selected
                        </p>
                        <p className="text-sm text-gray-600">
                          Total size:{" "}
                          {formatFileSize(
                            formData.supportingDocuments
                              .filter((file) => file.size) // Only count new files with size
                              .reduce((total, file) => total + file.size, 0)
                          )}
                        </p>
                      </div>

                      {formData.supportingDocuments.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              supportingDocuments: [],
                            }))
                          }
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p className="mb-1 font-medium text-blue-800">
                      Recommended documents:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Tender specification document (PDF)</li>
                      <li>Technical requirements (DOC/PDF)</li>
                      <li>Drawings or diagrams (PDF/JPG)</li>
                      <li>Terms and conditions (PDF)</li>
                      <li>Vendor qualification criteria (DOC/PDF)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Preferred Location Scope */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Location Scope *
              </label>
              <select
                name="locationScope"
                value={formData.locationScope}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select Location Scope</option>
                <option value="Select Location Scope">
                  Select Location Scope
                </option>
                <option value="Inter District">Inter District</option>
                <option value="Inter State">Inter State</option>
                <option value="Pan India">Pan India</option>
              </select>
            </div>

            {/* Pre-bid Meeting */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="preBidMeeting"
                  checked={formData.preBidMeeting}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Schedule Pre-bid Meeting
                </label>
              </div>

              {formData.preBidMeeting && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      name="meetingDate"
                      value={formData.meetingDate || ""}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Venue
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue || ""}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter meeting venue"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-2" />
              {formData.supportingDocuments.length} document
              {formData.supportingDocuments.length !== 1 ? "s" : ""} attached
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : editMode
                  ? "Update Tender"
                  : amendMode
                  ? "Amend Tender"
                  : "Create Tender"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenderFormModal;
