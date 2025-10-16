import React, { useState, useEffect } from "react";
import { X, Download, Share, Edit2, Trash2, FileText } from "lucide-react";
import api from "../../../services/apiService";

const ViewDocumentModal = ({
  isOpen,
  onClose,
  document,
  onUpdate,
  onDelete,
  onRefreshDocuments,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(document);
  const [editData, setEditData] = useState({
    name: document.name,
    description: document.description,
    tags: document.tags.join(", "),
    expiryDate: document.expiryDate || "",
    category: document.type,
  });

  useEffect(() => {
    setCurrentDocument(document);
  }, [document]);

  useEffect(() => {
    if (!currentDocument) return;
    setEditData({
      name: currentDocument.name,
      description: currentDocument.description,
      tags: Array.isArray(currentDocument.tags)
        ? currentDocument.tags.join(", ")
        : currentDocument.tags || "",
      expiryDate: currentDocument.expiryDate || "",
      category: currentDocument.type,
    });
  }, [currentDocument]);

  const categories = [
    { value: "certificates", label: "Legal Documents" },
    { value: "financial", label: "Financial Documents" },
    { value: "technical", label: "Technical Documents" },
    { value: "proposals", label: "Marketing Materials" },
    { value: "contracts", label: "Experience Documents" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    const baseDoc = currentDocument || document || {};
    const updatedDocument = {
      ...baseDoc,
      name: editData.name,
      description: editData.description,
      tags: editData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      expiryDate: editData.expiryDate || null,
      type: editData.category,
      lastModified: new Date().toISOString().split("T")[0],
    };

    // Call API to update document
    (async () => {
      try {
        // The API expects: name, category, file, description, tags, expiryDate
        const body = {
          name: updatedDocument.name,
          category: updatedDocument.type,
          // we don't modify the file here; send null or omit depending on backend
          description: updatedDocument.description,
          tags: updatedDocument.tags,
          expiryDate: updatedDocument.expiryDate,
        };

        setIsUpdated(true);

        // Use PATCH against the documents endpoint
        const resp = await api.put(`/v1/documents/${currentDocument.id}`, {
          body,
          showToasts: true,
        });

        // After update, refetch the fresh document from server to ensure details view is up to date
        let fresh = null;
        try {
          const refetchId =
            (currentDocument && currentDocument.id) || document.id;
          fresh = await api.get(`/v1/documents/${refetchId}`);
        } catch (err) {
          // If refetch fails, fall back to response or optimistic data
          console.warn("Failed to refetch document after update", err);
        }
        // If server returned the updated resource from refetch use it, else fallback to resp or optimistic object
        let returned = updatedDocument;
        if (fresh && typeof fresh === "object") returned = fresh.data;
        else if (resp && typeof resp === "object") returned = resp.data;
        console.log(returned);

        // Merge returned data into existing document state to avoid wiping fields
        try {
          setCurrentDocument((prev) => Object.assign({}, prev || {}, returned));
        } catch (e) {
          // ignore
        }

        if (typeof onUpdate === "function") onUpdate(returned);

        // Ask parent page to refresh its documents list if provided
        if (typeof onRefreshDocuments === "function") {
          try {
            onRefreshDocuments();
          } catch (e) {
            console.warn("onRefreshDocuments threw", e);
          }
        }

        // Dispatch a global event as a fallback for other listeners
        try {
          window.dispatchEvent(new CustomEvent("documents:refresh"));
        } catch (e) {
          // ignore
        }

        setIsEditing(false);
      } catch (err) {
        // Keep editing state so user can retry; optionally show toast is handled by api
        console.error("Failed to update document", err);
      }
    })();
  };

  const handleCancelEdit = () => {
    const src = currentDocument || document || {};
    setEditData({
      name: src.name,
      description: src.description,
      tags: Array.isArray(src.tags) ? src.tags.join(", ") : src.tags || "",
      expiryDate: src.expiryDate || "",
      category: src.type,
    });
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/v1/documents/${id}`, { showToasts: true });
      // notify parent to remove the item from UI
      if (typeof onDelete === "function") onDelete(id);
      // close modal and trigger refresh
      handleClose();
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const handleClose = () => {
    isUpdated ? (onRefreshDocuments(), onClose()) : onClose();
    // // Close modal first
    // try {
    //   if (typeof onClose === "function") onClose();
    // } catch (e) {
    //   // ignore
    // }

    // // Ask parent page to refresh its documents list if provided
    // if (typeof onRefreshDocuments === "function") {
    //   try {
    //     onRefreshDocuments();
    //   } catch (e) {
    //     console.warn("onRefreshDocuments threw", e);
    //   }
    // }

    // // Dispatch a global event as a fallback for other listeners
    // try {
    //   window.dispatchEvent(new CustomEvent("documents:refresh"));
    // } catch (e) {
    //   // ignore
    // }
  };

  const getStatusDisplay = (status, expiryDate) => {
    if (
      status === "expiring" ||
      (expiryDate &&
        new Date(expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    ) {
      return { text: "Verified", color: "bg-green-100 text-green-600" };
    } else if (status === "expired") {
      return { text: "Expired", color: "bg-red-100 text-red-600" };
    } else {
      return { text: "Verified", color: "bg-green-100 text-green-600" };
    }
  };

  const getCategoryLabel = (type) => {
    const category = categories.find((c) => c.value === type);
    return category ? category.label : type;
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    if (expiry < now) {
      return { text: "Expired", color: "text-red-600" };
    }
    return { text: expiryDate, color: "text-red-600" };
  };

  const handleDownload = async () => {
    try {
      const doc = currentDocument || document;
      let filename = doc.fileName || doc.name || "document";
      let fileUrl =
        doc.fileUrl ||
        (doc.file &&
          (doc.file.url || doc.file.fileUrl || doc.file.downloadUrl)) ||
        null;
      if (typeof fileUrl === "string" && fileUrl.startsWith("data:")) {
        const a = window.document.createElement("a");
        a.href = fileUrl;
        a.download = filename;
        window.document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      if (!fileUrl) {
        console.warn("No file URL resolved for download");
        return;
      }

      // Try to fetch the signed URL and download as blob. If fetch fails due to CORS,
      // fallback to opening the signed URL in a new tab so the browser can handle it.
      try {
        const resp = await fetch(fileUrl, { method: "GET" });
        if (!resp.ok) throw new Error("Failed to fetch file for download");
        const blob = await resp.blob();

        // If server provided a filename via Content-Disposition, try to use it
        const cd = resp.headers.get("content-disposition") || "";
        const match =
          cd.match(/filename\*=UTF-8''([^;\n]+)/i) ||
          cd.match(/filename="?([^";\n]+)"?/i);
        if (match && match[1]) {
          try {
            const maybeName = decodeURIComponent(match[1]);
            if (maybeName) filename = maybeName;
          } catch (e) {
            // ignore decode errors
          }
        }

        const objectUrl = window.URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        window.document.body.appendChild(a);
        a.click();
        a.remove();
        // release object URL after a short delay
        setTimeout(() => window.URL.revokeObjectURL(objectUrl), 5000);
      } catch (fetchErr) {
        console.warn(
          "Blob fetch failed, falling back to opening URL directly",
          fetchErr
        );
        // Fallback: open the signed URL in a new tab/window. Browser will handle download.
        window.open(fileUrl, "_blank");
      }
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  if (!isOpen) return null;

  const doc = currentDocument || document;
  const statusDisplay = getStatusDisplay(doc.status, doc.expiryDate);
  const expiryStatus = getExpiryStatus(doc.expiryDate);

  return (
    <div
      style={{ marginTop: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 md:items-center mt-0"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="text-xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-900">
                  {doc.name}
                </h2>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusDisplay.color}`}
                >
                  {statusDisplay.text}
                </span>
                <span className="text-sm text-gray-500">
                  ID: DOC-{String(doc.id).padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-0 md:space-y-6">
          {/* Document Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Category
              </h3>
              {isEditing ? (
                <select
                  name="category"
                  value={editData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{getCategoryLabel(doc.type)}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}
              >
                {statusDisplay.text}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                File Size
              </h3>
              <p className="text-gray-900">{doc.size}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </h3>
              {isEditing ? (
                <input
                  type="date"
                  name="expiryDate"
                  value={editData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p
                  className={
                    expiryStatus ? expiryStatus.color : "text-gray-900"
                  }
                >
                  {expiryStatus ? expiryStatus.text : "No expiry date"}
                  {expiryStatus && expiryStatus.text === "Expired" && (
                    <span className="ml-2 text-red-600 font-medium">
                      Expired
                    </span>
                  )}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Upload Date
              </h3>
              <p className="text-gray-900">{doc.uploadDate}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Description
            </h3>
            {isEditing ? (
              <textarea
                name="description"
                value={editData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {doc.description}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            {isEditing ? (
              <input
                type="text"
                name="tags"
                value={editData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {doc.tags &&
                  doc.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          {isEditing ? (
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-primary-500 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                {/* <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                  <Share className="w-4 h-4" />
                  Share
                </button> */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </button>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this document?"
                    )
                  ) {
                    handleDelete(doc.id);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentModal;
