import React from 'react'
import { motion } from 'framer-motion';
import VideoCarousel from './VideoCarousel';
import { Play, ArrowRight, ChevronRight } from 'lucide-react';

const Highlights = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section
      id="highlights"
      className="
        w-full overflow-hidden
        py-20 px-4
        sm:py-24 sm:px-6
        lg:py-12 lg:px-8
        bg-white
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div>
            <motion.span 
              className="inline-block text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3"
              variants={itemVariants}
            >
              New Collection
            </motion.span>
            <motion.h2
              className="
                text-neutral-900
                text-3xl sm:text-4xl lg:text-5xl
                font-bold
              "
              variants={itemVariants}
            >
              Step Into Style.
            </motion.h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              variants={itemVariants}
              className="
              link
              group
              inline-flex items-center gap-2
              px-5 py-2.5
              bg-neutral-900 hover:bg-neutral-800
              text-white
              text-sm font-medium
              rounded-full
              transition-all duration-200
              hover:shadow-lg
            ">
              <Play className="w-4 h-4" fill="currentColor" />
              Watch Collection
            </motion.button>

            <motion.button
              variants={itemVariants}
              className="
              link
              group
              inline-flex items-center gap-2
              px-5 py-2.5
              bg-white hover:bg-neutral-50
              text-neutral-900
              text-sm font-medium
              rounded-full
              border-2 border-neutral-200 hover:border-amber-500
              transition-all duration-200
            ">
              Shop Now
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        <VideoCarousel />
      </div>
    </section>
  );
};

export default Highlights;
