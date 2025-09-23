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

      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Registration Portal</h1>
                <p className="text-primary-100">Complete your registration in 3 simple steps</p>
              </div>
              
              {/* Step Progress */}
              <div className="flex items-center justify-center mt-8">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold ${
                        step === currentStep
                          ? 'bg-white text-primary-600 shadow-lg'
                          : step < currentStep
                            ? 'bg-primary-200 text-primary-700'
                            : 'bg-primary-400 text-primary-100'
                      }`}>
                      {step < currentStep ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 3 && (
                      <div className={`w-20 h-1 mx-4 rounded ${
                          step < currentStep ? 'bg-primary-200' : 'bg-primary-400'
                        }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="px-8 py-8">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                {stepTitles[currentStep]}
              </h2>

              {/* Step 1 Content */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  {/* Registration Type */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Choose Registration Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setRegistrationType('vendor')}
                        className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                            registrationType === 'vendor'
                              ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <Building2 className="w-10 h-10 mx-auto mb-4 text-primary-600" />
                        <div className="font-semibold text-lg mb-2">📦 Vendor Registration</div>
                        <div className="text-sm text-gray-600">Register as vendor/supplier to participate in tenders</div>
                      </button>

                      <button
                        onClick={() => setRegistrationType('client')}
                        className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                            registrationType === 'client'
                              ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <Building2 className="w-10 h-10 mx-auto mb-4 text-primary-600" />
                        <div className="font-semibold text-lg mb-2">🏢 Client Registration</div>
                        <div className="text-sm text-gray-600">Register as buyer/procuring entity to post tenders</div>
                      </button>
                    </div>
                  </div>

                  {/* Entity Type */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Entity Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setEntityType('individual')}
                        className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                            entityType === 'individual'
                              ? 'border-gray-500 bg-gray-50 text-gray-700 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <User className="w-10 h-10 mx-auto mb-4 text-gray-600" />
                        <div className="font-semibold text-lg mb-2">👤 Individual</div>
                        <div className="text-sm text-gray-600">Register with PAN number as individual</div>
                      </button>

                      <button
                        onClick={() => setEntityType('company')}
                        className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                            entityType === 'company'
                              ? 'border-gray-500 bg-gray-50 text-gray-700 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <Building2 className="w-10 h-10 mx-auto mb-4 text-gray-600" />
                        <div className="font-semibold text-lg mb-2">🏢 Company</div>
                        <div className="text-sm text-gray-600">Register with GST number as organization</div>
                      </button>
                    </div>
                  </div>

                  {/* PAN Number */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      🆔 PAN Number *
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your PAN number (e.g., ABCDE1234F)"
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                      required
                      disabled={panVerified}
                    />

                    {!panVerified && !showPanOtp && (
                      <button
                        type="button"
                        onClick={sendPanOtp}
                        className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        📱 Send OTP for Verification
                      </button>
                    )}
                  </div>

                  {/* PAN OTP Verification */}
                  {showPanOtp && !panVerified && (
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Shield className="w-8 h-8 text-primary-600" />
                        <div>
                          <h4 className="font-semibold text-primary-900 text-lg">OTP Verification</h4>
                          <p className="text-primary-700">
                            Enter the OTP sent to your registered mobile number
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="panOtp"
                          value={formData.panOtp}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit OTP"
                          className="w-full px-6 py-4 text-center text-2xl font-mono bg-white border-2 border-primary-300 rounded-xl focus:ring-2 focus:ring-primary-500 tracking-widest"
                          maxLength="6"
                        />
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={verifyPanOtp}
                            className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                          >
                            ✅ Verify & Continue
                          </button>
                          <button
                            type="button"
                            onClick={sendPanOtp}
                            className="px-6 py-3 text-primary-600 bg-white border-2 border-primary-300 rounded-xl hover:bg-primary-50 transition-colors"
                          >
                            Resend OTP
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PAN Verified Message */}
                  {panVerified && (
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 text-primary-700">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold text-lg">✅ PAN verified successfully!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2 Content */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* PAN Verified Notice */}
                  <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 text-primary-700 mb-2">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold text-lg">✅ PAN verified successfully! Details auto-filled from government records.</span>
                    </div>
                  </div>

                  {/* Auto-filled Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                      📋 Auto-filled Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Father's Name</label>
                        <input
                          type="text"
                          value={formData.fatherName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Date of Birth</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                          readOnly
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                      📞 Contact Information (OTP Verification Required)
                    </h3>

                    <div className="space-y-6">
                      {/* Email Section */}
                      <div className={`p-6 rounded-2xl border-2 ${
                          emailVerified ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Email Address *</label>
                        <div className="flex gap-3 mb-4">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            disabled={emailVerified}
                          />
                          {!emailVerified && !showEmailOtp && (
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2 whitespace-nowrap font-medium"
                            >
                              <Send className="w-4 h-4" />
                              Send OTP
                            </button>
                          )}
                          {emailVerified && (
                            <div className="px-6 py-3 bg-primary-500 text-white rounded-xl flex items-center gap-2 whitespace-nowrap">
                              <Check className="w-4 h-4" />
                              Verified
                            </div>
                          )}
                        </div>

                        {showEmailOtp && !emailVerified && (
                          <div className="space-y-4">
                            <input
                              type="text"
                              name="emailOtp"
                              value={formData.emailOtp}
                              onChange={handleInputChange}
                              placeholder="Enter 6-digit OTP"
                              className="w-full px-4 py-3 text-center text-xl font-mono bg-white border-2 border-primary-300 rounded-xl focus:ring-2 focus:ring-primary-500 tracking-widest"
                              maxLength="6"
                            />
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={verifyEmailOtp}
                                className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-600"
                              >
                                ✅ Verify
                              </button>
                              <button
                                type="button"
                                onClick={sendEmailOtp}
                                className="px-6 py-3 text-primary-600 bg-white border-2 border-primary-300 rounded-xl hover:bg-primary-50"
                              >
                                Resend
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile Section */}
                      <div className={`p-6 rounded-2xl border-2 ${
                          mobileVerified ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Mobile Number *</label>
                        <div className="flex gap-3 mb-4">
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="10-digit mobile number"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            disabled={mobileVerified}
                          />
                          {!mobileVerified && !showMobileOtp && (
                            <button
                              type="button"
                              onClick={sendMobileOtp}
                              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center gap-2 whitespace-nowrap font-medium"
                            >
                              <Phone className="w-4 h-4" />
                              Send OTP
                            </button>
                          )}
                          {mobileVerified && (
                            <div className="px-6 py-3 bg-primary-500 text-white rounded-xl flex items-center gap-2 whitespace-nowrap">
                              <Check className="w-4 h-4" />
                              Verified
                            </div>
                          )}
                        </div>

                        {showMobileOtp && !mobileVerified && (
                          <div className="space-y-4">
                            <input
                              type="text"
                              name="mobileOtp"
                              value={formData.mobileOtp}
                              onChange={handleInputChange}
                              placeholder="Enter 6-digit OTP"
                              className="w-full px-4 py-3 text-center text-xl font-mono bg-white border-2 border-primary-300 rounded-xl focus:ring-2 focus:ring-primary-500 tracking-widest"
                              maxLength="6"
                            />
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={verifyMobileOtp}
                                className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700"
                              >
                                ✅ Verify
                              </button>
                              <button
                                type="button"
                                onClick={sendMobileOtp}
                                className="px-6 py-3 text-primary-600 bg-white border-2 border-primary-300 rounded-xl hover:bg-primary-50"
                              >
                                Resend
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Alternate Phone (Optional)</label>
                          <input
                            type="tel"
                            name="alternatePhone"
                            value={formData.alternatePhone}
                            onChange={handleInputChange}
                            placeholder="Alternate contact number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Website (Optional)</label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://www.yourwebsite.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                      🏢 Business Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Business Category *</label>
                        <select
                          name="businessCategory"
                          value={formData.businessCategory}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Annual Turnover (Optional)</label>
                        <select
                          name="annualTurnover"
                          value={formData.annualTurnover}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select annual turnover</option>
                          <option value="under-1cr">Under ₹1 Crore</option>
                          <option value="1-5cr">₹1 - ₹5 Crore</option>
                          <option value="5-10cr">₹5 - ₹10 Crore</option>
                          <option value="above-10cr">Above ₹10 Crore</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Experience & Expertise (Optional)</label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Brief description of your experience and expertise..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                      <div className="text-xs text-gray-500 mt-2">0/500 characters</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Content */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">Almost Done!</h3>
                    <p className="text-gray-600 text-lg">Please complete the verification and accept our terms</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Security Verification */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <label className="block text-lg font-semibold text-gray-700 mb-4">
                        Security Verification *
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          name="captcha"
                          value={formData.captcha}
                          onChange={handleInputChange}
                          placeholder="Enter captcha"
                          className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                          required
                        />
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 px-6 py-4 rounded-xl font-mono font-bold text-gray-700 text-xl tracking-widest">
                            {captchaCode}
                          </div>
                          <button type="button" className="p-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
                            <RefreshCw className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-6">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                          required
                        />
                        <span className="text-gray-700">
                          I agree to the <button type="button" className="text-primary-600 underline font-semibold">Terms and Conditions</button> of the eTender Portal *
                        </span>
                      </label>

                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreePrivacy"
                          checked={formData.agreePrivacy}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                          required
                        />
                        <span className="text-gray-700">
                          I agree to the <button type="button" className="text-primary-600 underline font-semibold">Privacy Policy</button> and consent to data processing *
                        </span>
                      </label>
                    </div>

                    {/* Important Information */}
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-sm font-bold">!</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">Important Information</h4>
                          <ul className="text-gray-700 space-y-2">
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
                        className="flex items-center gap-2 px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                      >
                        ✅ Complete Registration
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 ml-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-primary-50 border-2 border-primary-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-primary-600 mt-1" />
              <div>
                <h4 className="font-semibold text-primary-900 mb-2 text-lg">🔒 Secure Registration</h4>
                <p className="text-primary-700">
                  Your information is encrypted and securely stored. We use government-verified APIs for PAN and GST validation to ensure authenticity.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-gray-600">
            <div className="flex justify-center gap-8 mb-4">
              <button className="hover:text-primary-600 font-medium">Terms of Service</button>
              <button className="hover:text-primary-600 font-medium">Privacy Policy</button>
              <button className="hover:text-primary-600 font-medium">Help & Support</button>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4 text-primary-600" />
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