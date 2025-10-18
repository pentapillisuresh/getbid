// src/components/popups/TenderFormModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";
import { Upload, File as FileIcon, X } from "lucide-react";

const TenderFormModal = ({
  show,
  onClose,
  onSubmit,
  user,
  mode = "create",
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    estimatedValue: "",
    deadline: "",
    description: "",
    eligibility: [""],
    specifications: "",
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
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachments, setAttachments] = useState([]);
  // Attachments inline picker state & handlers (replaces external UploadQuotationPicker)
  const fileInputRef = useRef(null);
  const [dragActiveAttach, setDragActiveAttach] = useState(false);
  const acceptAttachments = ".pdf,.doc,.docx,.xls,.xlsx";
  const maxAttachments = 10;
  const maxAttachmentSizeMB = 20;

  const humanFileSize = (size) => `${(size / (1024 * 1024)).toFixed(1)} MB`;

  const handleDragAttach = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover")
      setDragActiveAttach(true);
    if (e.type === "dragleave") setDragActiveAttach(false);
  };

  const handleDropAttach = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveAttach(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    handleAddAttachments(dropped);
  };

  const handleAddAttachments = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    const merged = [...attachments];
    for (const f of newFiles) {
      if (merged.length >= maxAttachments) break;
      if (f.size > maxAttachmentSizeMB * 1024 * 1024) continue; // skip too large
      merged.push(f);
    }
    setAttachments(merged);
  };

  const handleFileInputAttach = (e) => {
    const picked = Array.from(e.target.files || []);
    handleAddAttachments(picked);
    e.target.value = null;
  };

  const handleRemoveAttachment = (index) => {
    const updated = attachments.slice(0);
    updated.splice(index, 1);
    setAttachments(updated);
  };

  // Auto-fill user info when modal opens
  useEffect(() => {
    // If the modal is opening for a fresh create (no initialData), reset form to defaults
    if (show && !initialData && mode === "create") {
      setFormData({
        title: "",
        category: "",
        estimatedValue: "",
        deadline: "",
        description: "",
        eligibility: [""],
        specifications: "",
        preBidMeeting: false,
        meetingDate: "",
        venue: "",
        state: "",
        district: "",
        projectAddress: "",
        contactPerson: "",
        contactNumbers: "",
        createdBy: user ? user.name || "—" : "",
        userType: user ? user.type || "—" : "",
      });
      // Clear attachments for fresh create
      setAttachments([]);
      // Reset other states
      setUploadingFiles(false);
      setSubmitting(false);
      return;
    }

    // Reset states when modal opens
    if (show) {
      setUploadingFiles(false);
      setSubmitting(false);
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        createdBy: user.name || "—",
        userType: user.type || "—",
      }));
    }

    // if initialData provided (edit or duplicate), map it to form fields
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        title: initialData.title || prev.title,
        category: initialData.category || prev.category,
        estimatedValue: initialData.value
          ? String(initialData.value)
          : initialData.estimatedValue || prev.estimatedValue,
        deadline: initialData.bidDeadline
          ? initialData.bidDeadline.split("T")[0]
          : initialData.deadline || prev.deadline,
        description: initialData.description || prev.description,
        eligibility:
          initialData.eligibilityCriteria ||
          initialData.eligibility ||
          prev.eligibility,
        specifications:
          initialData.technicalSpecifications ||
          initialData.specifications ||
          prev.specifications,
        preBidMeeting: initialData.preBidMeeting || prev.preBidMeeting,
        meetingDate: initialData.meetingDate
          ? initialData.meetingDate.split("T")[0]
          : prev.meetingDate,
        venue: initialData.venue || initialData.meetingVenue || prev.venue,
        state: initialData.state || prev.state,
        district: initialData.district || prev.district,
        projectAddress:
          initialData.address ||
          initialData.projectAddress ||
          prev.projectAddress,
        contactPerson: initialData.contactPerson || prev.contactPerson,
        contactNumbers:
          initialData.contactNumber ||
          initialData.contactNumbers ||
          prev.contactNumbers,
      }));
      // map any existing attachments (if API returns attachment metadata)
      if (initialData.documents && Array.isArray(initialData.documents)) {
        // initialData.documents might be document IDs or objects with metadata
        const mapped = initialData.documents.map((doc) => {
          if (typeof doc === "string") {
            // If it's just an ID, create a placeholder object
            return { _id: doc, name: `Document ${doc}`, size: 0 };
          }
          if (doc && doc._id) {
            // If it's an object with metadata
            return {
              _id: doc._id,
              name: doc.name || doc.originalName || `Document ${doc._id}`,
              size: doc.size || 0,
            };
          }
          return { _id: String(doc), name: String(doc), size: 0 };
        });
        setAttachments(mapped);
      } else if (
        initialData.attachments &&
        Array.isArray(initialData.attachments)
      ) {
        // Fallback for legacy 'attachments' field
        const mapped = initialData.attachments.map((a) => {
          if (typeof a === "string") return { name: a, size: 0 };
          if (a && a.name) return { name: a.name, size: a.size || 0 };
          return { name: String(a), size: 0 };
        });
        setAttachments(mapped);
      }
    }
  }, [user, show, initialData]);

  // Cleanup effect when modal closes
  useEffect(() => {
    if (!show) {
      // Reset upload states when modal closes
      setUploadingFiles(false);
      setSubmitting(false);
      // Clear attachments only if it was a create mode (not edit/duplicate)
      if (mode === "create") {
        setAttachments([]);
      }
    }
  }, [show, mode]);

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

  // Function to upload files and get their IDs
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map(async (file, index) => {
      try {
        const formData = new FormData();
        formData.append("image", file); // API expects 'image' field name

        const token =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        // For FormData uploads, we need to let the browser set Content-Type with boundary
        const uploadHeaders = {};
        if (token) {
          uploadHeaders.Authorization = `Bearer ${token}`;
        }

        const response = await api.post("/v1/File/upload", {
          body: formData,
          headers: uploadHeaders,
        });

        console.log(`Upload response for ${file.name}:`, response);

        if (response && response.file && response.file._id) {
          return response.file._id;
        } else {
          throw new Error(`Invalid response for ${file.name}`);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        const errorMsg =
          error.data?.message || error.message || "Unknown error";
        throw new Error(`Failed to upload ${file.name}: ${errorMsg}`);
      }
    });

    try {
      const uploadedIds = await Promise.all(uploadPromises);
      if (uploadedIds.length > 0) {
        toastService.showSuccess(
          `Successfully uploaded ${uploadedIds.length} file(s)`
        );
      }
      return uploadedIds;
    } catch (error) {
      // Show a summary error message
      toastService.showError("Some files failed to upload. Please try again.");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // First, upload files and get their IDs
      let documentIds = [];
      console.log("Attachments:", attachments);

      if (attachments && attachments.length > 0) {
        // Filter out non-File objects (in case of edit mode with existing attachments)
        const filesToUpload = attachments.filter(
          (file) => file instanceof File
        );
        console.log("Files to upload:", filesToUpload);

        if (filesToUpload.length > 0) {
          setUploadingFiles(true);
          documentIds = await uploadFiles(filesToUpload);
          console.log("Uploaded document IDs:", documentIds);
          setUploadingFiles(false);
        }
        // If editing and there are existing attachments (not File objects), we might need to handle them differently
        // For now, assuming existing attachments are already uploaded and have IDs
        const existingIds = attachments
          .filter((file) => !(file instanceof File) && file._id)
          .map((file) => file._id);
        console.log("Existing document IDs:", existingIds);
        documentIds = [...documentIds, ...existingIds];
      }

      console.log("Final document IDs:", documentIds);

      // map formData to API payload
      const payload = {
        title: formData.title,
        category: formData.category,
        value: Number(formData.estimatedValue || 0),
        bidDeadline: formData.deadline,
        description: formData.description,
        eligibilityCriteria: (formData.eligibility || []).filter(
          (c) => c && c.trim() !== ""
        ),
        technicalSpecifications: formData.specifications,
        documents: documentIds, // Send array of document IDs instead of filenames
        state: formData.state,
        district: formData.district,
        address: formData.projectAddress,
        contactPerson: formData.contactPerson,
        contactNumber: formData.contactNumbers,
        preBidMeeting: formData.preBidMeeting,
        meetingDate: formData.preBidMeeting ? formData.meetingDate : null,
        meetingVenue: formData.preBidMeeting ? formData.venue : null,
      };

      console.log("Payload being sent:", payload);

      // call API: POST for create/duplicate, PUT for edit
      const token =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const reqOpts = { body: payload };
      if (token) reqOpts.headers = { Authorization: `Bearer ${token}` };

      const doPost = () => api.post("/v1/tenders", reqOpts);
      const doPut = (id) => api.put(`/v1/tenders/${id}`, reqOpts);

      const call =
        mode === "edit" && initialData && initialData.id
          ? doPut(initialData.id)
          : doPost();

      const resp = await call;

      if (resp && resp.success) {
        const successMsg =
          mode === "edit"
            ? resp.message || "Tender updated successfully"
            : resp.message || "Tender created successfully";
        toastService.showSuccess(successMsg);
        if (typeof onSubmit === "function") onSubmit(resp.data, mode);
        onClose();
      } else {
        const msg =
          (resp && (resp.message || resp.error)) ||
          (mode === "edit"
            ? "Failed to update tender"
            : "Failed to create tender");
        toastService.showError(msg);
      }
    } catch (err) {
      const msg =
        (err && err.data && err.data.message) ||
        err.message ||
        (mode === "edit"
          ? "Failed to update tender"
          : "Failed to create tender");
      toastService.showError(msg);
    } finally {
      setSubmitting(false);
      setUploadingFiles(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "edit"
              ? "Edit Tender"
              : mode === "duplicate"
              ? "Duplicate Tender"
              : "Create New Tender"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tender Creator Info */}
        <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex justify-between items-center">
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

        {/* Form: make body scrollable while header/footer stay fixed */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto px-6 py-4 space-y-6">
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

            {/* Attachments (inline Upload UI) */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
              <div
                style={{ cursor: "pointer" }}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  dragActiveAttach
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragAttach}
                onDragLeave={handleDragAttach}
                onDragOver={handleDragAttach}
                onDrop={handleDropAttach}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-gray-700 font-medium mb-1">
                    Upload Documents
                  </p>
                  <div className="flex items-center gap-2">
                    {/* <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Browse Files
                    </button> */}
                    <span className="text-xs text-gray-500">
                      Supported: PDF, DOC, DOCX, XLS • Max {maxAttachmentSizeMB}
                      MB
                    </span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptAttachments}
                  multiple
                  onChange={handleFileInputAttach}
                  className="hidden"
                />
              </div>

              {attachments && attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((f, idx) => (
                    <div
                      key={`${f.name}-${f.size}-${idx}`}
                      className={`flex items-center gap-3 p-2 rounded-md ${
                        uploadingFiles && f instanceof File
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <FileIcon
                        className={`w-5 h-5 ${
                          uploadingFiles && f instanceof File
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {f.name}
                          {uploadingFiles && f instanceof File && (
                            <span className="ml-2 text-xs text-blue-600">
                              Uploading...
                            </span>
                          )}
                          {f._id && (
                            <span className="ml-2 text-xs text-green-600">
                              ✓ Uploaded
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {humanFileSize(f.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        disabled={uploadingFiles && f instanceof File}
                        className={`p-1 rounded ${
                          uploadingFiles && f instanceof File
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
          </div>
          {/* Actions (fixed footer within modal) */}
          <div className="px-6 py-4 border-t flex justify-end gap-3 flex-none">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingFiles}
              className={`px-4 py-2 ${
                submitting || uploadingFiles
                  ? "opacity-70 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              } text-white rounded-lg`}
            >
              {uploadingFiles
                ? "Uploading files…"
                : submitting
                ? mode === "edit"
                  ? "Updating…"
                  : "Saving…"
                : mode === "edit"
                ? "Update Tender"
                : "Create Tender"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    typeof document !== "undefined"
      ? document.body
      : document.getElementById("root")
  );
};

export default TenderFormModal;
