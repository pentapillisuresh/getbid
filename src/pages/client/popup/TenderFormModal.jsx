// src/components/popups/TenderFormModal.jsx
import React, { useState } from "react";

const TenderFormModal = ({ show, onClose, onSubmit }) => {
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
});


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
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create New Tender</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
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

          {/* Eligibility Criteria */}
         {/* Eligibility Criteria */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    Eligibility Criteria
  </label>
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
      {/* Meeting Date */}
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

      {/* Venue */}
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
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Create Tender
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenderFormModal;
