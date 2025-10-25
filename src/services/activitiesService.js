import api from "./apiService";

/**
 * Activities API Service
 * Handles all activities-related API calls
 */

export const activitiesService = {
  /**
   * Fetch user activities with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.action - Filter by action type (optional)
   * @param {string} params.entityType - Filter by entity type (optional)
   * @param {string} params.severity - Filter by severity (optional)
   * @param {string} params.dateFrom - Filter from date (optional)
   * @param {string} params.dateTo - Filter to date (optional)
   * @returns {Promise<Object>} API response with activities data
   */
  async getMyActivities(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        action,
        entityType,
        severity,
        dateFrom,
        dateTo,
        ...otherParams
      } = params;

      const queryParams = {
        page,
        limit,
        ...otherParams,
      };

      // Add filters if provided
      if (action && action !== "all") queryParams.action = action;
      if (entityType && entityType !== "all")
        queryParams.entityType = entityType;
      if (severity && severity !== "all") queryParams.severity = severity;
      if (dateFrom) queryParams.dateFrom = dateFrom;
      if (dateTo) queryParams.dateTo = dateTo;

      const response = await api.get("/v1/activities/my-activities", {
        queryParams,
      });

      return response;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  /**
   * Get activity details by ID
   * @param {string} activityId - Activity ID
   * @returns {Promise<Object>} Activity details
   */
  async getActivityById(activityId) {
    try {
      const response = await api.get(`/v1/activities/${activityId}`);
      return response;
    } catch (error) {
      console.error("Error fetching activity details:", error);
      throw error;
    }
  },

  /**
   * Export activities to file
   * @param {Object} filters - Export filters
   * @param {string} format - Export format ('csv', 'excel', 'pdf')
   * @returns {Promise<Blob>} File blob
   */
  async exportActivities(filters = {}, format = "csv") {
    try {
      const queryParams = {
        ...filters,
        format,
        export: true,
      };

      const response = await api.get("/v1/activities/export", {
        queryParams,
        responseType: "blob",
      });

      return response;
    } catch (error) {
      console.error("Error exporting activities:", error);
      throw error;
    }
  },

  /**
   * Get activities statistics
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Statistics data
   */
  async getActivitiesStats(filters = {}) {
    try {
      const response = await api.get("/v1/activities/stats", {
        queryParams: filters,
      });
      return response;
    } catch (error) {
      console.error("Error fetching activities stats:", error);
      throw error;
    }
  },
};

export default activitiesService;
