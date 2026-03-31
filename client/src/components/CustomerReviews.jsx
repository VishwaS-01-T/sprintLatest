import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from "lucide-react";
import gsap from "gsap";

/**
 * CustomerReviews Component
 * Carousel displaying customer testimonials with images
 */
const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);

  const reviews = [
    {
      id: 1,
      name: "Vineet P",
      verified: true,
      rating: 5,
      title: "Comfort that stands out",
      review:
        "Not gonna lie, these shoes stole the spotlight more than the view. Crazy comfy, easy to style, and they've been my go-to ever since I got them.",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
    },
    {
      id: 2,
      name: "Rahul K",
      verified: true,
      rating: 5,
      title: "Best purchase this year",
      review:
        "The quality is unmatched. I've worn these on hikes, city walks, and even casual outings. They hold up great and look amazing.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    },
    {
      id: 3,
      name: "Priya M",
      verified: true,
      rating: 5,
      title: "Stylish and durable",
      review:
        "I was skeptical at first but these exceeded all my expectations. The cushioning is perfect and they pair well with everything.",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    },
  ];

  const nextReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    gsap.to(cardRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.3,
      ease: "power1.inOut",
      onComplete: () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
        gsap.fromTo(cardRef.current,
          { x: -50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.3, 
            ease: "power1.inOut",
            onComplete: () => setIsAnimating(false)
          }
        );
      }
    });
  };

  const prevReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    gsap.to(cardRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.3,
      ease: "power1.inOut",
      onComplete: () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
        gsap.fromTo(cardRef.current,
          { x: 50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.3, 
            ease: "power1.inOut",
            onComplete: () => setIsAnimating(false)
          }
        );
      }
    });
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-14 uppercase tracking-[-0.02em]">
          What're they saying?
        </h2>

        {/* Reviews Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex items-stretch">
            {/* Main Review Card */}
            <div 
              ref={cardRef}
                className="w-full border-2 border-blue-600 rounded-lg sm:rounded-[20px] overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[350px] sm:min-h-[400px]">
                {/* Image */}
                <div className="relative h-48 sm:h-64 md:h-auto">
                  <img
                    src={currentReview.image}
                    alt={`Review by ${currentReview.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-5 sm:p-9 md:p-14 bg-white">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4 sm:mb-6">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 fill-neutral-900 text-neutral-900"
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-xl md:text-2xl font-extrabold text-neutral-900 uppercase tracking-[-0.02em] mb-3 sm:mb-4">
                    "{currentReview.title}"
                  </h3>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                    {currentReview.review}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-6 sm:mb-8">
                    <span className="font-semibold text-neutral-900 uppercase tracking-wide text-sm sm:text-base">
                      {currentReview.name}
                    </span>
                    {currentReview.verified && (
                      <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={prevReview}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-all duration-[250ms] ease cursor-pointer"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
                    </button>
                    <button
                      onClick={nextReview}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-all duration-[250ms] ease cursor-pointer"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
