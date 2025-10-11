import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define service links
  const services = [
    { name: "Tender Search & Discovery", path: "/services/tendersearch" },
    { name: "Bid Management System", path: "/services/bid-management" },
    { name: "Document Management", path: "/services/document-management" },
    { name: "Compliance Support", path: "/services/compliancesupport" },
    { name: "Analytics & Reporting", path: "/services/analytics-reporting" },
    { name: "Training & Support", path: "/services/training-support" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle hover with slight delay
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 200);
  };

  // Helper: Active link styling
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/images/logo2.png" alt="Logo" className="w-[110px]" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className={`font-medium transition ${
              isActive("/") ? "text-[#6B21A8]" : "text-gray-800 hover:text-[#6B21A8]"
            }`}
          >
            Home
          </button>

          {/* About */}
     <button
            onClick={() => scrollToSection("about")}
            className={`font-medium transition ${
              location.search.includes("scroll=about")
                ? "text-[#6B21A8]"
                : "text-gray-800 hover:text-[#6B21A8]"
            }`}
          >
            About Us
          </button>

          {/* Services Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setServicesOpen((prev) => !prev)}
              className={`flex items-center font-medium transition ${
                location.pathname.startsWith("/services")
                  ? "text-[#6B21A8]"
                  : "text-gray-800 hover:text-[#6B21A8]"
              }`}
            >
              Services <ChevronDown className="ml-1 w-4 h-4" />
            </button>

            {servicesOpen && (
              <div className="absolute left-0 mt-3 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-3 animate-fadeIn">
                {services.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => {
                      navigate(service.path);
                      setServicesOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md transition ${
                      isActive(service.path)
                        ? "bg-[#F3E8FF] text-[#6B21A8] font-semibold"
                        : "text-gray-700 hover:bg-[#F3E8FF] hover:text-[#6B21A8]"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <button
            onClick={() => navigate("/pricing")}
            className={`font-medium transition ${
              isActive("/pricing")
                ? "text-[#6B21A8]"
                : "text-gray-800 hover:text-[#6B21A8]"
            }`}
          >
            Pricing
          </button>

          {/* Contact */}
          <button
            onClick={() => navigate("/contact")}
            className={`font-medium transition ${
              isActive("/contact")
                ? "text-[#6B21A8]"
                : "text-gray-800 hover:text-[#6B21A8]"
            }`}
          >
            Contact Us
          </button>
        </nav>

        {/* Right Side: Login + Call */}
        <div className="hidden md:flex items-center space-x-5">
          <button
            onClick={() => navigate("/choose-login-type")}
            className="text-[#6B21A8] font-semibold hover:text-[#5B1893] transition"
          >
            Login
          </button>

          <a
            href="tel:+919494777198"
            className="bg-[#16A34A] text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Call us: +91 9494777198
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="flex flex-col space-y-3 p-4">
            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="text-gray-800 text-left"
            >
              Home
            </button>

            <button
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}
              className="text-gray-800 text-left"
            >
              About Us
            </button>

            {/* Mobile Dropdown */}
            <div>
              <button
                className="flex items-center w-full text-gray-800"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services <ChevronDown className="ml-1 w-4 h-4" />
              </button>

              {servicesOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {services.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => {
                        navigate(service.path);
                        setMenuOpen(false);
                        setServicesOpen(false);
                      }}
                      className="block w-full text-left text-gray-600 hover:text-[#6B21A8]"
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigate("/pricing");
                setMenuOpen(false);
              }}
              className="text-gray-800 text-left"
            >
              Pricing
            </button>

            <button
              onClick={() => {
                navigate("/contact");
                setMenuOpen(false);
              }}
              className="text-gray-800 text-left"
            >
              Contact Us
            </button>

            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="text-[#6B21A8] font-semibold border-t pt-2 text-left"
            >
              Login
            </button>

            <a
              href="tel:+919494777198"
              className="bg-[#16A34A] text-white px-5 py-2 rounded-lg font-medium text-center hover:bg-green-700 transition"
            >
              Call us: +91 9494777198
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
