import React from "react";
import { CheckCircle } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-purple-600 to-green-600 text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Why Choose Our Tender-Wise Plans?
        </h2>
        <p className="text-white/90 mb-8">
          Pay only for what you use — no hidden charges. Flexible, reliable, and
          transparent tendering system for all vendors.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "Demand validity periods",
            "Sign-up or cancel anytime",
            "Pay only for active tenders",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full"
            >
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
