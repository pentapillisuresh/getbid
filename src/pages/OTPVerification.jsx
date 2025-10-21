import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, RefreshCw } from "lucide-react";
import Header from "../components/shared/Header";
import api from "../services/apiService";
import toastService from "../services/toastService";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginType, email, contact, type } = location.state || {
    loginType: "vendor",
    email: "user@example.com",
    contact: "user@example.com",
    type: "email",
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(
          `input[name="otp-${index + 1}"]`
        );
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="otp-${index - 1}"]`
      );
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toastService.showError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-otp", {
        body: {
          type: type || "email",
          contact: contact || email,
          otp: otpValue,
          deviceDetails: {
            deviceType: "web",
            deviceName: navigator.userAgent || "web-client",
          },
        },
      });

      if (response.success) {
        toastService.showSuccess("OTP verified successfully!");

        // Navigate to respective dashboard after a short delay
        setTimeout(() => {
          if (loginType === "vendor") {
            navigate("/vendor/dashboard");
          } else {
            navigate("/client/dashboard");
          }
        }, 800);
      }
    } catch (error) {
      const message =
        error?.data?.message ||
        error.message ||
        "Invalid OTP. Please try again.";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await api.post("/auth/send-otp", {
        body: {
          type: type || "email",
          contact: contact || email,
        },
      });

      if (response.success) {
        toastService.showSuccess(response.message || "OTP sent successfully!");
        setTimeLeft(300); // Reset timer to 5 minutes
        setOtp(["", "", "", "", "", ""]); // Clear current OTP
      }
    } catch (error) {
      const message =
        error?.data?.message || error.message || "Failed to send OTP";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Shield Icon */}
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-primary-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-600 mb-2">
              We've sent a verification code to your registered{" "}
              {type === "phone" ? "mobile number" : "email address"}
            </p>
            <p className="text-primary-600 font-medium mb-8">
              {contact || email}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      maxLength="1"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Resend code"}
                </button>
              </p>
              {timeLeft > 0 && (
                <p className="text-xs text-gray-500">
                  Code expires in: {formatTime(timeLeft)}
                </p>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Security Notice
                </h4>
                <p className="text-sm text-blue-700">
                  Your session will automatically timeout after 30 minutes of
                  inactivity. Always logout when using shared computers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
