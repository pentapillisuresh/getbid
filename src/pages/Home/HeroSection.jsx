import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Transform Your Business with Advanced Tender Platform",
    subtitle: "Smart Tendering Solutions",
    description:
      "Discover private sector opportunities faster with our AI-powered tender search, automated bid management, and comprehensive compliance support designed for modern businesses, companies, and individual contractors.",
    button1: "Login Now",
    button1Link: "/choose-login-type",
    button2: "Register Now",
    button2Link: "/register",
    image: "/images/bannerbid1.jpg",
  },
  {
    title: "Streamline Your Bidding Process with Smart Technology",
    subtitle: "Intelligent Bid Management",
    description:
      "Maximize your success rate with our intelligent bid tracking system, real-time notifications, and expert guidance that helps you win more private sector contracts and tenders.",
    button1: "Explore Features",
    button2: "Get Started",
    image: "/images/bgbid2.jpg",
  },
  {
    title: "Ensure Perfect Compliance with Expert Assistance",
    subtitle: "Complete Compliance Support",
    description:
      "Navigate complex tender requirements effortlessly with our compliance verification tools, document management system, and dedicated support team for private companies and contractors.",
    button1: "Try for Free",
    button2: "Contact Sales",
    image: "/images/bgbid3.jpg",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-purple-100 to-green-50 overflow-hidden">
      {/* Navigation Arrows - Outside the main content */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center relative">
          {/* LEFT CONTENT */}
          <div className="relative min-h-[400px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-in-out ${
                  index === current
                    ? "opacity-100 translate-x-0 relative"
                    : "opacity-0 translate-x-10 absolute top-0 left-0 pointer-events-none"
                }`}
              >
                <p className="text-purple-600 font-semibold mb-4 text-lg">
                  {slide.subtitle}
                </p>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {slide.title}
                </h1>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => (window.location.href = slide.button1Link)}
                  >
                    {slide.button1}
                  </button>
                  <button
                    className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => (window.location.href = slide.button2Link)}
                  >
                    {slide.button2}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT IMAGE/ILLUSTRATION */}
          <div className="relative flex justify-center items-center min-h-[500px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex justify-center items-center transition-all duration-700 ease-in-out ${
                  index === current
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="w-full h-[500px]   flex items-center justify-center">
                  <img
                    src={slide.image}
                    alt={`slide-${index}`}
                    className="w-[90%] h-[90%] object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-3 mb-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "bg-purple-600 w-8 h-3"
                  : "bg-gray-400 w-3 h-3 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
