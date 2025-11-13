import apiService from "./apiService";

class ClientStatsService {
  async getClientStats() {
    try {
      console.log("🔄 Calling client stats API...");
      const response = await apiService.get("/v1/reports/client/stats");
      console.log("📊 Raw client stats response:", response);

      // Handle different response structures
      let statsData = null;

      if (response && typeof response === "object") {
        // If response has a data property, use that
        if (response.data) {
          statsData = response.data;
        }
        // If response has the stats properties directly
        else if (
          response.hasOwnProperty("totalTenderValue") ||
          response.hasOwnProperty("activeTenders") ||
          response.hasOwnProperty("vendorParticipation") ||
          response.hasOwnProperty("avgProcessingTime")
        ) {
          statsData = response;
        }
        // If response has a different structure, try to extract the data
        else {
          console.log(
            "📊 Unexpected response structure, using as-is:",
            response
          );
          statsData = response;
        }
      }

      console.log("📊 Processed stats data:", statsData);

      return {
        success: true,
        data: statsData,
      };
    } catch (error) {
      console.error("❌ Error fetching client stats:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch client statistics",
      };
    }
  }
}

export default new ClientStatsService();
