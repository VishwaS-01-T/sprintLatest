import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from "lucide-react";

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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

  const nextReview = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevReview = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-12 uppercase tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What're they saying?
        </motion.h2>

        {/* Reviews Carousel */}
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  nextReview();
                } else if (swipe > swipeConfidenceThreshold) {
                  prevReview();
                }
              }}
              className="w-full border-2 border-blue-600 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img
                    src={reviews[currentIndex].image}
                    alt={`Review by ${reviews[currentIndex].name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 md:p-12 bg-white">
                  {/* Stars */}
                  <motion.div 
                    className="flex gap-1 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05, duration: 0.2 }}
                      >
                        <Star className="w-5 h-5 fill-neutral-900 text-neutral-900" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Title */}
                  <motion.h3 
                    className="text-xl sm:text-2xl font-bold text-neutral-900 uppercase mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    "{reviews[currentIndex].title}"
                  </motion.h3>

                  {/* Review Text */}
                  <motion.p 
                    className="text-neutral-600 leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    {reviews[currentIndex].review}
                  </motion.p>

                  {/* Author */}
                  <motion.div 
                    className="flex items-center gap-2 mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <span className="font-semibold text-neutral-900 uppercase tracking-wide">
                      {reviews[currentIndex].name}
                    </span>
                    {reviews[currentIndex].verified && (
                      <BadgeCheck className="w-5 h-5 text-blue-600" />
                    )}
                  </motion.div>

                  {/* Navigation */}
                  <motion.div 
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <motion.button
                      onClick={prevReview}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                      aria-label="Previous review"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-5 h-5 text-neutral-600" />
                    </motion.button>
                    <motion.button
                      onClick={nextReview}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                      aria-label="Next review"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight className="w-5 h-5 text-neutral-600" />
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <motion.div 
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {reviews.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-blue-600' : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;
