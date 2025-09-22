import React, { useState } from "react";

const TenderFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    estimatedValue: "",
    deadline: "",
    description: "",
    criteria: [""],
    technicalSpecs: "",
    preBidMeeting: false,
    meetingDate: "",
    venue: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, ""],
    }));
  };

  const handleCriteriaChange = (index, value) => {
    const updated = [...formData.criteria];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, criteria: updated }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Tender</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        {/* Basic Information */}
        <h3 className="font-semibold mb-2">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Tender Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="estimatedValue"
            placeholder="Estimated Value (₹)"
            value={formData.estimatedValue}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Construction">Construction</option>
            <option value="IT">IT Services</option>
            <option value="Healthcare">Healthcare</option>
          </select>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <textarea
          name="description"
          placeholder="Enter detailed description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
        />

        {/* Eligibility Criteria */}
        <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
        {formData.criteria.map((crit, index) => (
          <input
            key={index}
            type="text"
            placeholder="Enter eligibility criteria"
            value={crit}
            onChange={(e) => handleCriteriaChange(index, e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
        ))}
        <button
          type="button"
          onClick={handleAddCriteria}
          className="text-blue-600 text-sm mb-4"
        >
          + Add Another Criteria
        </button>

        {/* Technical Specifications */}
        <h3 className="font-semibold mb-2">Technical Specifications</h3>
        <textarea
          name="technicalSpecs"
          placeholder="Enter detailed technical specifications"
          value={formData.technicalSpecs}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
        />

        {/* Pre-bid Meeting */}
        <h3 className="font-semibold mb-2">Pre-bid Meeting</h3>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={formData.preBidMeeting}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                preBidMeeting: e.target.checked,
              }))
            }
          />
          <span>Schedule Pre-bid Meeting</span>
        </div>
        {formData.preBidMeeting && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              name="meetingDate"
              value={formData.meetingDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="venue"
              placeholder="Meeting Venue"
              value={formData.venue}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Create Tender
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenderFormModal;
