import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import api from "../../../../services/apiService";
import toastService from "../../../../services/toastService";

const safeParseUser = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem("user");
      if (!raw) return {};
      return JSON.parse(raw) || {};
    }
  } catch (e) {
    // ignore
  }
  return {};
};

const BusinessDetailsTab = ({ user, setUser, loadingUser }) => {
  const [editingLocal, setEditingLocal] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    companyType: "",
    yearsExperience: "",
    teamSize: "",
    establishedYear: "",
  });

  useEffect(() => {
    const base = user || safeParseUser();
    setForm({
      companyName: base?.company?.name || base?.companyName || "",
      companyType: base?.company?.companyType || base?.companyType || "",
      yearsExperience: base?.company?.yearsOfExp || base?.yearsExperience || "",
      teamSize: base?.company?.teamSize || base?.teamSize || "",
      establishedYear:
        base?.company?.incorporationDate || base?.establishedYear || "",
    });
  }, [user]);

  const handleChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSave = async () => {
    const base = user || safeParseUser();
    const userId = base?._id || base?.id;

    if (!userId) {
      toastService.showError("User ID not found");
      return;
    }

    const payload = {
      company: {
        name: form.companyName,
        companyType: form.companyType,
        incorporationDate: form.establishedYear,
        yearsOfExp: parseInt(form.yearsExperience) || 0,
        teamSize: parseInt(form.teamSize) || 0,
      },
    };

    try {
      const resp = await api.put(`/v1/users/${userId}`, { body: payload });
      const updatedUser = resp?.data || resp;

      if (typeof setUser === "function") setUser(updatedUser);

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toastService.showSuccess("Business details updated successfully");
      setEditingLocal(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toastService.showError(
        error?.response?.data?.message || "Failed to update business details"
      );
    }
  };

  const handleCancel = () => {
    const base = user || safeParseUser();
    setForm({
      companyName: base?.company?.name || base?.companyName || "",
      companyType: base?.company?.companyType || base?.companyType || "",
      yearsExperience: base?.company?.yearsOfExp || base?.yearsExperience || "",
      teamSize: base?.company?.teamSize || base?.teamSize || "",
      establishedYear:
        base?.company?.incorporationDate || base?.establishedYear || "",
    });
    setEditingLocal(false);
  };

  if (loadingUser) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Business Details
          </h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Business Details</h2>
          {!editingLocal && (
            <button
              onClick={() => setEditingLocal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company/Organization Name
            </label>
            {editingLocal ? (
              <input
                value={form.companyName}
                onChange={handleChange("companyName")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.companyName || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Type
            </label>
            {editingLocal ? (
              <select
                name="companyType"
                value={form.companyType}
                onChange={handleChange("companyType")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
                required
              >
                <option value="">Select Company Type</option>
                <option value="Private Limited Company">
                  Private Limited Company
                </option>
                <option value="Public Limited Company">
                  Public Limited Company
                </option>
                <option value="Limited Liability Partnership">
                  Limited Liability Partnership
                </option>
                <option value="Partnership">Partnership</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="One Person Company">One Person Company</option>
                <option value="Section 8 Company">Section 8 Company</option>
              </select>
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.companyType || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            {editingLocal ? (
              <input
                type="number"
                value={form.yearsExperience}
                onChange={handleChange("yearsExperience")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
                min="0"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.yearsExperience || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Size
            </label>
            {editingLocal ? (
              <input
                type="number"
                value={form.teamSize}
                onChange={handleChange("teamSize")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
                min="0"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.teamSize || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year of Establishment
            </label>
            {editingLocal ? (
              <input
                type="date"
                value={form.establishedYear}
                onChange={handleChange("establishedYear")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.establishedYear || "-"}
              </div>
            )}
          </div>
        </div>

        {editingLocal && (
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetailsTab;
