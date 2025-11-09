import React, { useState } from "react";
import { X, Upload, FileText, Trash2, Send } from "lucide-react";
import { uploadTenderDocument } from "../../../services/tenderApiService";
import toastService from "../../../services/toastService";

const ResponseModal = ({ clarification, onClose, onSubmit }) => {
  const [answer, setAnswer] = useState(clarification?.answer || "");
  const [selectedFiles, setSelectedFiles] = useState([]); // Store File objects, not uploaded data
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store the actual File objects with additional metadata for display
    const newFiles = files.map((file) => ({
      file: file,
      name: file.name,
      size: file.size,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    // Clear input so same file can be selected again
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toastService.showError("Please enter an answer");
      return;
    }

    setIsSubmitting(true);
    try {
      let attachmentIds = [];

      // Upload files only when submitting
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (fileObj) => {
          const response = await uploadTenderDocument(fileObj.file);
          // Extract _id from nested file object in response
          return response.file?._id || response._id;
        });

        attachmentIds = await Promise.all(uploadPromises);
        // Filter out any null/undefined values
        attachmentIds = attachmentIds.filter((id) => id);
      }

      const answerData = {
        answer: answer.trim(),
        attachments: attachmentIds,
      };

      await onSubmit(clarification._id, answerData);
      onClose();
    } catch (error) {
      console.error("Error submitting answer:", error);
      // Error is handled in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {clarification?.answer
                  ? "Edit Response"
                  : "Respond to Question"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {clarification?.tender?.tenderId} -{" "}
                {clarification?.tender?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Question Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Vendor's Question:
            </h4>
            <p className="text-blue-800">{clarification?.question}</p>
            <div className="flex items-center gap-4 text-sm text-blue-700 mt-2">
              <span>From: {clarification?.user?.name}</span>
              <span>•</span>
              <span>Category: {clarification?.category}</span>
              <span>•</span>
              <span>Priority: {clarification?.priority}</span>
            </div>
          </div>

          {/* Answer Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="6"
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a clear and detailed response to help the vendor
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileSelect}
                disabled={isSubmitting}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
                </p>
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Selected Files ({selectedFiles.length})
                </p>
                {selectedFiles.map((fileObj, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {fileObj.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(fileObj.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      disabled={isSubmitting}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSubmitting
              ? selectedFiles.length > 0
                ? "Uploading & Submitting..."
                : "Submitting..."
              : clarification?.answer
              ? "Update Response"
              : "Submit Response"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
