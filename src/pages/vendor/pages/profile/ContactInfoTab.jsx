import React, { useEffect, useState } from "react";
import { CheckCircle, Edit } from "lucide-react";
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

const ContactInfoTab = ({ user, setUser, loadingUser }) => {
  const [remoteUser, setRemoteUser] = useState(user || null);
  const [loading, setLoading] = useState(!!loadingUser);

  const [isEditing, setEditing] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    website: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
  });

  useEffect(() => {
    // whenever parent passes user, use it
    if (user) {
      setRemoteUser(user);
      setForm({
        name: user?.name || user?.company?.contact?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || user?.phone || "",
        website: user?.company?.website || user?.website || "",
        address: user?.address || user?.company?.address?.street || "",
        state:
          user?.state ||
          user?.addressState ||
          user?.company?.address?.state ||
          "",
        district:
          user?.district ||
          user?.addressDistrict ||
          user?.company?.address?.district ||
          "",
        pincode: user?.pincode || user?.company?.address?.pincode || "",
      });
      setLoading(false);
    } else {
      // fallback to any stored user
      const local = safeParseUser();
      setRemoteUser(local || {});
      setForm({
        name: local.name || local.company?.contact?.name || "",
        email: local.email || "",
        phoneNumber: local.phoneNumber || local.phone || "",
        website: local.company?.website || local.website || "",
        address: local.address || local.company?.address?.street || "",
        state:
          local.state ||
          local.addressState ||
          local.company?.address?.state ||
          "",
        district:
          local.district ||
          local.addressDistrict ||
          local.company?.address?.district ||
          "",
        pincode: local.pincode || local.company?.address?.pincode || "",
      });
      setLoading(false);
    }
  }, [user]);

  // Fetch states when editing starts
  useEffect(() => {
    if (isEditing) {
      const fetchStates = async () => {
        try {
          const resp = await api.get("/v1/common/states");
          const statesData = resp?.data || resp || [];
          setStates(statesData);
        } catch (error) {
          console.error("Error fetching states:", error);
          toastService.showError("Failed to load states");
        }
      };
      fetchStates();
    } else {
      setStates([]);
      setDistricts([]);
    }
  }, [isEditing]);

  // Fetch districts when state changes
  useEffect(() => {
    if (isEditing && form.state) {
      const fetchDistricts = async () => {
        try {
          const resp = await api.get(`/v1/common/districts/${form.state}`);
          const districtsData = resp?.data || resp || [];
          setDistricts(districtsData);
        } catch (error) {
          console.error("Error fetching districts:", error);
          toastService.showError("Failed to load districts");
        }
      };
      fetchDistricts();
    } else if (!isEditing) {
      setDistricts([]);
    }
  }, [isEditing, form.state]);

  const handleChange = (key) => (e) => {
    if (key === "state") {
      setForm((s) => ({ ...s, [key]: e.target.value, district: "" }));
    } else {
      setForm((s) => ({ ...s, [key]: e.target.value }));
    }
  };

  const handleSave = async () => {
    const base = remoteUser || safeParseUser();
    const userId = base?._id || base?.id;

    if (!userId) {
      toastService.showError("User ID not found");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phoneNumber: form.phoneNumber,
      website: form.website,
      address: form.address,
      state: form.state,
      district: form.district,
      pincode: form.pincode,
    };

    try {
      const resp = await api.put(`/v1/users/${userId}`, { body: payload });
      const updatedUser = resp?.data || resp;

      setRemoteUser(updatedUser);
      if (typeof setUser === "function") setUser(updatedUser);

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toastService.showSuccess("Contact information updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toastService.showError(
        error?.response?.data?.message || "Failed to update contact information"
      );
    }
  };

  const handleCancel = () => {
    const base = remoteUser || safeParseUser();
    setForm({
      name: base.name || base.company?.contact?.name || "",
      email: base.email || "",
      phoneNumber: base.phoneNumber || base.phone || "",
      website: base.company?.website || base.website || "",
      address: base.address || base.company?.address?.street || "",
      state:
        base.state || base.addressState || base.company?.address?.state || "",
      district:
        base.district ||
        base.addressDistrict ||
        base.company?.address?.district ||
        "",
      pincode: base.pincode || base.company?.address?.pincode || "",
    });
    setEditing(false);
  };

  const emailVerified = !!(
    remoteUser?.emailVerification && remoteUser.emailVerification.isVerified
  );
  const phoneVerified = !!(
    remoteUser?.phoneVerification && remoteUser.phoneVerification.isVerified
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Contact Information
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
          <h2 className="text-xl font-bold text-gray-900">
            Contact Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setEditing(true)}
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
              Contact Person Name
            </label>
            {isEditing ? (
              <input
                value={form.name}
                onChange={handleChange("name")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.name || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
              {emailVerified && (
                <span className="ml-2 inline-flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </label>
            {isEditing ? (
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.email || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
              {phoneVerified && (
                <span className="ml-2 inline-flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </label>
            {isEditing ? (
              <input
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.phoneNumber || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            {isEditing ? (
              <input
                value={form.website}
                onChange={handleChange("website")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.website || "-"}
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {isEditing ? (
              <textarea
                value={form.address}
                onChange={handleChange("address")}
                rows={3}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.address || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            {isEditing ? (
              <select
                value={form.state}
                onChange={handleChange("state")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option
                    key={state.value || state}
                    value={state.value || state}
                  >
                    {state.label || state}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.state || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            {isEditing ? (
              <select
                value={form.district}
                onChange={handleChange("district")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
                disabled={!form.state}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option
                    key={district.value || district}
                    value={district.value || district}
                  >
                    {district.label || district}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.district || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
            </label>
            {isEditing ? (
              <input
                value={form.pincode}
                onChange={handleChange("pincode")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.pincode || "-"}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
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

export default ContactInfoTab;
