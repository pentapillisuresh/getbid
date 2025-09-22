import React from 'react';
import { Shield, MapPin, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-[#FD9A00]" />, // smaller icon
      title: "Secure, Transparent Bidding",
      description:
        "Our platform ensures complete transparency in the bidding process with advanced security measures.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#FD9A00]" />, // smaller icon
      title: "PAN India Tender Coverage",
      description:
        "Access tenders from across India with comprehensive government and private sector opportunities.",
    },
    {
      icon: <Users className="w-8 h-8 text-[#FD9A00]" />, // smaller icon
      title: "Trusted by 1,000+ Vendors",
      description:
        "Join thousands of successful vendors who trust our platform for their tendering needs.",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-[#FD9A00] via-[#ffb733] to-[#ffcc80] overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-6 animate-fade-in-up">
        Why Choose Us?
        </h2>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-16 animate-fade-in-up">
          Join thousands of successful vendors who trust our platform for secure and transparent bidding
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-[#FFF3E0] rounded-full shadow-inner">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
