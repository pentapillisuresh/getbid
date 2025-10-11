import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Common layout components
import Header from "./pages/Home/Header";
import Footer from "./pages/Home/Footer";

// Pages
import HomePage from "./pages/Home/HomeMain";
import ChooseLoginType from "./pages/ChooseLoginType";
import Registration from "./pages/Registration";
import OTPVerification from "./pages/OTPVerification";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";

// Services
import AnalyticsReporting from "./components/services/AnalyticsReporting";
import BidManagement from "./components/services/BidManagement";
import ComplianceSupport from "./components/services/ComplianceSupport";
import DocumentManagement from "./components/services/DocumentManagement";
import TrainingSupport from "./components/services/TrainingSupport"; 
import TenderSearch from "./components/services/TenderSearch";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header - shown on every page */}
        {/* <Header /> */}

        {/* Main Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/analytics-reporting" element={<AnalyticsReporting />} />
            <Route path="/services/bid-management" element={<BidManagement />} />
            <Route path="/services/compliancesupport" element={<ComplianceSupport />} />
            <Route path="/services/document-management" element={<DocumentManagement />} />
            <Route path="/services/training-support" element={<TrainingSupport />} />
            <Route path="/services/tendersearch" element={<TenderSearch />} />

            <Route path="/choose-login-type" element={<ChooseLoginType />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/vendor/*" element={<VendorDashboard />} />
            <Route path="/client/*" element={<ClientDashboard />} />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer - shown on every page */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
