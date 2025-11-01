import React, { useEffect } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import PricingPlans from "./PricingPlans";
// import WhyChooseUs from "./WhyChooseUs";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import FeaturesSection from "./FeaturesSection";
import ServicesSection from "./ServicesSection";
import TendersSection from "./TendersSection";
import GetInTouch from "./GetInTouch";
import { useLocation } from "react-router-dom";

function HomeMain() {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to a specific section
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100); // Small delay to ensure the page is rendered
    }
  }, [location.state]);

  return (
    <div className="App">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      {/* <TendersSection /> */}
      <PricingPlans />
      {/* <WhyChooseUs /> */}
      <AboutSection />
      <GetInTouch />
      <Footer />
    </div>
  );
}

export default HomeMain;