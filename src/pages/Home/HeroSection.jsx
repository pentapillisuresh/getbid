import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const fullText = "Welcome to Getbid";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 120); // typing speed
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/images/banner2.jpg')`, // 🔹 Place your image inside /public/images/
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/70 to-black/80"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span>
                {displayedText.split(" ").map((word, index) =>
                  word.toLowerCase() === "getbid" ? (
                    <span
                      key={index}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD9A00] via-yellow-400 to-white drop-shadow-lg animate-pulse"
                    >
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                )}
              </span>
              <span className="inline-block w-1 h-8 bg-white animate-blink align-middle"></span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-500">
              Your one-stop platform to explore, bid, and win tenders.
            </p>
          </div>

          {/* Professional Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fade-in-up delay-700">
            <button
              onClick={() => navigate("/choose-login-type")}
              className="px-8 py-4 rounded-full bg-white text-blue-700 font-semibold shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300"
            >
              Vendor Login
            </button>
            <button
              onClick={() => navigate("/choose-login-type")}
              className="px-8 py-4 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Client Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FD9A00] to-orange-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-700 transition-all duration-300"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
