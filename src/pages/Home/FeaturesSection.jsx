import React from "react";

function FeaturesSection() {
  const features = [
    {
      img: "/images/w1.png", // replace with your image path
      title: "24/7 Customer Care",
      description:
        "GetBid is an organization dedicated to help private companies and contractors find inspirational opportunities to get better business.",
    },
    {
      img: "/images/w2.png", // replace with your image path
      title: "Flexible Fee",
      description:
        "Optimizing tendering processes to increase your business competitiveness in private sector opportunities.",
    },
    {
      img: "/images/w3.png", // replace with your image path
      title: "Top Industry Specialists",
      description:
        "We can help you develop and execute a clear and strategic roadmap with priorities that align with private sector requirements.",
    },
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl shadow-md p-10 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-18 h-18 object-contain"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
