import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, User, Shield, ChevronRight, ArrowLeft, RefreshCw, CheckCircle, Send, Phone, Check } from 'lucide-react';
import Header from '../components/shared/Header';

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRegistrationType = location.state?.registrationType || 'vendor';

  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState(initialRegistrationType);
  const [entityType, setEntityType] = useState('individual');
  const [showPanOtp, setShowPanOtp] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [captchaCode] = useState('8K2M');

  const [formData, setFormData] = useState({
    // Step 1
    panNumber: '',
    panOtp: '',
    
    // Step 2 - Auto-filled details (simulated)
    firstName: 'Rajesh',
    lastName: 'Kumar',
    fatherName: 'Ramesh Kumar',
    dateOfBirth: '1985-06-15',
    address: '123, MG Road, Commercial Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    
    // Contact Information
    email: '',
    mobile: '',
    alternatePhone: '',
    website: '',
    emailOtp: '',
    mobileOtp: '',
    
    // Business Information
    businessCategory: '',
    annualTurnover: '',
    experience: '',
    
    // Step 3 - Verification
    captcha: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Limit OTP fields to 6 digits
    if (name === 'panOtp' || name === 'emailOtp' || name === 'mobileOtp') {
      if (value.length <= 6 && /^\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const sendPanOtp = () => {
    if (formData.panNumber.length === 10) {
      setShowPanOtp(true);
      alert('OTP sent to your registered mobile number');
    } else {
      alert('Please enter a valid PAN number');
    }
  };

  const verifyPanOtp = () => {
    if (formData.panOtp === '123456') {
      setPanVerified(true);
      setShowPanOtp(false);
      alert('PAN verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const sendEmailOtp = () => {
    if (formData.email) {
      setShowEmailOtp(true);
      alert('OTP sent to your email address');
    } else {
      alert('Please enter your email address');
    }
  };

  const verifyEmailOtp = () => {
    if (formData.emailOtp === '123456') {
      setEmailVerified(true);
      setShowEmailOtp(false);
      alert('Email verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const sendMobileOtp = () => {
    if (formData.mobile.length === 10) {
      setShowMobileOtp(true);
      alert('OTP sent to your mobile number');
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  const verifyMobileOtp = () => {
    if (formData.mobileOtp === '123456') {
      setMobileVerified(true);
      setShowMobileOtp(false);
      alert('Mobile number verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !panVerified) {
      alert('Please verify your PAN number first');
      return;
    }
    if (currentStep === 2 && (!emailVerified || !mobileVerified)) {
      alert('Please verify both email and mobile number');
      return;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.captcha === captchaCode && formData.agreeTerms && formData.agreePrivacy) {
      alert('Registration completed successfully!');
      navigate('/choose-login-type');
    } else {
      if (formData.captcha !== captchaCode) {
        alert('Invalid captcha code');
      } else {
        alert('Please accept the terms and conditions');
      }
    }
  };

  const stepTitles = {
    1: 'Choose Registration Type',
    2: 'Contact & Business Information',
    3: 'Final Verification'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step Progress */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step === currentStep 
                      ? 'bg-blue-600 text-white'
                      : step < currentStep 
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {stepTitles[currentStep]}
            </h2>

            {/* Step 1 Content */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Registration Type */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Registration Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRegistrationType('vendor')}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        registrationType === 'vendor'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="font-semibold">📦 Vendor Registration</div>
                      <div className="text-sm text-gray-500">Register as vendor/supplier</div>
                    </button>
                    
                    <button
                      onClick={() => setRegistrationType('client')}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        registrationType === 'client'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="font-semibold">🏢 Client Registration</div>
                      <div className="text-sm text-gray-500">Register as buyer/procuring entity</div>
                    </button>
                  </div>
                </div>

                {/* Entity Type */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Entity Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setEntityType('individual')}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        entityType === 'individual'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <User className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                      <div className="font-semibold">👤 Individual</div>
                      <div className="text-sm text-gray-500">Register with PAN number</div>
                    </button>
                    
                    <button
                      onClick={() => setEntityType('company')}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        entityType === 'company'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                      <div className="font-semibold">🏢 Company</div>
                      <div className="text-sm text-gray-500">Register with GST number</div>
                    </button>
                  </div>
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🆔 PAN Number *
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your PAN number (e.g., ABCDE1234F)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={panVerified}
                  />
                  
                  {!panVerified && !showPanOtp && (
                    <button
                      type="button"
                      onClick={sendPanOtp}
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      📱 Send OTP for Verification
                    </button>
                  )}
                </div>

                {/* PAN OTP Verification */}
                {showPanOtp && !panVerified && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-blue-900">OTP Verification</h4>
                        <p className="text-sm text-blue-700">
                          Enter the OTP sent to your registered mobile number
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="panOtp"
                        value={formData.panOtp}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-4 py-3 text-center text-lg font-mono bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        maxLength="6"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={verifyPanOtp}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
                        >
                          ✅ Verify & Continue
                        </button>
                        <button
                          type="button"
                          onClick={sendPanOtp}
                          className="px-4 py-2 text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAN Verified Message */}
                {panVerified && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">✅ PAN verified successfully!</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2 Content */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* PAN Verified Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">✅ PAN verified successfully! Details auto-filled from government records.</span>
                  </div>
                </div>

                {/* Auto-filled Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    📋 Auto-filled Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    📞 Contact Information (OTP Verification Required)
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Email Section */}
                    <div className={`p-4 rounded-lg border-2 ${emailVerified ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={emailVerified}
                        />
                        {!emailVerified && !showEmailOtp && (
                          <button
                            type="button"
                            onClick={sendEmailOtp}
                            className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Send Email OTP
                          </button>
                        )}
                        {emailVerified && (
                          <div className="px-4 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Verified
                          </div>
                        )}
                      </div>
                      
                      {showEmailOtp && !emailVerified && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            name="emailOtp"
                            value={formData.emailOtp}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-3 text-center text-lg font-mono bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            maxLength="6"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={verifyEmailOtp}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
                            >
                              ✅ Verify
                            </button>
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              className="px-4 py-2 text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50"
                            >
                              Resend
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile Section */}
                    <div className={`p-4 rounded-lg border-2 ${mobileVerified ? 'border-green-200 bg-green-50' : 'border-green-200 bg-green-50'}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number"
                          className="flex-1 px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                          disabled={mobileVerified}
                        />
                        {!mobileVerified && !showMobileOtp && (
                          <button
                            type="button"
                            onClick={sendMobileOtp}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            Send SMS OTP
                          </button>
                        )}
                        {mobileVerified && (
                          <div className="px-4 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Verified
                          </div>
                        )}
                      </div>
                      
                      {showMobileOtp && !mobileVerified && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            name="mobileOtp"
                            value={formData.mobileOtp}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-3 text-center text-lg font-mono bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            maxLength="6"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={verifyMobileOtp}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700"
                            >
                              ✅ Verify
                            </button>
                            <button
                              type="button"
                              onClick={sendMobileOtp}
                              className="px-4 py-2 text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50"
                            >
                              Resend
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone (Optional)</label>
                        <input
                          type="tel"
                          name="alternatePhone"
                          value={formData.alternatePhone}
                          onChange={handleInputChange}
                          placeholder="Alternate contact number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://www.yourwebsite.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🏢 Business Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Category *</label>
                      <select
                        name="businessCategory"
                        value={formData.businessCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select business category</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="trading">Trading</option>
                        <option value="services">Services</option>
                        <option value="construction">Construction</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Turnover (Optional)</label>
                      <select
                        name="annualTurnover"
                        value={formData.annualTurnover}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select annual turnover</option>
                        <option value="under-1cr">Under ₹1 Crore</option>
                        <option value="1-5cr">₹1 - ₹5 Crore</option>
                        <option value="5-10cr">₹5 - ₹10 Crore</option>
                        <option value="above-10cr">Above ₹10 Crore</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience & Expertise (Optional)</label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Brief description of your experience and expertise..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">0/500 characters</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Content */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Almost Done!</h3>
                  <p className="text-gray-600">Please complete the verification and accept our terms</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Security Verification */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Verification *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleInputChange}
                        placeholder="Enter captcha"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 px-4 py-3 rounded-lg font-mono font-bold text-gray-700">
                          {captchaCode}
                        </div>
                        <button type="button" className="p-3 text-gray-400 hover:text-gray-600">
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4 mb-6">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                        required
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the <button type="button" className="text-blue-600 underline">Terms and Conditions</button> of the eTender Portal *
                      </span>
                    </label>
                    
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                        required
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the <button type="button" className="text-blue-600 underline">Privacy Policy</button> and consent to data processing *
                      </span>
                    </label>
                  </div>

                  {/* Important Information */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-900 mb-2">Important Information</h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• Your registration will be reviewed and verified within 24-48 hours</li>
                          <li>• You will receive an email confirmation upon successful verification</li>
                          <li>• Ensure all information provided is accurate and up-to-date</li>
                          <li>• False information may lead to rejection of your application</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      ✅ Complete Registration
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">🔒 Secure Registration</h4>
                <p className="text-sm text-blue-700">
                  Your information is encrypted and securely stored. We use government-verified APIs for PAN and GST validation to ensure authenticity.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <div className="flex justify-center gap-6">
              <button className="hover:text-blue-600">Terms of Service</button>
              <button className="hover:text-blue-600">Privacy Policy</button>
              <button className="hover:text-blue-600">Help & Support</button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Government Verified APIs</span>
              <span className="mx-2">•</span>
              <span>© 2024 eTender Portal. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;