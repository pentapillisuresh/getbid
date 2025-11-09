import React from "react";
import {
  X,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Award,
  Clock,
} from "lucide-react";

const VendorDetails = ({ vendor, onClose }) => {
  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vendor Details</h2>
            <p className="text-gray-600 mt-1">{vendor?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {vendor?.name?.charAt(0)?.toUpperCase() || "V"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {vendor?.name}
                      </h2>
                      {/* {vendor?.status === "verified" && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Verified
                        </span>
                      )}
                      {vendor?.status === "suspended" && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          Suspended
                        </span>
                      )}
                      {vendor?.status === "pending" && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          Pending
                        </span>
                      )} */}
                    </div>
                    {/* <p className="text-gray-600 mb-4">{vendor?.category}</p> */}
                    <p className="text-gray-600 mb-4"></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {vendor?.name && (
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">
                                Contact Person
                              </div>
                              <div className="font-medium">{vendor.name}</div>
                            </div>
                          </div>
                        )}
                        {vendor?.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div className="font-medium">{vendor.phone}</div>
                            </div>
                          </div>
                        )}
                        {vendor?.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">Email</div>
                              <div className="font-medium">{vendor.email}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        {vendor?.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">
                                Location
                              </div>
                              <div className="font-medium">
                                {vendor.location}
                              </div>
                            </div>
                          </div>
                        )}
                        {vendor?.company?.yearsOfExperience && (
                          <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">
                                Experience
                              </div>
                              <div className="font-medium">
                                {vendor.company.yearsOfExperience} years
                              </div>
                            </div>
                          </div>
                        )}
                        {vendor?.company?.teamSize && (
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">
                                Team Size
                              </div>
                              <div className="font-medium">
                                {vendor.company.teamSize}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {vendor?.suspensionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                    <div className="flex items-center gap-2 text-red-800 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Suspension Reason</span>
                    </div>
                    <p className="text-red-700">{vendor.suspensionReason}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {vendor?.totalProjects || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Tenders</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {vendor?.tendersWon || 0}
                    </div>
                    <div className="text-sm text-gray-600">Tenders Won</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {vendor?.successRate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-orange-600">
                      {vendor?.lastActivity || "—"}
                    </div>
                    <div className="text-sm text-gray-600">Last Active</div>
                  </div>
                </div>
              </div>
              {vendor?.hasRating && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Performance Ratings
                    </h3>
                    {vendor?.totalRatings > 0 && (
                      <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        Total Ratings: {vendor.totalRatings}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            Technical Rating
                          </span>
                          <span className="text-sm text-gray-600">
                            ({vendor.technicalRating})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRatingStars(vendor.technicalRating)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            Financial Rating
                          </span>
                          <span className="text-sm text-gray-600">
                            ({vendor.financialRating})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRatingStars(vendor.financialRating)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            Delivery Rating
                          </span>
                          <span className="text-sm text-gray-600">
                            ({vendor.deliveryRating})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRatingStars(vendor.deliveryRating)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            Overall Rating
                          </span>
                          <span className="text-sm text-gray-600">
                            ({vendor.overallRating})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRatingStars(vendor.overallRating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {vendor?.totalRatings > 0 && (
                    <p className="text-sm text-gray-500 mt-4">
                      Based on {vendor.totalRatings} rating
                      {vendor.totalRatings !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-6">
              {vendor?.company?.specializations &&
                vendor.company.specializations.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.company.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              {vendor?.company && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Company Information
                  </h3>
                  <div className="space-y-3">
                    {vendor.company.name && (
                      <div>
                        <div className="text-sm text-gray-500">
                          Company Name
                        </div>
                        <div className="font-medium text-gray-900">
                          {vendor.company.name}
                        </div>
                      </div>
                    )}
                    {vendor.company.registrationNumber && (
                      <div>
                        <div className="text-sm text-gray-500">
                          Registration Number
                        </div>
                        <div className="font-medium text-gray-900">
                          {vendor.company.registrationNumber}
                        </div>
                      </div>
                    )}
                    {vendor.company.address && (
                      <div>
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="font-medium text-gray-900">
                          {vendor.company.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
