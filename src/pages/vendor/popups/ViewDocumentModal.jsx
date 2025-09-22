import React, { useState } from 'react';
import { X, Download, Share, Edit2, Trash2, FileText } from 'lucide-react';

const ViewDocumentModal = ({ isOpen, onClose, document, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: document.name,
    description: document.description,
    tags: document.tags.join(', '),
    expiryDate: document.expiryDate || '',
    category: document.type
  });

  const categories = [
    { value: 'certificates', label: 'Legal Documents' },
    { value: 'financial', label: 'Financial Documents' },
    { value: 'technical', label: 'Technical Documents' },
    { value: 'proposals', label: 'Marketing Materials' },
    { value: 'contracts', label: 'Experience Documents' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    const updatedDocument = {
      ...document,
      name: editData.name,
      description: editData.description,
      tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      expiryDate: editData.expiryDate || null,
      type: editData.category,
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    onUpdate(updatedDocument);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: document.name,
      description: document.description,
      tags: document.tags.join(', '),
      expiryDate: document.expiryDate || '',
      category: document.type
    });
    setIsEditing(false);
  };

  const getStatusDisplay = (status, expiryDate) => {
    if (status === 'expiring' || (expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))) {
      return { text: 'Verified', color: 'bg-green-100 text-green-600' };
    } else if (status === 'expired') {
      return { text: 'Expired', color: 'bg-red-100 text-red-600' };
    } else {
      return { text: 'Verified', color: 'bg-green-100 text-green-600' };
    }
  };

  const getCategoryLabel = (type) => {
    const category = categories.find(c => c.value === type);
    return category ? category.label : type;
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    if (expiry < now) {
      return { text: 'Expired', color: 'text-red-600' };
    }
    return { text: expiryDate, color: 'text-red-600' };
  };

  if (!isOpen) return null;

  const statusDisplay = getStatusDisplay(document.status, document.expiryDate);
  const expiryStatus = getExpiryStatus(document.expiryDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                <h2 className="text-xl font-semibold text-gray-900">{document.name}</h2>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusDisplay.color}`}>
                  {statusDisplay.text}
                </span>
                <span className="text-sm text-gray-500">ID: DOC-{String(document.id).padStart(3, '0')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              {isEditing ? (
                <select
                  name="category"
                  value={editData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{getCategoryLabel(document.type)}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.text}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">File Size</h3>
              <p className="text-gray-900">{document.size}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Expiry Date</h3>
              {isEditing ? (
                <input
                  type="date"
                  name="expiryDate"
                  value={editData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className={expiryStatus ? expiryStatus.color : 'text-gray-900'}>
                  {expiryStatus ? expiryStatus.text : 'No expiry date'}
                  {expiryStatus && expiryStatus.text === 'Expired' && (
                    <span className="ml-2 text-red-600 font-medium">Expired</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Date</h3>
              <p className="text-gray-900">{document.uploadDate}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={editData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{document.description}</p>
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
                {document.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                  <Share className="w-4 h-4" />
                  Share
                </button>
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
                  if (window.confirm('Are you sure you want to delete this document?')) {
                    onDelete(document.id);
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