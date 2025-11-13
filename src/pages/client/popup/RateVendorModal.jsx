import React, { useState } from "react";
import { X, Star } from "lucide-react";
import toastService from "../../../services/toastService";

const RateVendorModal = ({ vendor, onClose, onSubmit }) => {
  const [ratings, setRatings] = useState({
    technical: vendor?.technicalRating || 0,
    financial: vendor?.financialRating || 0,
    delivery: vendor?.deliveryRating || 0,
    overall: vendor?.overallRating || 0,
  });
  const [hoveredRating, setHoveredRating] = useState({
    technical: 0,
    financial: 0,
    delivery: 0,
    overall: 0,
  });
  const [feedback, setFeedback] = useState(vendor?.additionalFeedback || "");
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleStarHover = (category, value) => {
    setHoveredRating((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all ratings are provided
    if (
      ratings.technical === 0 ||
      ratings.financial === 0 ||
      ratings.delivery === 0 ||
      ratings.overall === 0
    ) {
      toastService.showError(
        "Please provide all 4 ratings (Technical, Financial, Delivery, and Overall)"
      );
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        vendorId: vendor.id,
        ratings,
        feedback,
      });
      toastService.showSuccess("Rating submitted successfully");
      onClose();
    } catch (error) {
      toastService.showError(error?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (category) => {
    const currentRating = ratings[category];
    const hovered = hoveredRating[category];

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(category, star)}
            onMouseEnter={() => handleStarHover(category, star)}
            onMouseLeave={() => handleStarHover(category, 0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hovered || currentRating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-lg font-medium text-gray-700">
          {currentRating > 0 ? currentRating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {vendor?.hasRating ? "Update Rating" : "Rate Vendor"}
            </h2>
            <p className="text-gray-600 mt-1">{vendor?.name}</p>
            {vendor?.hasRating && (
              <p className="text-sm text-blue-600 mt-1">
                You have already rated this vendor. Update your rating below.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vendor Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Contact Person:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {vendor?.contactPerson || vendor?.name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Company:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {vendor?.company?.name || "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {vendor?.email}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Company Type:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {vendor?.company?.companyType || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Rating
              </label>
              <div className="flex items-center">
                {renderStars("technical")}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rate the vendor's technical expertise and quality of work
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Rating
              </label>
              <div className="flex items-center">
                {renderStars("financial")}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rate the vendor's pricing, budget management, and financial
                reliability
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Rating
              </label>
              <div className="flex items-center">{renderStars("delivery")}</div>
              <p className="text-xs text-gray-500 mt-1">
                Rate the vendor's ability to meet deadlines and delivery
                commitments
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center">{renderStars("overall")}</div>
              <p className="text-xs text-gray-500 mt-1">
                Your overall satisfaction with this vendor
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your experience working with this vendor..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                submitting ||
                ratings.technical === 0 ||
                ratings.financial === 0 ||
                ratings.delivery === 0 ||
                ratings.overall === 0
              }
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? vendor?.hasRating
                  ? "Updating..."
                  : "Submitting..."
                : vendor?.hasRating
                ? "Update Rating"
                : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateVendorModal;
