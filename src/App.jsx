import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomeMain';
import ChooseLoginType from './pages/ChooseLoginType';
import Registration from './pages/Registration';
import OTPVerification from './pages/OTPVerification';
import VendorDashboard from './pages/vendor/VendorDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/choose-login-type" element={<ChooseLoginType />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/vendor/*" element={<VendorDashboard />} />
          <Route path="/client/*" element={<ClientDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;