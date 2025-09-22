import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Eye, EyeOff, RefreshCw } from 'lucide-react';
import Header from '../components/shared/Header';

const ChooseLoginType = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('vendor');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: '',
    rememberMe: false
  });
  const [captchaCode] = useState('7K9M');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.captcha === captchaCode) {
      navigate('/otp-verification', { state: { loginType, email: formData.email } });
    } else {
      alert('Invalid captcha code');
    }
  };

  const handleRegister = () => {
    navigate('/register', { state: { registrationType: loginType } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Choose Login Type</h2>
            
            {/* Login Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setLoginType('vendor')}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  loginType === 'vendor'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="font-semibold">🏢 Vendor</div>
                <div className="text-sm text-gray-500">Submit bids & manage tenders</div>
              </button>
              
              <button
                onClick={() => setLoginType('client')}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  loginType === 'client'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="font-semibold">🏛️ Client</div>
                <div className="text-sm text-gray-500">Post tenders & evaluate bids</div>
              </button>
            </div>

            {/* Access Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 {loginType === 'vendor' ? 'Vendor' : 'Client'} Access Level
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>{loginType === 'vendor' ? 'Vendor / Supplier' : 'Client / Organization'}</option>
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address / Username
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Security Verification */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Verification
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                🏢 Sign in as {loginType === 'vendor' ? 'Vendor' : 'Client'}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              New {loginType}?{' '}
              <button 
                onClick={handleRegister}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register your company
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Security Notice</h4>
                <p className="text-sm text-blue-700">
                  Your session will automatically timeout after 30 minutes of inactivity. Always logout when using shared computers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseLoginType;