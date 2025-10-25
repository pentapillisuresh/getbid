import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";

const VerifyBidPopup = ({ bidData, onClose, onSubmit }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerificationCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);

      // Get user info for email and userId
      let storedUser = {};
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const raw = window.localStorage.getItem("user");
          if (raw) storedUser = JSON.parse(raw) || {};
        }
      } catch (e) {
        storedUser = {};
      }

      const email = storedUser.email;
      const userId = storedUser._id || storedUser.id;

      if (!email) {
        toastService.showError("Email not found in user profile");
        return;
      }

      if (!userId) {
        toastService.showError("User ID not found in user profile");
        return;
      }

      // Make API call to send OTP
      const body = {
        type: "email",
        contact: email,
        userId: userId,
      };

      const data = await api.post("/auth/send-otp", {
        body,
        showToasts: false,
      });

      if (data && data.success) {
        toastService.showSuccess("New OTP sent successfully to your email");
        // Clear the current verification code
        setVerificationCode("");
      } else {
        throw new Error(data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toastService.showError(error.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifySubmit = async () => {
    if (verificationCode.length !== 6) {
      alert("Please enter a valid 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      // Pass the OTP to parent for verification
      await onSubmit(verificationCode);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Verify Bid Submission
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Verification Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              We've sent a verification code to your registered email address
            </p>
            <p className="text-sm text-blue-600 font-medium">{bidData.email}</p>
          </div>

          {/* Bid Summary */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Bid Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tender:</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">
                  {bidData.tender}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Bid:</span>
                <span className="font-bold text-green-600">
                  {bidData.bidAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timeline:</span>
                <span className="font-medium text-gray-900">
                  {bidData.timeline}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              placeholder="000000"
              className="w-full text-center text-xl font-mono tracking-widest py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="6"
            />
            <p className="text-xs text-gray-500 text-center mt-1">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifySubmit}
            disabled={verificationCode.length !== 6 || isLoading}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              verificationCode.length === 6 && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Verify & Submit Bid
              </>
            )}
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className={`flex-1 py-1.5 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1 ${
                isResending
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              {isResending ? (
                <>
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                "Resend Code"
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-1.5 px-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-yellow-800">
                <span className="font-medium">Security Notice</span>
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                This verification ensures the authenticity of your bid
                submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyBidPopup;
