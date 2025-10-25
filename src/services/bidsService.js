import api from "./apiService";

/**
 * Bids API Service
 * Handles all bid-related API calls
 */

export const bidsService = {
  /**
   * Delete a bid with reason
   * @param {string} bidId - Bid ID to delete
   * @param {string} deleteReason - Reason for deletion
   * @returns {Promise<Object>} API response
   */
  async deleteBid(bidId, deleteReason) {
    try {
      const response = await api.delete(`/v1/bids/${bidId}`, {
        body: {
          deleteReason,
        },
      });
      return response;
    } catch (error) {
      console.error("Error deleting bid:", error);
      throw error;
    }
  },

  /**
   * Get user's bids with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status (optional)
   * @returns {Promise<Object>} API response with bids data
   */
  async getMyBids(params = {}) {
    try {
      const response = await api.get("/v1/bids/my-bids", {
        queryParams: params,
      });
      return response;
    } catch (error) {
      console.error("Error fetching bids:", error);
      throw error;
    }
  },

  /**
   * Get bid details by ID
   * @param {string} bidId - Bid ID
   * @returns {Promise<Object>} Bid details
   */
  async getBidById(bidId) {
    try {
      const response = await api.get(`/v1/bids/${bidId}`);
      return response;
    } catch (error) {
      console.error("Error fetching bid details:", error);
      throw error;
    }
  },

  /**
   * Submit a new bid
   * @param {Object} bidData - Bid submission data
   * @returns {Promise<Object>} API response
   */
  async submitBid(bidData) {
    try {
      const response = await api.post("/v1/bids", {
        body: bidData,
      });
      return response;
    } catch (error) {
      console.error("Error submitting bid:", error);
      throw error;
    }
  },

  /**
   * Update an existing bid
   * @param {string} bidId - Bid ID to update
   * @param {Object} bidData - Updated bid data
   * @returns {Promise<Object>} API response
   */
  async updateBid(bidId, bidData) {
    try {
      const response = await api.put(`/v1/bids/${bidId}`, {
        body: bidData,
      });
      return response;
    } catch (error) {
      console.error("Error updating bid:", error);
      throw error;
    }
  },
};

export default bidsService;
