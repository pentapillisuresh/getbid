// src/components/popups/TenderFormModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";

const TenderFormModal = ({ show, onClose, onSubmit, user, mode = 'create', initialData = null }) => {
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

  // Auto-fill user info when modal opens
  useEffect(() => {
    // If the modal is opening for a fresh create (no initialData), reset form to defaults
    if (show && !initialData && mode === 'create') {
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
        createdBy: user ? (user.name || "—") : "",
        userType: user ? (user.type || "—") : "",
      });
      return;
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
        estimatedValue: initialData.value ? String(initialData.value) : (initialData.estimatedValue || prev.estimatedValue),
        deadline: initialData.bidDeadline ? initialData.bidDeadline.split('T')[0] : (initialData.deadline || prev.deadline),
        description: initialData.description || prev.description,
        eligibility: initialData.eligibilityCriteria || initialData.eligibility || prev.eligibility,
        specifications: initialData.technicalSpecifications || initialData.specifications || prev.specifications,
        preBidMeeting: initialData.preBidMeeting || prev.preBidMeeting,
        meetingDate: initialData.meetingDate || prev.meetingDate,
        venue: initialData.venue || prev.venue,
        state: initialData.state || prev.state,
        district: initialData.district || prev.district,
        projectAddress: initialData.address || initialData.projectAddress || prev.projectAddress,
        contactPerson: initialData.contactPerson || prev.contactPerson,
        contactNumbers: initialData.contactNumber || initialData.contactNumbers || prev.contactNumbers,
      }));
    }
  }, [user, show, initialData]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // map formData to API payload
    const payload = {
      title: formData.title,
      category: formData.category,
      value: Number(formData.estimatedValue || 0),
      bidDeadline: formData.deadline,
      description: formData.description,
      eligibilityCriteria: (formData.eligibility || []).filter((c) => c && c.trim() !== ""),
      technicalSpecifications: formData.specifications,
      state: formData.state,
      district: formData.district,
      address: formData.projectAddress,
      contactPerson: formData.contactPerson,
      contactNumber: formData.contactNumbers,
    };
    // call API: POST for create/duplicate, PUT for edit
    setSubmitting(true);
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const reqOpts = { body: payload };
    if (token) reqOpts.headers = { Authorization: `Bearer ${token}` };

    const doPost = () => api.post("/v1/tenders", reqOpts);
    const doPut = (id) => api.put(`/v1/tenders/${id}`, reqOpts);

    const call = mode === 'edit' && initialData && initialData.id ? doPut(initialData.id) : doPost();

    call
      .then((resp) => {
        if (resp && resp.success) {
          const successMsg = mode === 'edit' ? (resp.message || 'Tender updated successfully') : (resp.message || 'Tender created successfully');
          toastService.showSuccess(successMsg);
          if (typeof onSubmit === "function") onSubmit(resp.data, mode);
          onClose();
        } else {
          const msg = (resp && (resp.message || resp.error)) || (mode === 'edit' ? 'Failed to update tender' : 'Failed to create tender');
          toastService.showError(msg);
        }
      })
      .catch((err) => {
        const msg = (err && err.data && err.data.message) || err.message || (mode === 'edit' ? 'Failed to update tender' : 'Failed to create tender');
        toastService.showError(msg);
      })
      .finally(() => setSubmitting(false));
  };


  return createPortal(
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Tender' : mode === 'duplicate' ? 'Duplicate Tender' : 'Create New Tender'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Tender Creator Info */}
        <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold text-blue-800">Created by:</span> {formData.createdBy}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              <span className="font-semibold text-blue-800">User Type:</span> {formData.userType}
            </p>
          </div>
        </div>

        {/* Form: make body scrollable while header/footer stay fixed */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
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
                  onChange={(e) => handleCriteriaChange(index, e.target.value)}
                  className="mt-1 flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter eligibility criteria"
                />
                {formData.eligibility.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.eligibility.filter((_, i) => i !== index);
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
              disabled={submitting}
              className={`px-4 py-2 ${submitting ? 'opacity-70 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} text-white rounded-lg`}
            >
              {submitting ? (mode === 'edit' ? 'Updating…' : 'Saving…') : (mode === 'edit' ? 'Update Tender' : 'Create Tender')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    typeof document !== 'undefined' ? document.body : document.getElementById('root')
  );
};

export default TenderFormModal;
