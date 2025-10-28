import { useState, useEffect } from "react";
import {
  Building2,
  User,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Send,
  Phone,
  Check,
  Edit2,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiService";
import toastService from "../services/toastService";
import firebaseMessagingService from "../services/firebaseMessagingService";

const Registration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState("vendor");
  const [entityType, setEntityType] = useState("individual");

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

  const [showPanOtp, setShowPanOtp] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [showGstOtp, setShowGstOtp] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  // File upload states
  const [panFile, setPanFile] = useState(null);
  const [gstFile, setGstFile] = useState(null);
  const [panFileId, setPanFileId] = useState(null);
  const [gstFileId, setGstFileId] = useState(null);

  // Generate a random 4-character captcha: uppercase letters + digits
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
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    panNumber: "",
    panOtp: "",
    gstNumber: "",
    gstOtp: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    companyName: "",
    companyType: "",
    incorporationDate: "",
    address: "",
    city: "",
    state: "",
    email: "",
    mobile: "",
    alternatePhone: "",
    website: "",
    password: "",
    emailOtp: "",
    mobileOtp: "",
    businessCategory: "",
    annualTurnover: "",
    experience: "",
    captcha: "",
    agreeTerms: false,
    agreePrivacy: false,
    // File data will be stored separately in panFile and gstFile state variables
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      name === "panOtp" ||
      name === "emailOtp" ||
      name === "mobileOtp" ||
      name === "gstOtp"
    ) {
      if (value.length <= 6 && /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Handle captcha input: keep uppercase and limited to 4 chars
    let newValue = value;
    if (name === "captcha") {
      newValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 4);
      // Clear captcha error while user types
      if (captchaError) setCaptchaError("");
    }

    // Handle PAN number formatting
    if (name === "panNumber") {
      newValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    }

    // Handle GST number formatting
    if (name === "gstNumber") {
      newValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 15);
    }

    // Reset verification status when email or mobile is changed
    if (name === "email" && value !== formData.email) {
      setEmailVerified(false);
      setShowEmailOtp(false);
      setFormData((prev) => ({ ...prev, emailOtp: "" }));
    }

    if (name === "mobile" && value !== formData.mobile) {
      setMobileVerified(false);
      setShowMobileOtp(false);
      setFormData((prev) => ({ ...prev, mobileOtp: "" }));
    }

    // Reset verification status when PAN or GST is changed
    if (name === "panNumber" && value !== formData.panNumber) {
      setPanVerified(false);
      setShowPanOtp(false);
      setPanFile(null);
      setPanFileId(null);
      // Reset the file input
      const fileInput = document.getElementById("pan-file-input");
      if (fileInput) fileInput.value = "";
      setFormData((prev) => ({ ...prev, panOtp: "" }));
    }

    if (name === "gstNumber" && value !== formData.gstNumber) {
      setGstVerified(false);
      setShowGstOtp(false);
      setGstFile(null);
      setGstFileId(null);
      // Reset the file input
      const fileInput = document.getElementById("gst-file-input");
      if (fileInput) fileInput.value = "";
      setFormData((prev) => ({ ...prev, gstOtp: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  // PAN OTP functions - Commented out for now
  /*
  const sendPanOtp = () => {
    if (formData.panNumber.length === 10) {
      setShowPanOtp(true);
      alert("OTP sent to your registered mobile number");
    } else {
      alert("Please enter a valid PAN number");
    }
  };

  const verifyPanOtp = () => {
    if (formData.panOtp === "123456") {
      setPanVerified(true);
      setShowPanOtp(false);
      alert("PAN verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
  */

  // GST OTP functions - Commented out for now
  /*
  const sendGstOtp = () => {
    if (formData.gstNumber.length === 15) {
      setShowGstOtp(true);
      alert("OTP sent to your registered mobile number");
    } else {
      alert("Please enter a valid GST number");
    }
  };

  const verifyGstOtp = () => {
    if (formData.gstOtp === "123456") {
      setGstVerified(true);
      setShowGstOtp(false);
      alert("GST verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
  */

  // File upload handlers
  const validatePanNumber = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateGstNumber = (gst) => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  // Function to upload file to the backend and get file ID
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/v1/File/upload", {
      body: formData,
      showToasts: false,
    });

    if (response.success && response.file && response.file._id) {
      return response.file._id;
    } else {
      throw new Error(response.message || "File upload failed");
    }
  };

  const handlePanFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate PAN number first
      if (!validatePanNumber(formData.panNumber)) {
        toastService.showError(
          "Please enter a valid PAN number in format ABCDE1234F"
        );
        return;
      }

      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        toastService.showError("Please upload only PDF, JPG, or PNG files");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastService.showError("File size should not exceed 5MB");
        return;
      }

      setPanFile(file);
      setPanVerified(true);
      toastService.showSuccess("PAN document selected successfully!");
    }
  };

  const handleGstFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate GST number first
      if (!validateGstNumber(formData.gstNumber)) {
        toastService.showError(
          "Please enter a valid GST number in format 22AAAAA0000A1Z5"
        );
        return;
      }

      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        toastService.showError("Please upload only PDF, JPG, or PNG files");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastService.showError("File size should not exceed 5MB");
        return;
      }

      setGstFile(file);
      setGstVerified(true);
      toastService.showSuccess("GST document selected successfully!");
    }
  };

  const removePanFile = () => {
    setPanFile(null);
    setPanFileId(null);
    setPanVerified(false);
    // Reset the file input
    const fileInput = document.getElementById("pan-file-input");
    if (fileInput) fileInput.value = "";
  };

  const removeGstFile = () => {
    setGstFile(null);
    setGstFileId(null);
    setGstVerified(false);
    // Reset the file input
    const fileInput = document.getElementById("gst-file-input");
    if (fileInput) fileInput.value = "";
  };

  const sendEmailOtp = async () => {
    if (!formData.email) {
      toastService.showError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/send-otp", {
        body: {
          type: "email",
          contact: formData.email,
        },
      });

      if (response.success) {
        setShowEmailOtp(true);
        toastService.showSuccess(
          response.message || "OTP sent to your email address"
        );
      }
    } catch (error) {
      const message =
        error?.data?.message || error.message || "Failed to send OTP";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!formData.emailOtp || formData.emailOtp.length !== 6) {
      toastService.showError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-otp", {
        body: {
          type: "email",
          contact: formData.email,
          otp: formData.emailOtp,
          deviceDetails: firebaseMessagingService.getDeviceDetails(),
        },
      });

      if (response.success) {
        setEmailVerified(true);
        setShowEmailOtp(false);
        toastService.showSuccess("Email verified successfully!");
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

  const sendMobileOtp = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      toastService.showError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/send-otp", {
        body: {
          type: "phone",
          contact: formData.mobile,
        },
      });

      if (response.success) {
        setShowMobileOtp(true);
        toastService.showSuccess(
          response.message || "OTP sent to your mobile number"
        );
      }
    } catch (error) {
      const message =
        error?.data?.message || error.message || "Failed to send OTP";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyMobileOtp = async () => {
    if (!formData.mobileOtp || formData.mobileOtp.length !== 6) {
      toastService.showError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-otp", {
        body: {
          type: "phone",
          contact: formData.mobile,
          otp: formData.mobileOtp,
          deviceDetails: firebaseMessagingService.getDeviceDetails(),
        },
      });

      if (response.success) {
        setMobileVerified(true);
        setShowMobileOtp(false);
        toastService.showSuccess("Mobile number verified successfully!");
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

  const handleEditEmail = () => {
    setEmailVerified(false);
    setShowEmailOtp(false);
    setFormData((prev) => ({ ...prev, emailOtp: "" }));
    toastService.showSuccess(
      "Email field is now editable. Please verify again after making changes."
    );
  };

  const handleEditMobile = () => {
    setMobileVerified(false);
    setShowMobileOtp(false);
    setFormData((prev) => ({ ...prev, mobileOtp: "" }));
    toastService.showSuccess(
      "Mobile field is now editable. Please verify again after making changes."
    );
  };

  const handleEditPan = () => {
    setPanVerified(false);
    setShowPanOtp(false);
    setFormData((prev) => ({ ...prev, panOtp: "" }));
    setPanFile(null);
    setPanFileId(null);
    // Reset the file input
    const fileInput = document.getElementById("pan-file-input");
    if (fileInput) fileInput.value = "";
    toastService.showSuccess(
      "PAN field is now editable. Please verify again after making changes."
    );
  };

  const handleEditGst = () => {
    setGstVerified(false);
    setShowGstOtp(false);
    setFormData((prev) => ({ ...prev, gstOtp: "" }));
    setGstFile(null);
    setGstFileId(null);
    // Reset the file input
    const fileInput = document.getElementById("gst-file-input");
    if (fileInput) fileInput.value = "";
    toastService.showSuccess(
      "GST field is now editable. Please verify again after making changes."
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (entityType === "individual" && !panVerified) {
        alert("Please verify your PAN number first");
        return;
      }
      if (entityType === "company" && !gstVerified) {
        alert("Please verify your GST number first");
        return;
      }
    }
    if (currentStep === 2) {
      if (!emailVerified || !mobileVerified) {
        alert("Please verify both email and mobile number");
        return;
      }

      // Validate mandatory personal fields
      if (!formData.firstName.trim()) {
        toastService.showError("First Name is required");
        return;
      }

      if (!formData.lastName.trim()) {
        toastService.showError("Last Name is required");
        return;
      }

      if (!formData.fatherName.trim()) {
        toastService.showError("Father's Name is required");
        return;
      }

      if (!formData.dateOfBirth) {
        toastService.showError("Date of Birth is required");
        return;
      }

      // Validate company fields if entity type is company
      // if (entityType === "company") {
      if (
        !formData.companyName ||
        !formData.companyType ||
        !formData.incorporationDate
      ) {
        toastService.showError(
          "Please fill in all required company information fields"
        );
        return;
      }
      // }

      // Ensure user has provided a password (or it will be auto-generated at submit)
      if (!formData.password || formData.password.length < 8) {
        alert("Please enter a password of at least 8 characters");
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateTempPassword = (length = 12) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
    let pw = "";
    for (let i = 0; i < length; i++)
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    return pw;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.captcha.trim().toUpperCase() !== captchaCode) {
      setCaptchaError("Invalid captcha. Please try again.");
      // Regenerate captcha after a failed attempt
      setCaptchaCode(generateCaptcha());
      // Clear the entered captcha
      setFormData((prev) => ({ ...prev, captcha: "" }));
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toastService.showError("Please accept the terms and conditions");
      return;
    }

    // Validate mandatory fields
    if (!formData.firstName.trim()) {
      toastService.showError("First Name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      toastService.showError("Last Name is required");
      return;
    }

    if (!formData.fatherName.trim()) {
      toastService.showError("Father's Name is required");
      return;
    }

    if (!formData.dateOfBirth) {
      toastService.showError("Date of Birth is required");
      return;
    }

    try {
      setLoading(true);

      // Upload files first if they exist
      let panFileId = null;
      let gstFileId = null;

      if (panFile) {
        try {
          panFileId = await uploadFile(panFile);
          toastService.showSuccess("PAN document uploaded successfully!");
        } catch (error) {
          toastService.showError(
            error.message || "Failed to upload PAN document"
          );
          return;
        }
      }

      if (gstFile) {
        try {
          gstFileId = await uploadFile(gstFile);
          toastService.showSuccess("GST document uploaded successfully!");
        } catch (error) {
          toastService.showError(
            error.message || "Failed to upload GST document"
          );
          return;
        }
      }

      // Build payload according to API spec
      const name =
        [formData.firstName, formData.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        formData.firstName ||
        formData.lastName ||
        "";
      const password =
        formData.password && formData.password.length >= 8
          ? formData.password
          : generateTempPassword(); // prefer user password if provided

      const payload = {
        name,
        fatherName: formData.fatherName || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        email: formData.email || undefined,
        phoneNumber: formData.mobile || undefined,
        role: registrationType === "client" ? "client" : "vendor",
        entity: entityType === "company" ? "company" : "individual",
        PAN:
          entityType === "individual"
            ? formData.panNumber || undefined
            : undefined,
        GST:
          entityType === "company"
            ? formData.gstNumber || undefined
            : undefined,
        PANDocument: panFileId || undefined,
        GSTDocument: gstFileId || undefined,
        alternativePhoneNumber: formData.alternatePhone || undefined,
        website: formData.website || undefined,
        password,
        businessInfo: {
          category: formData.businessCategory || undefined,
          annualTurnover: formData.annualTurnover || undefined,
          experience: formData.experience || undefined,
        },
        deviceDetails: firebaseMessagingService.getDeviceDetails(),
        company: {
          name: formData.companyName || undefined,
          companyType: formData.companyType || undefined,
          incorporationDate: formData.incorporationDate || undefined,
        },
        // : undefined,
      };

      const res = await api.post("/auth/signup", {
        body: payload,
        showToasts: false,
      });

      // If backend returns a message, show it; otherwise show generic success
      if (res && (res.message || res.msg)) {
        toastService.showSuccess(res.message || res.msg);
      } else {
        toastService.showSuccess(
          "Registration completed successfully. Please check your email."
        );
      }

      // navigate to login/choose page
      setTimeout(() => navigate("/choose-login-type"), 800);
    } catch (err) {
      const message =
        (err && err.data && err.data.message) ||
        err.message ||
        "Registration failed";
      toastService.showError(message);
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: "Choose Registration Type",
    2: "Contact & Business Information",
    3: "Final Verification",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Registration Portal
            </h1>

            <div className="flex items-center justify-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                      step === currentStep
                        ? "bg-white text-blue-600 shadow-lg"
                        : step < currentStep
                        ? "bg-blue-200 text-blue-700"
                        : "bg-blue-400 text-blue-100"
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded ${
                        step < currentStep ? "bg-blue-200" : "bg-blue-400"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-6">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
              {stepTitles[currentStep]}
            </h2>

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Choose Registration Type
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRegistrationType("vendor")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        registrationType === "vendor"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="font-semibold mb-1">Vendor</div>
                      <div className="text-xs text-gray-600">
                        Register as vendor
                      </div>
                    </button>

                    <button
                      onClick={() => setRegistrationType("client")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        registrationType === "client"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="font-semibold mb-1">Client</div>
                      <div className="text-xs text-gray-600">
                        Register as buyer
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Entity Type
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setEntityType("individual");
                        setPanVerified(false);
                        setShowPanOtp(false);
                        setGstVerified(false);
                        setShowGstOtp(false);
                        // Clear company files
                        setGstFile(null);
                        const gstFileInput =
                          document.getElementById("gst-file-input");
                        if (gstFileInput) gstFileInput.value = "";
                        // Clear company form data
                        setFormData((prev) => ({
                          ...prev,
                          companyName: "",
                          companyType: "",
                          incorporationDate: "",
                          gstNumber: "",
                          gstOtp: "",
                        }));
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        entityType === "individual"
                          ? "border-gray-500 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <User className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                      <div className="font-semibold mb-1">Individual</div>
                      <div className="text-xs text-gray-600">
                        Register with PAN
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setEntityType("company");
                        setPanVerified(false);
                        setShowPanOtp(false);
                        setGstVerified(false);
                        setShowGstOtp(false);
                        // Clear PAN files
                        setPanFile(null);
                        const panFileInput =
                          document.getElementById("pan-file-input");
                        if (panFileInput) panFileInput.value = "";
                        // Clear PAN form data and set company defaults
                        setFormData((prev) => ({
                          ...prev,
                          panNumber: "",
                          panOtp: "",
                          companyName: "",
                          companyType: "",
                          incorporationDate: "",
                        }));
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        entityType === "company"
                          ? "border-gray-500 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                      <div className="font-semibold mb-1">Company</div>
                      <div className="text-xs text-gray-600">
                        Register with GST
                      </div>
                    </button>
                  </div>
                </div>

                {entityType === "individual" ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="ABCDE1234F"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={panVerified}
                    />

                    {/* OTP Verification - Commented out for now */}
                    {/* {!panVerified && !showPanOtp && (
                      <button
                        type="button"
                        onClick={sendPanOtp}
                        className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                      >
                        Send OTP
                      </button>
                    )}

                    {showPanOtp && !panVerified && (
                      <div className="mt-4 space-y-3">
                        <input
                          type="text"
                          name="panOtp"
                          value={formData.panOtp}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit OTP"
                          className="w-full px-4 py-3 text-center text-xl font-mono bg-white border-2 border-blue-300 rounded-lg tracking-widest"
                          maxLength="6"
                        />
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={verifyPanOtp}
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={sendPanOtp}
                            className="px-4 py-2 text-blue-600 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50"
                          >
                            Resend
                          </button>
                        </div>
                      </div>
                    )} */}

                    {/* File Upload Section - Only enabled if PAN number is valid */}
                    {!panVerified && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload PAN Document *
                        </label>
                        {formData.panNumber &&
                        validatePanNumber(formData.panNumber) ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <input
                              id="pan-file-input"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handlePanFileUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="pan-file-input"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">
                                Click to select PAN document
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                PDF, JPG, PNG (Max 5MB)
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                            <Upload className="w-8 h-8 text-gray-300 mb-2 mx-auto" />
                            <span className="text-sm text-gray-400">
                              Please enter a valid PAN number first
                            </span>
                            <span className="text-xs text-gray-400 block mt-1">
                              Format: ABCDE1234F (5 letters + 4 digits + 1
                              letter)
                            </span>
                          </div>
                        )}
                        {panFile && (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-800">
                                {panFile.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={removePanFile}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {panVerified && (
                      <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">
                              PAN document selected successfully!
                            </span>
                          </div>
                          <div className="relative group">
                            <div
                              className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer transition-all group-hover:bg-blue-600"
                              onClick={handleEditPan}
                            >
                              <Check className="w-4 h-4 group-hover:hidden" />
                              <Edit2 className="w-4 h-4 hidden group-hover:block" />
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Click to edit PAN
                            </div>
                          </div>
                        </div>
                        {panFile && (
                          <div className="mt-2 bg-white border border-blue-200 rounded-lg p-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">
                              {panFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      GST Number *
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      placeholder="22AAAAA0000A1Z5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={gstVerified}
                    />

                    {/* OTP Verification - Commented out for now */}
                    {/* {!gstVerified && !showGstOtp && (
                      <button
                        type="button"
                        onClick={sendGstOtp}
                        className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                      >
                        Send OTP
                      </button>
                    )}

                    {showGstOtp && !gstVerified && (
                      <div className="mt-4 space-y-3">
                        <input
                          type="text"
                          name="gstOtp"
                          value={formData.gstOtp}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit OTP"
                          className="w-full px-4 py-3 text-center text-xl font-mono bg-white border-2 border-blue-300 rounded-lg tracking-widest"
                          maxLength="6"
                        />
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={verifyGstOtp}
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={sendGstOtp}
                            className="px-4 py-2 text-blue-600 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50"
                          >
                            Resend
                          </button>
                        </div>
                      </div>
                    )} */}

                    {/* File Upload Section - Only enabled if GST number is valid */}
                    {!gstVerified && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload GST Document *
                        </label>
                        {formData.gstNumber &&
                        validateGstNumber(formData.gstNumber) ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <input
                              id="gst-file-input"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleGstFileUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="gst-file-input"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">
                                Click to select GST document
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                PDF, JPG, PNG (Max 5MB)
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                            <Upload className="w-8 h-8 text-gray-300 mb-2 mx-auto" />
                            <span className="text-sm text-gray-400">
                              Please enter a valid GST number first
                            </span>
                            <span className="text-xs text-gray-400 block mt-1">
                              Format: 22AAAAA0000A1Z5 (15 characters)
                            </span>
                          </div>
                        )}
                        {gstFile && (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-800">
                                {gstFile.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={removeGstFile}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {gstVerified && (
                      <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">
                              GST document selected successfully!
                            </span>
                          </div>
                          <div className="relative group">
                            <div
                              className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer transition-all group-hover:bg-blue-600"
                              onClick={handleEditGst}
                            >
                              <Check className="w-4 h-4 group-hover:hidden" />
                              <Edit2 className="w-4 h-4 hidden group-hover:block" />
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Click to edit GST
                            </div>
                          </div>
                        </div>
                        {gstFile && (
                          <div className="mt-2 bg-white border border-blue-200 rounded-lg p-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">
                              {gstFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {entityType === "individual" ? "PAN" : "GST"} verified!
                      Details auto-filled.
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {entityType === "individual"
                      ? "Personal"
                      : "Company & Personal"}{" "}
                    Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Father's Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                        required
                      />
                    </div>

                    {/* Company Information Fields */}
                    {/* {entityType === "company" && ( */}
                    <>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="TechCorp Solutions Private Limited"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Company Type *
                        </label>
                        <select
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                          required
                        >
                          <option value="">Select Company Type</option>
                          <option value="Private Limited Company">
                            Private Limited Company
                          </option>
                          <option value="Public Limited Company">
                            Public Limited Company
                          </option>
                          <option value="Limited Liability Partnership">
                            Limited Liability Partnership
                          </option>
                          <option value="Partnership">Partnership</option>
                          <option value="Sole Proprietorship">
                            Sole Proprietorship
                          </option>
                          <option value="One Person Company">
                            One Person Company
                          </option>
                          <option value="Section 8 Company">
                            Section 8 Company
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Incorporation Date *
                        </label>
                        <input
                          type="date"
                          name="incorporationDate"
                          value={formData.incorporationDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                          required
                        />
                      </div>
                    </>
                    {/* )} */}

                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-xl border-2 ${
                        emailVerified
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                          disabled={emailVerified}
                        />
                        {!emailVerified && !showEmailOtp && (
                          <button
                            type="button"
                            onClick={sendEmailOtp}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {emailVerified && (
                          <div className="relative group">
                            <div
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 cursor-pointer transition-all group-hover:bg-blue-600"
                              onClick={handleEditEmail}
                            >
                              <Check className="w-4 h-4 group-hover:hidden" />
                              <Edit2 className="w-4 h-4 hidden group-hover:block" />
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Click to edit email
                            </div>
                          </div>
                        )}
                      </div>

                      {!emailVerified && !showEmailOtp && formData.email && (
                        <div className="text-xs text-orange-600 mb-3">
                          Please verify your email address
                        </div>
                      )}

                      {showEmailOtp && !emailVerified && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            name="emailOtp"
                            value={formData.emailOtp}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-3 py-2 text-center text-lg font-mono bg-white border-2 border-blue-300 rounded-lg tracking-widest"
                            maxLength="6"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={verifyEmailOtp}
                              disabled={loading}
                              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Verifying..." : "Verify"}
                            </button>
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              disabled={loading}
                              className="px-4 py-2 text-blue-600 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Sending..." : "Resend"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-xl border-2 ${
                        mobileVerified
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                          disabled={mobileVerified}
                        />
                        {!mobileVerified && !showMobileOtp && (
                          <button
                            type="button"
                            onClick={sendMobileOtp}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {mobileVerified && (
                          <div className="relative group">
                            <div
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 cursor-pointer transition-all group-hover:bg-blue-600"
                              onClick={handleEditMobile}
                            >
                              <Check className="w-4 h-4 group-hover:hidden" />
                              <Edit2 className="w-4 h-4 hidden group-hover:block" />
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Click to edit mobile
                            </div>
                          </div>
                        )}
                      </div>

                      {!mobileVerified && !showMobileOtp && formData.mobile && (
                        <div className="text-xs text-orange-600 mb-3">
                          Please verify your mobile number
                        </div>
                      )}

                      {showMobileOtp && !mobileVerified && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            name="mobileOtp"
                            value={formData.mobileOtp}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-3 py-2 text-center text-lg font-mono bg-white border-2 border-blue-300 rounded-lg tracking-widest"
                            maxLength="6"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={verifyMobileOtp}
                              disabled={loading}
                              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Verifying..." : "Verify"}
                            </button>
                            <button
                              type="button"
                              onClick={sendMobileOtp}
                              disabled={loading}
                              className="px-4 py-2 text-blue-600 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Sending..." : "Resend"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Alternate Phone
                        </label>
                        <input
                          type="tel"
                          name="alternatePhone"
                          value={formData.alternatePhone}
                          onChange={handleInputChange}
                          placeholder="Optional"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="Optional"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4 col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Choose a Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="At least 8 characters"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Use a strong password. Minimum 8 characters recommended.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Business Category *
                      </label>
                      <select
                        name="businessCategory"
                        value={formData.businessCategory}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="trading">Trading</option>
                        <option value="services">Services</option>
                        <option value="construction">Construction</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Annual Turnover
                      </label>
                      <select
                        name="annualTurnover"
                        value={formData.annualTurnover}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select turnover</option>
                        <option value="under-1cr">Under ₹1 Cr</option>
                        <option value="1-5cr">₹1 - ₹5 Cr</option>
                        <option value="5-10cr">₹5 - ₹10 Cr</option>
                        <option value="above-10cr">Above ₹10 Cr</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Experience
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Brief description..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Almost Done!
                  </h3>
                  <p className="text-gray-600">
                    Complete verification and accept terms
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Security Verification *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleInputChange}
                        placeholder="Enter captcha"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                        maxLength="4"
                      />
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 px-4 py-3 rounded-lg font-mono font-bold text-gray-700 text-lg tracking-wider border-2 border-gray-200 select-all">
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

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-blue-600 underline font-semibold"
                        >
                          Terms and Conditions
                        </button>{" "}
                        *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-blue-600 underline font-semibold"
                        >
                          Privacy Policy
                        </button>{" "}
                        *
                      </span>
                    </label>
                  </div>

                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Important
                        </h4>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Registration reviewed within 24-48 hours</li>
                          <li>• Email confirmation upon verification</li>
                          <li>• Ensure all information is accurate</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg"
                    >
                      Complete Registration
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep < 3 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg ${
                    currentStep === 1 ? "ml-auto" : ""
                  }`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Secure Registration
              </h4>
              <p className="text-sm text-blue-700">
                Your information is encrypted and securely stored. We use
                government-verified APIs.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-700 text-sm">
            Already registered?{" "}
            <button
              onClick={() => navigate("/choose-login-type")}
              className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors"
            >
              Login here
            </button>
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <div className="flex justify-center gap-6 mb-2">
            <button className="hover:text-blue-600 font-medium">Terms</button>
            <button className="hover:text-blue-600 font-medium">Privacy</button>
            <button className="hover:text-blue-600 font-medium">Support</button>
          </div>
          <div className="text-xs">
            © 2025 eTender Portal. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
