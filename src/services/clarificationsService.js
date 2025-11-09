import api from "./apiService";

/**
 * Clarifications API Service
 * Handles all clarification/Q&A related API calls
 */

export const clarificationsService = {
  /**
   * Post a new clarification question
   * @param {Object} questionData - Question data
   * @param {string} questionData.tender - Tender ID
   * @param {string} questionData.category - Category of the question
   * @param {string} questionData.question - The question text
   * @param {string} questionData.priority - Priority level: 'low', 'medium', 'high', 'urgent'
   * @param {boolean} questionData.isPublic - Whether the question is public
   * @returns {Promise<Object>} API response
   */
  async postQuestion(questionData) {
    try {
      const response = await api.post("/v1/clarifications", {
        body: questionData,
      });
      return response;
    } catch (error) {
      console.error("Error posting question:", error);
      throw error;
    }
  },

  /**
   * Get clarifications for a specific tender
   * @param {string} tenderId - Tender ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response with clarifications
   */
  async getClarifications(tenderId, params = {}) {
    try {
      const response = await api.get("/v1/clarifications", {
        queryParams: {
          tender: tenderId,
          ...params,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching clarifications:", error);
      throw error;
    }
  },

  /**
   * Get clarification details by ID
   * @param {string} clarificationId - Clarification ID
   * @returns {Promise<Object>} API response with clarification details
   */
  async getClarificationById(clarificationId) {
    try {
      const response = await api.get(`/v1/clarifications/${clarificationId}`);
      return response;
    } catch (error) {
      console.error("Error fetching clarification details:", error);
      throw error;
    }
  },

  /**
   * Get client's tender clarifications with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query (optional)
   * @param {string} params.category - Filter by category (optional)
   * @param {string} params.priority - Filter by priority (optional)
   * @param {string} params.status - Filter by status (optional)
   * @returns {Promise<Object>} API response with clarifications
   */
  async getClientClarifications(params = {}) {
    try {
      const response = await api.get("/v1/clarifications/client/my-tenders", {
        queryParams: params,
      });
      return response;
    } catch (error) {
      console.error("Error fetching client clarifications:", error);
      throw error;
    }
  },

  /**
   * Answer a clarification question
   * @param {string} clarificationId - Clarification ID
   * @param {Object} answerData - Answer data
   * @param {string} answerData.answer - The answer text
   * @param {Array<string>} answerData.attachments - Array of attachment IDs (optional)
   * @returns {Promise<Object>} API response
   */
  async answerClarification(clarificationId, answerData) {
    try {
      const response = await api.put(
        `/v1/clarifications/${clarificationId}/answer`,
        {
          body: answerData,
        }
      );
      return response;
    } catch (error) {
      console.error("Error answering clarification:", error);
      throw error;
    }
  },

  /**
   * Get user's (vendor's) clarifications with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.user - User ID (optional, will use logged-in user if not provided)
   * @returns {Promise<Object>} API response with clarifications
   */
  async getUserClarifications(params = {}) {
    try {
      const response = await api.get("/v1/clarifications", {
        queryParams: params,
      });
      return response;
    } catch (error) {
      console.error("Error fetching user clarifications:", error);
      throw error;
    }
  },

  /**
   * Get vendor clarification statistics
   * @returns {Promise<Object>} API response with stats (totalQuestions, answered, pending, responseRate)
   */
  async getVendorStats() {
    try {
      const response = await api.get("/v1/clarifications/vendor/stats");
      return response;
    } catch (error) {
      console.error("Error fetching vendor stats:", error);
      throw error;
    }
  },
};

export default clarificationsService;
