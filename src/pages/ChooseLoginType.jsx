import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Eye, EyeOff, RefreshCw } from "lucide-react";
import Header from "../components/shared/Header";
import api from "../services/apiService";
import toastService from "../services/toastService";
import firebaseMessagingService from "../services/firebaseMessagingService";

const ChooseLoginType = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("vendor");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
    rememberMe: false,
  });

  // Initialize Firebase messaging on component mount
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await firebaseMessagingService.initialize();
      } catch (error) {
        console.error("Failed to initialize Firebase messaging:", error);
      }
    };

    initializeFirebase();
  }, []);
  // generate a random 4-character captcha: uppercase letters + digits
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const [captchaCode, setCaptchaCode] = useState(() => generateCaptcha());
  const [captchaError, setCaptchaError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    // keep captcha uppercase and limited to 4 chars
    if (name === "captcha") {
      newValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 4);
      // clear captcha error while user types
      if (captchaError) setCaptchaError("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.captcha.trim().toUpperCase() !== captchaCode) {
      setCaptchaError("Invalid captcha. Please try again.");
      // regenerate captcha after a failed attempt
      setCaptchaCode(generateCaptcha());
      // clear the entered captcha
      setFormData((prev) => ({ ...prev, captcha: "" }));
      return;
    }

    // prepare payload and call login API
    const payload = {
      email: formData.email,
      password: formData.password,
      role: loginType === "vendor" ? "vendor" : "client",
      deviceDetails: firebaseMessagingService.getDeviceDetails(),
    };

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        body: payload,
        showToasts: false,
      });

      // expected response: { accessToken, user, sessionId }
      if (res && res.accessToken) {
        // persist tokens and user info
        try {
          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("sessionId", res.sessionId || "");
          localStorage.setItem("user", JSON.stringify(res.user || {}));
        } catch (e) {
          // ignore storage errors
          console.error("Failed to save auth data", e);
        }

        // set default Authorization header for api singleton (preserve existing headers)
        try {
          if (typeof api.setAuthToken === "function") {
            api.setAuthToken(`Bearer ${res.accessToken}`);
          } else {
            // fallback to setDefaults but merge headers to avoid losing Content-Type
            api.setDefaults({
              headers: { Authorization: `Bearer ${res.accessToken}` },
            });
          }
        } catch (e) {
          // ignore
        }

        toastService.showSuccess(
          "Login successful. Please enter the OTP sent to your email."
        );

        // navigate to OTP verification (keep previous behaviour)
        navigate("/otp-verification", {
          state: { loginType, email: formData.email },
        });
      } else {
        // unexpected response
        const msg = (res && (res.message || res.error)) || "Login failed";
        toastService.showError(msg);
      }
    } catch (err) {
      // api.request already shows toast when showToasts true; here show explicit message
      const msg =
        (err && err.data && err.data.message) || err.message || "Login failed";
      toastService.showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register", { state: { registrationType: loginType } });
  };

  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen flex bg-white">
        {/* Left Side Video (Fixed / Stable) */}
        <div className="hidden lg:flex w-1/2 fixed top-15 left-0 h-full bg-white items-start justify-center p-8">
          <div className="max-w-lg w-full">
            <video
              src="./images/loginvideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side Content (Scrollable) */}
        <div className="w-full lg:w-1/2 lg:ml-[50%] flex flex-col min-h-screen overflow-y-auto">
          <div className="flex items-center justify-center flex-1 p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Choose Login Type
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Select your account type to continue
                  </p>
                </div>

                {/* Login Type Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setLoginType("vendor")}
                    className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      loginType === "vendor"
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Building2
                        className={`w-8 h-8 ${
                          loginType === "vendor"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="font-semibold">🏢 Vendor</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Submit bids & manage tenders
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginType("client")}
                    className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      loginType === "client"
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Users
                        className={`w-8 h-8 ${
                          loginType === "client"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="font-semibold">🏛️ Client</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Post tenders & evaluate bids
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Access Level */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🏢 {loginType === "vendor" ? "Vendor" : "Client"} Access
                    Level
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>
                        {loginType === "vendor"
                          ? "Vendor / Supplier"
                          : "Client / Organization"}
                      </option>
                    </select>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address / Username
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your registered email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Security Verification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Verification
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleInputChange}
                        placeholder="Enter captcha"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <div className="bg-gray-100 px-4 py-3 rounded-lg font-mono font-bold text-gray-700 border-2 border-gray-200 select-all">
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCaptchaCode(generateCaptcha());
                            setFormData((prev) => ({ ...prev, captcha: "" }));
                            setCaptchaError("");
                          }}
                          aria-label="Refresh captcha"
                          title="Refresh captcha"
                          className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {captchaError && (
                      <p className="mt-2 text-sm text-red-600">
                        {captchaError}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                      loading
                        ? "opacity-70 cursor-not-allowed bg-gray-400"
                        : "bg-primary-500 hover:!bg-primary-600 active:!bg-primary-700 focus:!bg-primary-600"
                    }`}
                  >
                    {loading
                      ? "Signing in…"
                      : `🏢 Sign in as ${
                          loginType === "vendor" ? "Vendor" : "Client"
                        }`}
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    New {loginType}?{" "}
                    <button
                      onClick={handleRegister}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Register your company
                    </button>
                  </p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Security Notice
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Your session will automatically timeout after 30 minutes
                      of inactivity. Always logout when using shared computers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseLoginType;
