import apiService from "./apiService";

class VendorStatsService {
  async getVendorStats() {
    try {
      console.log("🔄 Calling vendor stats API...");
      const response = await apiService.get("/v1/tenders/vendor/stats");
      console.log("📊 Raw vendor stats response:", response);

      // Handle different response structures
      let statsData = null;

      if (response && typeof response === "object") {
        // If response has a data property, use that
        if (response.data) {
          statsData = response.data;
        }
        // If response has the stats properties directly
        else if (
          response.hasOwnProperty("activeTenders") ||
          response.hasOwnProperty("submittedBids") ||
          response.hasOwnProperty("successRate") ||
          response.hasOwnProperty("underReview")
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
      console.error("❌ Error fetching vendor stats:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch vendor statistics",
      };
    }
  }
}

export default new VendorStatsService();
