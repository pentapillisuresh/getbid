import React, { useState, useRef } from "react";
import { X, Upload, File } from "lucide-react";
import api, { createApiClient } from "../../../services/apiService";
import toastService from "../../../services/toastService";

const UploadDocumentModal = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "certificates",
    description: "",
    tags: "",
    expiryDate: "",
    file: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { value: "certificates", label: "Legal Documents" },
    { value: "financial", label: "Financial Documents" },
    { value: "technical", label: "Technical Documents" },
    { value: "proposals", label: "Marketing Materials" },
    { value: "contracts", label: "Experience Documents" },
  ];

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file || !formData.name) {
      alert("Please select a file and enter a document name");
      return;
    }
    // perform two-step upload: 1) upload file (multipart) 2) create document record with file id
    (async () => {
      // loading state
      try {
        setIsUploading(true);

        // Prepare multipart formdata
        const fd = new FormData();
        fd.append("image", formData.file, formData.file.name);

        // Create a client without default JSON Content-Type so the browser sets the multipart boundary
        const multipartClient = createApiClient({
          baseURL: api.defaults.baseURL,
          // empty headers will override the default Content-Type from the singleton
          headers: {},
          getAuthToken: api.defaults.getAuthToken,
        });

        // 1) Upload file
        const uploadResp = await multipartClient.post("/v1/File/upload", {
          body: fd,
          // Accept any response; the api client will attach Authorization automatically via getAuthToken
        });

        const uploadedFile =
          uploadResp && uploadResp.file ? uploadResp.file : null;
        if (!uploadedFile || !uploadedFile._id) {
          throw new Error("File upload failed: invalid response");
        }

        // 2) Create document using returned file id
        const createBody = {
          name: formData.name,
          // map internal category values to human-readable labels used by API
          category:
            formData.category === "certificates"
              ? "Legal Documents"
              : formData.category === "financial"
              ? "Financial Documents"
              : formData.category === "technical"
              ? "Technical Documents"
              : formData.category === "proposals"
              ? "Marketing Materials"
              : formData.category === "contracts"
              ? "Experience Documents"
              : formData.category,
          file: uploadedFile._id,
          description: formData.description,
          tags: formData.tags
            ? formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : [],
          expiryDate: formData.expiryDate || null,
          // Include client-side metadata so UI can render immediately without depending on API fill-in
          fileName: formData.file.name,
          size: `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB`,
          format: formData.file.name.split(".").pop().toUpperCase(),
        };

        const createResp = await api.post("/v1/documents", {
          body: createBody,
        });

        // notify consumer with created document data if available
        const created =
          createResp && createResp.data ? createResp.data : createResp;
        toastService.showSuccess(
          (createResp && createResp.message) || "Document uploaded"
        );
        if (typeof onUpload === "function") onUpload(created);

        // Reset form
        setFormData({
          name: "",
          category: "certificates",
          description: "",
          tags: "",
          expiryDate: "",
          file: null,
        });
      } catch (err) {
        const msg = (err && err.message) || "Upload failed";
        toastService.showError(msg);
        console.error("UploadDocumentModal error:", err);
      } finally {
        setIsUploading(false);
      }
    })();
  };

  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      style={{ marginTop: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 md:items-center mt-0"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload Document
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-0 md:space-y-6 overflow-y-auto flex-1">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  Drag and drop your file here, or
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Selected File Display */}
            {formData.file && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <File className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {formData.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(formData.file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, file: null }))
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter document name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter a brief description of the document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. mandatory, legal, certification"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isUploading
                  ? "bg-green-400 text-white cursor-wait"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
