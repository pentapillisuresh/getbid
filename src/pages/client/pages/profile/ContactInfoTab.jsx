import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

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

const ContactInfoTab = ({
  isEditing: parentEditing = false,
  setIsEditing,
  user,
  setUser,
  loadingUser,
}) => {
  const [remoteUser, setRemoteUser] = useState(user || null);
  const [loading, setLoading] = useState(!!loadingUser);

  const [isEditing, setEditing] = useState(!!parentEditing);
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
    // whenever parent passes user (from ProfilePage), use it
    if (user) {
      setRemoteUser(user);
      setForm({
        name: user?.name || user?.company?.contact?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || user?.phone || "",
        website: user?.company?.website || "",
        address: user?.address || user?.company?.address?.street || "",
        state: user?.addressState || user?.company?.address?.state || "",
        district: user?.addressDistrict || "",
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
        website: local.company?.website || "",
        address: local.address || local.company?.address?.street || "",
        state: local.addressState || local.company?.address?.state || "",
        district: local.addressDistrict || "",
        pincode: local.pincode || local.company?.address?.pincode || "",
      });
      setLoading(false);
    }
  }, [user]);

  // respond to parent editing toggle
  useEffect(() => {
    setEditing(!!parentEditing);
  }, [parentEditing]);

  // keep parent in sync
  useEffect(() => {
    if (typeof setIsEditing === "function") setIsEditing(isEditing);
  }, [isEditing, setIsEditing]);

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleSave = () => {
    // merge into remoteUser/local storage and persist to localStorage
    const base = remoteUser || safeParseUser();
    const updated = Object.assign({}, base, {
      name: form.name,
      email: form.email,
      phoneNumber: form.phoneNumber,
      website: form.website,
      address: form.address,
      addressState: form.state,
      addressDistrict: form.district,
      pincode: form.pincode,
    });
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("user", JSON.stringify(updated));
      }
      setRemoteUser(updated);
      if (typeof setUser === "function") setUser(updated);
    } catch (e) {
      // ignore write errors
    }
    setEditing(false);
  };

  const handleCancel = () => {
    // reset to remoteUser values
    const base = remoteUser || safeParseUser();
    setForm({
      name: base.name || base.company?.contact?.name || "",
      email: base.email || "",
      phoneNumber: base.phoneNumber || base.phone || "",
      website: base.company?.website || "",
      address: base.address || base.company?.address?.street || "",
      state: base.addressState || base.company?.address?.state || "",
      district: base.addressDistrict || "",
      pincode: base.pincode || base.company?.address?.pincode || "",
    });
    setEditing(false);
  };

  const emailVerified = !!(
    remoteUser?.emailVerification && remoteUser.emailVerification.isVerified
  );
  const phoneVerified = !!(
    remoteUser?.phoneNumberVerification &&
    remoteUser.phoneNumberVerification.isVerified
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
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Contact Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
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
            </label>
            {isEditing ? (
              <input
                value={form.email}
                onChange={handleChange("email")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-gray-900">{form.email || "-"}</span>
                <span
                  className={`flex items-center gap-1 text-xs ${
                    emailVerified ? "text-green-600" : "text-gray-500"
                  } font-medium`}
                >
                  {/* {emailVerified && <CheckCircle className="w-4 h-4" />}
                  {emailVerified ? "Verified" : "Unverified"} */}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-gray-900">{form.phoneNumber || "-"}</span>
                <span
                  className={`flex items-center gap-1 text-xs ${
                    phoneVerified ? "text-green-600" : "text-gray-500"
                  } font-medium`}
                >
                  {/* {phoneVerified && <CheckCircle className="w-4 h-4" />}
                  {phoneVerified ? "Verified" : "Unverified"} */}
                </span>
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
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                {form.website ? (
                  <a
                    href={
                      form.website.startsWith("http")
                        ? form.website
                        : `https://${form.website}`
                    }
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {form.website}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Address Details
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complete Address
          </label>
          {isEditing ? (
            <input
              value={form.address}
              onChange={handleChange("address")}
              className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
            />
          ) : (
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              {form.address || "-"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            {isEditing ? (
              <input
                value={form.state}
                onChange={handleChange("state")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
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
              <input
                value={form.district}
                onChange={handleChange("district")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
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
