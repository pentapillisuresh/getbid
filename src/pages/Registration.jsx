import { useState } from 'react';
import { Building2, User, Shield, ChevronRight, ArrowLeft, RefreshCw, CheckCircle, Send, Phone, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Registration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState('vendor');
  const [entityType, setEntityType] = useState('individual');
  const [showPanOtp, setShowPanOtp] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [showGstOtp, setShowGstOtp] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [captchaCode] = useState('8K2M');

  const [formData, setFormData] = useState({
    panNumber: '',
    panOtp: '',
    gstNumber: '',
    gstOtp: '',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    fatherName: 'Ramesh Kumar',
    dateOfBirth: '1985-06-15',
    address: '123, MG Road, Commercial Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    email: '',
    mobile: '',
    alternatePhone: '',
    website: '',
    emailOtp: '',
    mobileOtp: '',
    businessCategory: '',
    annualTurnover: '',
    experience: '',
    captcha: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'panOtp' || name === 'emailOtp' || name === 'mobileOtp' || name === 'gstOtp') {
      if (value.length <= 6 && /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
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

  const sendGstOtp = () => {
    if (formData.gstNumber.length === 15) {
      setShowGstOtp(true);
      alert('OTP sent to your registered mobile number');
    } else {
      alert('Please enter a valid GST number');
    }
  };

  const verifyGstOtp = () => {
    if (formData.gstOtp === '123456') {
      setGstVerified(true);
      setShowGstOtp(false);
      alert('GST verified successfully!');
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
    if (currentStep === 1) {
      if (entityType === 'individual' && !panVerified) {
        alert('Please verify your PAN number first');
        return;
      }
      if (entityType === 'company' && !gstVerified) {
        alert('Please verify your GST number first');
        return;
      }
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
         setTimeout(() => {
        navigate('/choose-login-type');
      }, 800);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Registration Portal</h1>

            <div className="flex items-center justify-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                      step === currentStep
                        ? 'bg-white text-blue-600 shadow-lg'
                        : step < currentStep
                          ? 'bg-blue-200 text-blue-700'
                          : 'bg-blue-400 text-blue-100'
                    }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 rounded ${
                        step < currentStep ? 'bg-blue-200' : 'bg-blue-400'
                      }`} />
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Registration Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRegistrationType('vendor')}
                      className={`p-6 rounded-xl border-2 transition-all ${
                          registrationType === 'vendor'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="font-semibold mb-1">Vendor</div>
                      <div className="text-xs text-gray-600">Register as vendor</div>
                    </button>

                    <button
                      onClick={() => setRegistrationType('client')}
                      className={`p-6 rounded-xl border-2 transition-all ${
                          registrationType === 'client'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="font-semibold mb-1">Client</div>
                      <div className="text-xs text-gray-600">Register as buyer</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Entity Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setEntityType('individual');
                        setPanVerified(false);
                        setShowPanOtp(false);
                        setGstVerified(false);
                        setShowGstOtp(false);
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                          entityType === 'individual'
                            ? 'border-gray-500 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <User className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                      <div className="font-semibold mb-1">Individual</div>
                      <div className="text-xs text-gray-600">Register with PAN</div>
                    </button>

                    <button
                      onClick={() => {
                        setEntityType('company');
                        setPanVerified(false);
                        setShowPanOtp(false);
                        setGstVerified(false);
                        setShowGstOtp(false);
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                          entityType === 'company'
                            ? 'border-gray-500 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                      <div className="font-semibold mb-1">Company</div>
                      <div className="text-xs text-gray-600">Register with GST</div>
                    </button>
                  </div>
                </div>

                {entityType === 'individual' ? (
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

                    {!panVerified && !showPanOtp && (
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
                    )}

                    {panVerified && (
                      <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-700">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">PAN verified successfully!</span>
                        </div>
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

                    {!gstVerified && !showGstOtp && (
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
                    )}

                    {gstVerified && (
                      <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-700">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">GST verified successfully!</span>
                        </div>
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
                    <span className="font-semibold">{entityType === 'individual' ? 'PAN' : 'GST'} verified! Details auto-filled.</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Auto-filled Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Father's Name</label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        readOnly
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border-2 ${
                        emailVerified ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address *</label>
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
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium whitespace-nowrap"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {emailVerified && (
                          <div className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>

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
                              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-600 text-sm"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              className="px-4 py-2 text-blue-600 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-sm"
                            >
                              Resend
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`p-4 rounded-xl border-2 ${
                        mobileVerified ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Mobile Number *</label>
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        {mobileVerified && (
                          <div className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>

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
                              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 text-sm"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={sendMobileOtp}
                              className="px-4 py-2 text-blue-600 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-sm"
                            >
                              Resend
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Alternate Phone</label>
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
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Website</label>
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
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Business Category *</label>
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
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Annual Turnover</label>
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
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Experience</label>
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Almost Done!</h3>
                  <p className="text-gray-600">Complete verification and accept terms</p>
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
                      />
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 px-4 py-3 rounded-lg font-mono font-bold text-gray-700 text-lg tracking-wider">
                          {captchaCode}
                        </div>
                        <button type="button" className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
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
                        I agree to the <button type="button" className="text-blue-600 underline font-semibold">Terms and Conditions</button> *
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
                        I agree to the <button type="button" className="text-blue-600 underline font-semibold">Privacy Policy</button> *
                      </span>
                    </label>
                  </div>

                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Important</h4>
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
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg ${currentStep === 1 ? 'ml-auto' : ''}`}
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
              <h4 className="font-semibold text-blue-900 mb-1">Secure Registration</h4>
              <p className="text-sm text-blue-700">
                Your information is encrypted and securely stored. We use government-verified APIs.
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
          <div className="text-xs">© 2025 eTender Portal. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
