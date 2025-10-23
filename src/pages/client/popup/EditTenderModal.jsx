import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditTenderModal = ({ show, onClose, tender, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedValue: "",
    submissionDeadline: "",
    category: "",
    department: "",
  });

  useEffect(() => {
    if (tender) {
      setFormData({
        title: tender.title || "",
        description: tender.description || "",
        estimatedValue: tender.estimatedValue || "",
        submissionDeadline: tender.submissionDeadline || "",
        category: tender.category || "",
        department: tender.department || "",
      });
    }
  }, [tender]);

  if (!show || !tender) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Tender - {tender.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Tender Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tender Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Construction">Construction</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Estimated Value and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Value *
                </label>
                <input
                  type="text"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="₹25.0 Cr"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Deadline *
                </label>
                <input
                  type="date"
                  name="submissionDeadline"
                  value={formData.submissionDeadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Additional Fields Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Information
              </h3>

              {/* Pre-bid Meeting */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="preBidMeeting"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="preBidMeeting"
                  className="ml-2 text-sm text-gray-700"
                >
                  Schedule Pre-bid Meeting
                </label>
              </div>

              {/* Linked Account */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="linkedAccount"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="linkedAccount"
                  className="ml-2 text-sm text-gray-700"
                >
                  Link to Main Account
                </label>
              </div>
            </div>

            {/* Action Buttons */}
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors min-w-[100px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors min-w-[100px]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTenderModal;
