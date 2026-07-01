import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 mb-8 text-center uppercase">Our Story</h1>
        
        <div className="mb-12 rounded-2xl overflow-hidden aspect-video bg-neutral-100 flex items-center justify-center">
          <div className="text-neutral-400 font-medium tracking-widest uppercase">Sneaker Culture Since '26</div>
        </div>

        <div className="text-neutral-600 mx-auto space-y-6">
          <p className="text-lg sm:text-xl leading-relaxed">
            Welcome to <strong className="text-neutral-900">SprintShoes</strong>, where speed meets style. Founded in 2026, we've dedicated ourselves to providing athletes, sneakerheads, and everyday enthusiasts with the highest quality footwear available on the market.
          </p>
          
          <p className="text-lg sm:text-xl leading-relaxed">
            We believe that what you wear on your feet determines the journey you take. That's why every shoe in our inventory is carefully curated, rigorously tested, and fully vetted for maximum performance and supreme comfort. We don't just sell shoes; we equip you for your daily marathon.
          </p>
          
          <p className="text-lg sm:text-xl leading-relaxed">
            Craftsmanship, durability, and bold aesthetics form the core pillars of SprintShoes. Whether you're running a competitive race or navigating the urban jungle, we have the perfect pair for you. Join our community and elevate your stride today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
