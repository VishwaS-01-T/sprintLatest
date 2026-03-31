import React from "react";
import { Link } from "../hooks/useRouter.jsx";
import { motion } from "framer-motion";
import { cn } from "../lib/utils.js";

// Animated elegant shape component for background
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

const Hero = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section className="relative w-full h-[500px] bg-[#030303] overflow-hidden">
      {/* Subtle gradient overlay */}      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] blur-3xl" />

      {/* Animated Geometric Shapes Background */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.12]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.12]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.12]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.12]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.12]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Smoke/Cloud effect at bottom */}
      <div
        className="absolute inset-0 bg-cover bg-bottom opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1762745549473-a47f75a4946c?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          // maskImage: 'linear-gradient(to top, black 0%, transparent 60%)',
          // WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 60%)', (#SANKET; keep this for reference(dont remove any comments))
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          {/* Left Content */}
          <div className="space-y-6">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-sm font-light text-neutral-400 tracking-widest mb-3 italic">
                Embracing Excellence
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight uppercase">
                MODEL-X SHOENAME?
              </h1>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/products?gender=men"
                className="inline-flex items-center justify-center px-10 py-4 bg-[#F2D200] text-black font-bold text-sm uppercase tracking-wide hover:bg-[#E5C700] transition-all duration-300"
              >
                Shop Men
              </Link>
              <Link
                href="/products?gender=women"
                className="inline-flex items-center justify-center px-10 py-4 bg-[#F2D200] text-black font-bold text-sm uppercase tracking-wide hover:bg-[#E5C700] transition-all duration-300"
              >
                Shop Women
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Shoe Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative">
              {/* Shoe Image */}
              <img
                src="/assets/shoes/shoe-10.png"
                alt="X Lows Armstrong Shoe"
                className="relative z-10 w-full max-w-xl h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top and bottom gradient fades */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </section>
  );
};

export default Hero;
