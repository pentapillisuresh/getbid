// Tender-specific API service functions
import api from "./apiService";

/**
 * Upload file for tender documents
 * @param {File} file - The file to upload
 * @returns {Promise} - Upload response with file details
 */
export const uploadTenderDocument = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("/v1/File/upload", {
      body: formData,
      showToasts: false, // Disable individual file upload toasts
      successMessageKey: "message",
    });

    return response;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

/**
 * Upload multiple files for tender documents
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<Array>} - Array of upload responses
 */
export const uploadMultipleTenderDocuments = async (files) => {
  try {
    const uploadPromises = files.map((file) => uploadTenderDocument(file));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading multiple documents:", error);
    throw error;
  }
};

/**
 * Create a new tender
 * @param {Object} tenderData - Tender form data
 * @returns {Promise} - Created tender response
 */
export const createTender = async (tenderData) => {
  // First upload documents if any
  let documentIds = [];

  if (
    tenderData.supportingDocuments &&
    tenderData.supportingDocuments.length > 0
  ) {
    try {
      const uploadResults = await uploadMultipleTenderDocuments(
        tenderData.supportingDocuments
      );
      documentIds = uploadResults.map((result) => result.file._id);
    } catch (error) {
      console.error("Error uploading documents:", error);
      throw new Error("Failed to upload documents. Please try again.");
    }
  }

  // Prepare tender payload
  const tenderPayload = {
    title: tenderData.title,
    category: tenderData.category,
    value: parseInt(tenderData.estimatedValue),
    bidDeadline: tenderData.deadline,
    description: tenderData.description,
    eligibilityCriteria: tenderData.eligibility.filter(
      (criteria) => criteria.trim() !== ""
    ),
    technicalSpecifications: tenderData.specifications,
    meetingDate: tenderData.preBidMeeting ? tenderData.meetingDate : null,
    meetingVenue: tenderData.preBidMeeting ? tenderData.venue : null,
    state: tenderData.state,
    district: tenderData.district,
    address: tenderData.projectAddress,
    contactPerson: tenderData.contactPerson,
    contactNumber: tenderData.contactNumbers,
    locationScope: tenderData.locationScope,
    documents: documentIds,
  };

  try {
    const response = await api.post("/v1/tenders", {
      body: tenderPayload,
      showToasts: true,
      successMessageKey: "message",
    });

    return response;
  } catch (error) {
    console.error("Error creating tender:", error);
    throw error;
  }
};

/**
 * Update an existing tender
 * @param {string} tenderId - ID of the tender to update
 * @param {Object} tenderData - Updated tender form data
 * @returns {Promise} - Updated tender response
 */
export const updateTender = async (tenderId, tenderData) => {
  // Handle document uploads if new documents are added
  let documentIds = [];

  // Separate existing document IDs from new files
  const existingDocumentIds = [];
  const newFiles = [];

  if (
    tenderData.supportingDocuments &&
    tenderData.supportingDocuments.length > 0
  ) {
    console.log("Processing documents:", tenderData.supportingDocuments);

    tenderData.supportingDocuments.forEach((doc, index) => {
      console.log(`Document ${index}:`, {
        type: typeof doc,
        isFile: doc instanceof File,
        hasId: doc && doc._id,
        doc: doc,
      });

      // Check for File object first (new files to upload)
      if (doc instanceof File) {
        console.log(`Document ${index} is a NEW FILE:`, doc.name);
        newFiles.push(doc);
      } else if (typeof doc === "string") {
        // Existing document ID (string format)
        console.log(`Document ${index} is EXISTING (string ID):`, doc);
        existingDocumentIds.push(doc);
      } else if (doc && doc._id) {
        // Existing document object with _id (from edit mode)
        console.log(
          `Document ${index} is EXISTING (object with _id):`,
          doc._id
        );
        existingDocumentIds.push(doc._id);
      } else {
        console.warn(`Document ${index} - Unknown format:`, doc);
      }
    });
  }

  console.log("Update Tender - Existing documents:", existingDocumentIds);
  console.log("Update Tender - New files to upload:", newFiles.length);

  // Upload new files if any
  if (newFiles.length > 0) {
    try {
      const uploadResults = await uploadMultipleTenderDocuments(newFiles);
      const newDocumentIds = uploadResults.map((result) => result.file._id);
      documentIds = [...existingDocumentIds, ...newDocumentIds];
    } catch (error) {
      console.error("Error uploading new documents:", error);
      throw new Error("Failed to upload new documents. Please try again.");
    }
  } else {
    documentIds = existingDocumentIds;
  }

  // Prepare update payload
  const updatePayload = {
    title: tenderData.title,
    category: tenderData.category,
    value: parseInt(tenderData.estimatedValue),
    bidDeadline: tenderData.deadline,
    description: tenderData.description,
    eligibilityCriteria: tenderData.eligibility.filter(
      (criteria) => criteria.trim() !== ""
    ),
    technicalSpecifications: tenderData.specifications,
    meetingDate: tenderData.preBidMeeting ? tenderData.meetingDate : null,
    meetingVenue: tenderData.preBidMeeting ? tenderData.venue : null,
    state: tenderData.state,
    district: tenderData.district,
    address: tenderData.projectAddress,
    contactPerson: tenderData.contactPerson,
    contactNumber: tenderData.contactNumbers,
    locationScope: tenderData.locationScope,
    documents: documentIds,
  };

  try {
    const response = await api.put(`/v1/tenders/${tenderId}`, {
      body: updatePayload,
      showToasts: true,
      successMessageKey: "message",
    });

    return response;
  } catch (error) {
    console.error("Error updating tender:", error);
    throw error;
  }
};

/**
 * Get tender details by ID
 * @param {string} tenderId - ID of the tender to fetch
 * @returns {Promise} - Tender details response
 */
export const getTenderById = async (tenderId) => {
  try {
    const response = await api.get(`/v1/tenders/${tenderId}`);
    return response;
  } catch (error) {
    console.error("Error fetching tender details:", error);
    throw error;
  }
};

/**
 * Get all tenders with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise} - Tenders list response
 */
export const getTenders = async (params = {}) => {
  try {
    const response = await api.get("/v1/tenders", {
      queryParams: params,
    });
    return response;
  } catch (error) {
    console.error("Error fetching tenders:", error);
    throw error;
  }
};

/**
 * Get my tenders (tenders created by the current user)
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - My tenders list response with bid stats
 */
export const getMyTenders = async (params = {}) => {
  try {
    const response = await api.get("/v1/tenders/my-tenders", {
      queryParams: params,
    });
    return response;
  } catch (error) {
    console.error("Error fetching my tenders:", error);
    throw error;
  }
};

/**
 * Delete a tender
 * @param {string} tenderId - ID of the tender to delete
 * @returns {Promise} - Delete response
 */
export const deleteTender = async (tenderId) => {
  try {
    const response = await api.delete(`/v1/tenders/${tenderId}`, {
      showToasts: true,
      successMessageKey: "message",
    });
    return response;
  } catch (error) {
    console.error("Error deleting tender:", error);
    throw error;
  }
};

/**
 * Amend a tender (create amendment)
 * @param {string} tenderId - ID of the tender to amend
 * @param {Object} amendmentData - Amendment data
 * @returns {Promise} - Amendment response
 */
export const amendTender = async (tenderId, amendmentData) => {
  // For amendments, we use the same update endpoint but with amendment flag
  return updateTender(tenderId, amendmentData);
};

/**
 * Submit technical evaluation for a bid
 * @param {string} bidId - ID of the bid to evaluate
 * @param {Object} evaluationData - Technical evaluation data
 * @returns {Promise} - Evaluation submission response
 */
export const submitTechnicalEvaluation = async (bidId, evaluationData) => {
  try {
    const response = await api.patch(`/v1/bids/${bidId}/technical-evaluation`, {
      body: evaluationData,
      showToasts: false, // Disable automatic toasts to prevent duplication
      successMessageKey: "message",
    });
    return response;
  } catch (error) {
    console.error("Error submitting technical evaluation:", error);
    throw error;
  }
};

/**
 * Submit financial evaluation for a bid
 * @param {string} bidId - ID of the bid to evaluate
 * @param {Object} evaluationData - Financial evaluation data
 * @returns {Promise} - Evaluation submission response
 */
export const submitFinancialEvaluation = async (bidId, evaluationData) => {
  try {
    const response = await api.patch(`/v1/bids/${bidId}/financial-evaluation`, {
      body: evaluationData,
      showToasts: false, // Disable automatic toasts to prevent duplication
      successMessageKey: "message",
    });
    return response;
  } catch (error) {
    console.error("Error submitting financial evaluation:", error);
    throw error;
  }
};

/**
 * Get all bids for a specific tender
 * @param {Object} params - Query parameters including tender ID
 * @returns {Promise} - Bids list response
 */
export const getTenderBids = async (params = {}) => {
  try {
    const response = await api.get("/v1/bids", {
      queryParams: params,
    });
    return response;
  } catch (error) {
    console.error("Error fetching tender bids:", error);
    throw error;
  }
};

/**
 * Disqualify a bid with reason
 * @param {string} bidId - ID of the bid to disqualify
 * @param {string} disqualifyReason - Reason for disqualification
 * @returns {Promise} - Disqualification response
 */
export const disqualifyBid = async (bidId, disqualifyReason) => {
  try {
    const response = await api.patch(`/v1/bids/${bidId}/disqualify`, {
      body: { disqualifyReason },
      showToasts: false, // Handle toasts manually in component
      successMessageKey: "message",
    });
    return response;
  } catch (error) {
    console.error("Error disqualifying bid:", error);
    throw error;
  }
};

/**
 * Complete technical evaluation for a tender
 * @param {string} tenderId - ID of the tender to complete technical evaluation
 * @returns {Promise} - Completion response
 */
export const completeTechnicalEvaluation = async (tenderId) => {
  try {
    const response = await api.patch(
      `/v1/tenders/${tenderId}/technical-evaluation`,
      {
        showToasts: false, // Handle toasts manually in component
        successMessageKey: "message",
      }
    );
    return response;
  } catch (error) {
    console.error("Error completing technical evaluation:", error);
    throw error;
  }
};

/**
 * Complete financial evaluation for a tender
 * @param {string} tenderId - ID of the tender to complete financial evaluation
 * @returns {Promise} - Completion response
 */
export const completeFinancialEvaluation = async (tenderId) => {
  try {
    const response = await api.patch(
      `/v1/tenders/${tenderId}/financial-evaluation`,
      {
        showToasts: false, // Handle toasts manually in component
        successMessageKey: "message",
      }
    );
    return response;
  } catch (error) {
    console.error("Error completing financial evaluation:", error);
    throw error;
  }
};

/**
 * Award contract with terms and conditions
 * @param {string} bidId - The ID of the bid to award
 * @param {Object} contractData - Contract terms and conditions
 * @returns {Promise} - Award contract response
 */
export const awardContract = async (bidId, contractData) => {
  try {
    const response = await api.patch(`/v1/bids/${bidId}/contract-terms`, {
      body: {
        duration: contractData.contractDuration,
        bonus: contractData.performanceBond,
        commencementDate: contractData.workCommencementDate,
        completionDate: contractData.expectedCompletionDate,
        conditions: contractData.specialConditions,
        remarks: contractData.remarks,
      },
      showToasts: false,
    });
    return response;
  } catch (error) {
    console.error("Error awarding contract:", error);
    throw error;
  }
};

/**
 * Get closing soon tenders for client
 * @returns {Promise} - Closing soon tenders response
 */
export const getClosingSoonTenders = async () => {
  try {
    const response = await api.get("/v1/tenders/closing-soon", {
      showToasts: false,
    });

    return response;
  } catch (error) {
    console.error("Error fetching closing soon tenders:", error);
    throw error;
  }
};

/**
 * Get closing soon tenders for vendor (available tenders closing soon)
 * @returns {Promise} - Closing soon tenders response
 */
export const getVendorClosingSoonTenders = async () => {
  try {
    // Try vendor-specific endpoint first
    try {
      const response = await api.get("/v1/tenders/closing-soon", {
        showToasts: false,
      });
      return response;
    } catch (vendorEndpointError) {
      console.log(
        "Vendor-specific endpoint not available, falling back to general endpoint"
      );

      // Fallback to general tenders endpoint with vendor view
      const response = await api.get("/v1/tenders", {
        queryParams: {
          page: 1,
          limit: 10,
          isVendorView: true,
          sortBy: "bidDeadline",
          order: "asc",
        },
        showToasts: false,
      });
      return response;
    }
  } catch (error) {
    console.error("Error fetching vendor closing soon tenders:", error);
    throw error;
  }
};

export default {
  uploadTenderDocument,
  uploadMultipleTenderDocuments,
  createTender,
  updateTender,
  getTenderById,
  getTenders,
  getMyTenders,
  deleteTender,
  amendTender,
  submitTechnicalEvaluation,
  submitFinancialEvaluation,
  getTenderBids,
  disqualifyBid,
  completeTechnicalEvaluation,
  completeFinancialEvaluation,
  awardContract,
  getClosingSoonTenders,
  getVendorClosingSoonTenders,
};
