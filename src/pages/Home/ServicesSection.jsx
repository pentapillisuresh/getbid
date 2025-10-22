import React from "react";

function ServicesSection() {
  const services = [
    {
      title: "Tender Search & Discovery",
      description:
        "We take a comprehensive approach to tender discovery starting from search algorithms and filters to tender categorization and alerts for private sector opportunities.",
      videoUrl: "/images/why1.mp4",
    },
    {
      title: "Bid Management",
      description:
        "From concept to bid submission, GetBid covers the entire business tender management process for private companies and contractors...",
      videoUrl: "/images/why2.mp4",
    },
    {
      title: "Document Management",
      description:
        "GetBid focuses on your document security by increasing the quality and quantity of our Document Services for private sector clients.",
      videoUrl: "/images/why3.mp4",
    },
    {
      title: "Compliance Support",
      description:
        "Navigate complex tender requirements with confidence. Our compliance tools help you understand regulations, maintain certifications, and ensure submissions meet all criteria.",
      videoUrl: "/images/why4.mp4",
    },
    {
      title: "Training & Support",
      description:
        "Empower your team with comprehensive training programs and ongoing support. Learn best practices for tender preparation, bidding strategies, and platform use.",
      videoUrl: "/images/why5.mp4",
    },
    {
      title: "Analytics & Reporting",
      description:
        "Make data-driven decisions with powerful analytics and reporting tools. Track your bidding performance, success rates, and ROI while analyzing market trends.",
      videoUrl: "/images/why6.mp4",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-600 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-white/90 text-sm uppercase tracking-wide mb-2">
            Why Choose Us
          </p>
          <h2 className="text-4xl font-bold text-white mb-3">Our Services</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-base">
            GetBid provides comprehensive tender, bid, and document management
            solutions for modern businesses and contractors.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col text-center"
            >
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {service.title}
              </h3>

              {/* Video */}
              <div className="w-full h-48 overflow-hidden rounded-lg mb-5">
                <video
                  src={service.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>

              {/* Button */}
              <div className="mt-auto flex justify-center">
                <button className="bg-purple-700 text-white w-36 py-2 rounded-md font-semibold hover:bg-purple-800 transition-colors">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesSection;
