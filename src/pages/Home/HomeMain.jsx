import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import VendorSubscriptionPlans from './VendorSubscriptionPlans';
import PlanComparison from './PlanComparison';
import ReadyToBid from './ReadyToBid';
import WhyChooseUs from './WhyChooseUs';
import Statistics from './Statistics';
import SubscriptionForm from './SubscriptionForm';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
// import './index.css';

function HomeMain() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <VendorSubscriptionPlans />
      <PlanComparison />
      <ReadyToBid />
      <WhyChooseUs />
      <Statistics />
      <SubscriptionForm />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default HomeMain;