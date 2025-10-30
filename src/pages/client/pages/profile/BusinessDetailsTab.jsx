import React, { useEffect, useState } from "react";

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

const BusinessDetailsTab = ({ user, isEditing, setUser, loadingUser }) => {
  const [editingLocal, setEditingLocal] = useState(!!isEditing);
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
      yearsExperience: base?.yearsExperience || "",
      teamSize: base?.teamSize || "",
      establishedYear:
        base?.company?.incorporationDate || base?.establishedYear || "",
    });
    setEditingLocal(!!isEditing);
  }, [user, isEditing]);

  const handleChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSave = () => {
    const base = user || safeParseUser();
    const updated = Object.assign({}, base, {
      company: Object.assign({}, base.company || {}, {
        name: form.companyName,
        companyType: form.companyType,
        incorporationDate: form.establishedYear,
      }),
      yearsExperience: form.yearsExperience,
      teamSize: form.teamSize,
    });
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("user", JSON.stringify(updated));
      }
      if (typeof setUser === "function") setUser(updated);
    } catch (e) {
      // ignore
    }
    setEditingLocal(false);
  };

  const handleCancel = () => {
    const base = user || safeParseUser();
    setForm({
      companyName: base?.company?.name || base?.companyName || "",
      companyType: base?.company?.companyType || base?.companyType || "",
      yearsExperience: base?.yearsExperience || "",
      teamSize: base?.teamSize || "",
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Business Details
        </h2>

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
              <input
                value={form.companyType}
                onChange={handleChange("companyType")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
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
                value={form.yearsExperience}
                onChange={handleChange("yearsExperience")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
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
                value={form.teamSize}
                onChange={handleChange("teamSize")}
                className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                {form.teamSize || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Established Year
            </label>
            {editingLocal ? (
              <input
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

export default BusinessDetailsTab;
