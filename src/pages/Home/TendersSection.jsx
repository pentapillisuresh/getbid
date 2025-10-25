import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  Eye,
  FileText,
  Building,
} from "lucide-react";

const TendersSection = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicTenders();
  }, []);

  const fetchPublicTenders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3003/v1/tenders/public", {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tenders");
      }

      const data = await response.json();

      if (data.success) {
        setTenders(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch tenders");
      }
    } catch (err) {
      console.error("Error fetching tenders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemainingColor = (days) => {
    if (days <= 2) return "text-red-600 bg-red-50";
    if (days <= 5) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "IT Services": "bg-blue-100 text-blue-800",
      Healthcare: "bg-green-100 text-green-800",
      Construction: "bg-orange-100 text-orange-800",
      Education: "bg-purple-100 text-purple-800",
      Transportation: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const handleViewDetails = () => {
    navigate("/choose-login-type");
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Tenders
            </h2>
            <p className="text-lg text-gray-600">
              Discover new business opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Tenders
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">
                Unable to load tenders at the moment. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest Tenders
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover new business opportunities from government and private
            organizations. Browse active tenders and submit your bids to grow
            your business.
          </p>
        </div>

        {/* Tenders Grid */}
        {tenders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tenders.slice(0, 3).map((tender) => (
              <div
                key={tender._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        tender.category
                      )}`}
                    >
                      {tender.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDaysRemainingColor(
                        tender.daysRemaining
                      )}`}
                    >
                      {tender.daysRemaining} days left
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {tender.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    ID: {tender.tenderId}
                  </p>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {tender.description}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  {/* Value */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Value:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(tender.value)}
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-600">Deadline:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(tender.bidDeadline)}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm text-gray-900">
                      {tender.district}, {tender.state}
                    </span>
                  </div>

                  {/* Bid Count */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Bids:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {tender.bidCount} submitted
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`text-sm font-medium capitalize ${
                        tender.status === "in-progress"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {tender.status.replace("-", " ")}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={handleViewDetails}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {/* {tender.documents?.length > 0 && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Tenders Available
            </h3>
            <p className="text-gray-600">
              Check back later for new tender opportunities.
            </p>
          </div>
        )}

        {/* View All Button */}
        {tenders.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleViewDetails}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Tenders
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TendersSection;
