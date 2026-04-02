import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { hightlightsSlides } from '../constants';
import { pauseImg, playImg, replayImg } from '../utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  
  // Use Framer Motion's useInView for scroll trigger
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false
  });

  const [loadedData, setLoadedData] = useState([]);
  const [progressValues, setProgressValues] = useState(Array(hightlightsSlides.length).fill(0));

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  // Start playing when in view
  useEffect(() => {
    if (isInView && !startPlay) {
      setVideo(prev => ({ ...prev, startPlay: true, isPlaying: true }));
    }
  }, [isInView, startPlay]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = useCallback((i, e) => {
    setLoadedData(prev => [...prev, e]);
  }, []);

  // Simplified progress tracking with requestAnimationFrame
  useEffect(() => {
    let animationId;
    
    const updateProgress = () => {
      if (isPlaying && videoRef.current[videoId]) {
        const currentTime = videoRef.current[videoId].currentTime;
        const duration = hightlightsSlides[videoId].videoDuration;
        const progress = (currentTime / duration) * 100;
        
        setProgressValues(prev => {
          const newValues = [...prev];
          newValues[videoId] = Math.min(progress, 100);
          return newValues;
        });
      }
      
      if (isPlaying) {
        animationId = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      updateProgress();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [videoId, isPlaying]);

  // Auto-restart from beginning when last video ends
  useEffect(() => {
    if (isLastVideo) {
      setTimeout(() => {
        setVideo(prev => ({ 
          ...prev, 
          isLastVideo: false, 
          videoId: 0,
          isEnd: true
        }));
        setProgressValues(Array(hightlightsSlides.length).fill(0));
      }, 300);
    }
  }, [isLastVideo]);

  const handleProcess = useCallback((type, i) => {
    switch (type) {
      case 'video-end':
        setVideo(prev => ({ ...prev, isEnd: true, videoId: i + 1 }));
        break;
      case 'video-last':
        setVideo(prev => ({ ...prev, isLastVideo: true }));
        break;
      case 'video-reset':
        setVideo(prev => ({ ...prev, isLastVideo: false, videoId: 0 }));
        setProgressValues(Array(hightlightsSlides.length).fill(0));
        break;
      case 'play':
      case 'pause':
        setVideo(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      default:
        return;
    }
  }, []);

  const handleIndicatorClick = useCallback((index) => {
    if (index !== videoId) {
      // Pause current video and reset it
      videoRef.current[videoId].pause();
      videoRef.current[videoId].currentTime = 0;
      setVideo(prev => ({ ...prev, videoId: index, isEnd: true }));
      setProgressValues(prev => {
        const newValues = Array(hightlightsSlides.length).fill(0);
        // Fill completed videos
        for (let i = 0; i < index; i++) {
          newValues[i] = 100;
        }
        return newValues;
      });
    }
  }, [videoId]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Video Slider Container */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="flex" 
          ref={sliderRef}
          animate={{ x: `-${videoId * 100}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          {hightlightsSlides.map((list, i) => (
            <motion.div 
              key={list.id} 
              className="min-w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                {/* Video */}
                <video
                  playsInline
                  muted
                  preload="auto"
                  ref={el => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess('video-end', i)
                      : handleProcess('video-last')
                  }
                  className="absolute inset-0 w-full h-full object-cover"
                  onPlay={() =>
                    setVideo(prev => ({ ...prev, isPlaying: true }))
                  }
                  onLoadedMetadata={e => handleLoadedMetadata(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Text Overlay */}
                <motion.div 
                  className="absolute bottom-8 left-6 md:bottom-12 md:left-10 z-10 max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: i === videoId ? 1 : 0, y: i === videoId ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {list.textLists.map((text, idx) => (
                    <motion.p 
                      key={text} 
                      className={`
                        text-white font-semibold leading-tight
                        ${idx === 0 ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-lg md:text-2xl lg:text-3xl text-white/90'}
                      `}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      {text}
                    </motion.p>
                  ))}
                </motion.div>

                {/* Video Number Badge */}
                <motion.div 
                  className="absolute top-6 right-6 md:top-8 md:right-8 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                    {String(i + 1).padStart(2, '0')} / {String(hightlightsSlides.length).padStart(2, '0')}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div 
        className="flex items-center justify-center gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Progress Indicators */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 rounded-full">
          {hightlightsSlides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => handleIndicatorClick(i)}
              className="h-11 w-11 bg-neutral-300 rounded-full relative cursor-pointer transition-all duration-300 overflow-hidden flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                width: i === videoId ? 48 : 44,
                height: 44
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-2 w-8 bg-neutral-400 rounded-full relative overflow-hidden">
                <motion.span
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    backgroundColor: i < videoId ? '#525252' : i === videoId ? '#f59e0b' : '#525252'
                  }}
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: i < videoId ? '100%' : i === videoId ? `${progressValues[i]}%` : '0%'
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default VideoCarousel;