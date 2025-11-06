import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Eye, EyeOff, ArrowLeft, Mail } from "lucide-react";
import Header from "../components/shared/Header";
import api from "../services/apiService";
import toastService from "../services/toastService";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email + Role, 2: OTP, 3: New Password
  const [role, setRole] = useState("vendor");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData((prev) => ({ ...prev, otp: newOtp }));

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
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="otp-${index - 1}"]`
      );
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toastService.showError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toastService.showError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", {
        body: {
          identifier: formData.email,
          type: "email",
          role: role,
        },
      });

      if (response) {
        toastService.showSuccess("OTP sent to your email successfully!");
        setStep(2);
      }
    } catch (error) {
      const message =
        error?.data?.message ||
        error.message ||
        "Failed to send OTP. Please try again.";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpValue = formData.otp.join("");
    if (otpValue.length !== 6) {
      toastService.showError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify-forgot-password-otp", {
        body: {
          identifier: formData.email,
          type: "email",
          otp: otpValue,
        },
      });

      if (response) {
        toastService.showSuccess("OTP verified successfully!");
        setStep(3);
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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toastService.showError("Please fill in all password fields");
      return;
    }

    if (formData.newPassword.length < 8) {
      toastService.showError("Password must be at least 8 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toastService.showError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const otpValue = formData.otp.join("");
      const response = await api.post("/auth/reset-password", {
        body: {
          identifier: formData.email,
          type: "email",
          otp: otpValue,
          newPassword: formData.newPassword,
        },
      });

      if (response) {
        toastService.showSuccess("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      const message =
        error?.data?.message ||
        error.message ||
        "Failed to reset password. Please try again.";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", {
        body: {
          identifier: formData.email,
          type: "email",
          role: role,
        },
      });

      if (response) {
        toastService.showSuccess("OTP resent successfully!");
        setFormData((prev) => ({ ...prev, otp: ["", "", "", "", "", ""] }));
      }
    } catch (error) {
      const message =
        error?.data?.message ||
        error.message ||
        "Failed to resend OTP. Please try again.";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <button
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else {
                  navigate("/login");
                }
              }}
              className="flex items-center gap-2 mb-4 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

            <h2 className="text-3xl font-bold mb-2">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
            </h2>
            <p className="text-blue-100">
              {step === 1 && "Enter your email to receive OTP"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Create a new password for your account"}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Step 1: Email and Role Selection */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("vendor")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        role === "vendor"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <Users
                        className={`w-8 h-8 ${
                          role === "vendor" ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          role === "vendor" ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        Vendor
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        role === "client"
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      }`}
                    >
                      <Building2
                        className={`w-8 h-8 ${
                          role === "client"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          role === "client"
                            ? "text-purple-600"
                            : "text-gray-600"
                        }`}
                      >
                        Client
                      </span>
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex gap-2 justify-center">
                    {formData.otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        name={`otp-${index}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
