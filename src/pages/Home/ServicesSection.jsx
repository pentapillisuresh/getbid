function ServicesSection() {
  const services = [
    {
      title: "Tender Search & Discovery",
      description: "Stay ahead of the competition with our comprehensive tender search tool. Access thousands of tenders from various industries and government bodies. Get real-time alerts, detailed tender information, and intelligent matching based on your business profile.",
      bgColor: "from-yellow-50 to-orange-50",
      imgBg: "bg-yellow-100"
    },
    {
      title: "Bid Management",
      description: "Streamline your entire bidding process with our advanced management tools. Track deadlines, collaborate with team members, manage documents, and submit bids efficiently. Our platform ensures you never miss an opportunity and stay organized throughout the bidding cycle.",
      bgColor: "from-blue-50 to-cyan-50",
      imgBg: "bg-blue-100"
    },
    {
      title: "Document Management",
      description: "Organize and secure all your bidding documents in one centralized location. Easy upload, version control, and quick access to certificates, company profiles, and past submissions. Ensure compliance and maintain a complete audit trail of all documentation.",
      bgColor: "from-pink-50 to-purple-50",
      imgBg: "bg-pink-100"
    },
    {
      title: "Compliance Support",
      description: "Navigate complex tender requirements with confidence. Our compliance tools help you understand regulations, maintain necessary certifications, and ensure all submissions meet specified criteria. Get expert guidance on documentation and regulatory requirements.",
      bgColor: "from-blue-50 to-purple-50",
      imgBg: "bg-blue-100"
    },
    {
      title: "Training & Support",
      description: "Empower your team with comprehensive training programs and ongoing support. Learn best practices for tender preparation, bidding strategies, and platform utilization. Access expert consultants and resources to maximize your success rate.",
      bgColor: "from-green-50 to-teal-50",
      imgBg: "bg-green-100"
    },
    {
      title: "Analytics & Reporting",
      description: "Make data-driven decisions with powerful analytics and reporting tools. Track your bidding performance, success rates, and ROI. Gain insights into market trends, competition analysis, and identify opportunities for improvement and growth.",
      bgColor: "from-indigo-50 to-blue-50",
      imgBg: "bg-indigo-900"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-green-700 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-200 mb-2">Why Choose US</p>
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            The GenMall platform is the lowest priced enterprise, contractors, and businesses to build a strong tendering strategy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className={`bg-gradient-to-br ${service.bgColor} rounded-2xl p-6 shadow-lg`}>
              <div className={`${service.imgBg} rounded-xl h-40 mb-6`}></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition w-full">
                Read more
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesSection;
