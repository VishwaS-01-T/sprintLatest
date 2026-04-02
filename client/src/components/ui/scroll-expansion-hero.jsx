import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Throttle function for performance
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const wrapperRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  // Memoize scroll calculations for better performance
  const mediaStyles = useMemo(() => ({
    width: 320 + scrollProgress * (isMobile ? 660 : 980),
    height: 380 + scrollProgress * (isMobile ? 220 : 260),
  }), [scrollProgress, isMobile]);

  const textTranslateX = useMemo(() => 
    scrollProgress * (isMobile ? 80 : 50), 
    [scrollProgress, isMobile]
  );

  const handleScroll = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const wrapperHeight = wrapperRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    // scrolled = how far into the wrapper we are (0 at top, positive as we scroll down)
    const scrolled = -rect.top;
    const scrollable = wrapperHeight - viewportHeight;
    if (scrollable <= 0) return;
    const progress = clamp(scrolled / scrollable, 0, 1);
    setScrollProgress(progress);
    setShowContent(progress >= 0.75);
  }, []);

  // Throttled scroll handler for performance
  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 16), // ~60fps
    [handleScroll]
  );

  useEffect(() => {
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [throttledHandleScroll, handleScroll]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    // Tall wrapper gives the scroll distance; sticky child stays in view
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden rounded-3xl">
        {/* Background */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 - scrollProgress * 0.7 }}
          transition={{ duration: 0.15 }}
        >
          <img
            src={bgImageSrc}
            alt="Background"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-neutral-950/45" />
        </motion.div>

        {/* Content */}
        <div className="w-full h-full flex flex-col items-center justify-start relative z-10">
          {/* Animation area */}
          <div className="flex flex-col items-center justify-center w-full h-full relative px-4 sm:px-6">
            {/* Expanding media card */}
            <div
              className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
              style={{
                width: `${mediaStyles.width}px`,
                height: `${mediaStyles.height}px`,
                maxWidth: "95vw",
                maxHeight: "85vh",
                boxShadow: "0px 20px 50px rgba(0, 0, 0, 0.35)",
              }}
            >
              {mediaType === "video" ? (
                <div className="relative w-full h-full pointer-events-none">
                  <video
                    src={mediaSrc}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/35"
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: 0.55 - scrollProgress * 0.25 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={mediaSrc}
                    alt={title || "Media content"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/45"
                    initial={{ opacity: 0.65 }}
                    animate={{ opacity: 0.65 - scrollProgress * 0.25 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}
            </div>

            {/* Text overlay */}
            <div
              className={`flex items-center justify-center text-center gap-3 w-full relative z-10 flex-col ${
                textBlend ? "mix-blend-difference" : "mix-blend-normal"
              }`}
            >
              {date ? (
                <p
                  className="text-sm sm:text-base tracking-wider uppercase text-amber-300"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {date}
                </p>
              ) : null}

              <motion.h2
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white"
                style={{ transform: `translateX(-${textTranslateX}vw)` }}
              >
                {firstWord}
              </motion.h2>
              <motion.h2
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-center text-white"
                style={{ transform: `translateX(${textTranslateX}vw)` }}
              >
                {restOfTitle}
              </motion.h2>

              {scrollToExpand ? (
                <p
                  className="mt-3 text-xs sm:text-sm text-neutral-200 font-medium"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {scrollToExpand}
                </p>
              ) : null}
            </div>
          </div>

          {/* Children revealed at end of expansion */}
          {children ? (
            <motion.section
              className="absolute bottom-0 left-0 right-0 flex flex-col w-full px-6 py-10 sm:px-10 lg:px-16 bg-white/95 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.45 }}
            >
              {children}
            </motion.section>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;
