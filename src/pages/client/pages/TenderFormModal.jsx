import React, { useState, useEffect } from "react";
import apiService from "../../../services/apiService";

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
    venue: "",
    state: "",
    district: "",
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  // Fetch states and categories on mount
  useEffect(() => {
    apiService
      .get("/v1/common/states")
      .then(setStates)
      .catch(() => setStates([]));
    apiService
      .get("/v1/common/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (formData.state) {
      setDistrictsLoading(true);
      fetch(`/v1/common/districts/${encodeURIComponent(formData.state)}`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data);
          setDistrictsLoading(false);
        })
        .catch(() => {
          setDistricts([]);
          setDistrictsLoading(false);
        });
      // Reset district selection when state changes
      setFormData((prev) => ({ ...prev, district: "" }));
    } else {
      setDistricts([]);
      setFormData((prev) => ({ ...prev, district: "" }));
    }
  }, [formData.state]);

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
    <div
      style={{ marginTop: "0px" }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Tender1</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          {/* State Dropdown */}
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="border p-2 rounded col-span-1"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {/* District Dropdown */}
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="border p-2 rounded col-span-1"
            disabled={
              !formData.state || districtsLoading || districts.length === 0
            }
          >
            <option value="">
              {districtsLoading ? "Loading..." : "Select District"}
            </option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
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
