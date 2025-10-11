import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import PricingPlans from './PricingPlans';
import WhyChooseUs from './WhyChooseUs';
import AboutSection from './AboutSection';
import Footer from './Footer';
import FeaturesSection from './FeaturesSection';
import ServicesSection from './ServicesSection';
import GetInTouch from './GetInTouch';
// import './index.css';

function HomeMain() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
     
      <PricingPlans />
      <WhyChooseUs />
      <AboutSection />
      <GetInTouch />
      <Footer />
    </div>
  );
}

export default HomeMain;