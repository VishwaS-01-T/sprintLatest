import React, { useEffect, useState, useRef } from 'react'
import { hightlightsSlides } from '../constants';
import { pauseImg, playImg, replayImg } from '../utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const sliderRef = useRef(null);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false
  });

  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-videoId * 100}%)`,
      duration: 1,
      ease: 'power3.inOut'
    });

    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#highlights',
        start: 'top 60%',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        setVideo(prev => ({ ...prev, startPlay: true, isPlaying: true }))
      }
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = (i, e) =>
    setLoadedData(prev => [...prev, e]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    let animUpdateRef = null;
    let anim = null;

    // Kill ALL tweens on every indicator to stop stale animations
    hightlightsSlides.forEach((_, i) => {
      gsap.killTweensOf(videoDivRef.current[i]);
      gsap.killTweensOf(span[i]);
    });

    // Reset all indicators based on state
    hightlightsSlides.forEach((_, i) => {
      if (i < videoId) {
        gsap.set(videoDivRef.current[i], { width: '8px' });
        gsap.set(span[i], { width: '100%', backgroundColor: '#525252' });
      } else if (i > videoId) {
        gsap.set(videoDivRef.current[i], { width: '8px' });
        gsap.set(span[i], { width: '0%', backgroundColor: '#525252' });
      } else {
        gsap.set(span[i], { width: '0%', backgroundColor: '#f59e0b' });
      }
    });

    if (span[videoId]) {
      anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '32px'
                  : window.innerWidth < 1200
                  ? '40px'
                  : '48px',
              duration: 0.3,
              ease: 'power2.out'
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: '#f59e0b'
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], { 
              width: '8px',
              duration: 0.3,
              ease: 'power2.out'
            });
            gsap.to(span[videoId], { backgroundColor: '#525252' });
          }
        }
      });

      anim.restart();

      animUpdateRef = () => {
        if (videoRef.current[videoId]) {
          anim.progress(
            videoRef.current[videoId].currentTime /
              hightlightsSlides[videoId].videoDuration
          );
        }
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdateRef);
      }
    }

    // Cleanup: remove ticker callback and kill tweens when videoId changes
    return () => {
      if (animUpdateRef) {
        gsap.ticker.remove(animUpdateRef);
      }
      if (anim) {
        anim.kill();
      }
    };
  }, [videoId, startPlay]);

  // Auto-restart from beginning when last video ends
  useEffect(() => {
    if (isLastVideo) {
      // Animate the transition and restart
      gsap.to('#slider', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setVideo(prev => ({ 
            ...prev, 
            isLastVideo: false, 
            videoId: 0,
            isEnd: true
          }));
          gsap.to('#slider', {
            opacity: 1,
            duration: 0.3
          });
        }
      });
    }
  }, [isLastVideo]);

  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo(prev => ({ ...prev, isEnd: true, videoId: i + 1 }));
        break;
      case 'video-last':
        setVideo(prev => ({ ...prev, isLastVideo: true }));
        break;
      case 'video-reset':
        setVideo(prev => ({ ...prev, isLastVideo: false, videoId: 0 }));
        break;
      case 'play':
      case 'pause':
        setVideo(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      default:
        return;
    }
  };

  const handleIndicatorClick = (index) => {
    if (index !== videoId) {
      // Pause current video and reset it
      videoRef.current[videoId].pause();
      videoRef.current[videoId].currentTime = 0;
      setVideo(prev => ({ ...prev, videoId: index, isEnd: true }));
    }
  };

  return (
    <div className="relative">
      {/* Video Slider Container */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900">
        <div className="flex" ref={sliderRef}>
          {hightlightsSlides.map((list, i) => (
            <div 
              key={list.id} 
              id="slider" 
              className="min-w-full"
            >
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                {/* Video */}
                <video
                  id="video"
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
                <div className="absolute bottom-8 left-6 md:bottom-12 md:left-10 z-10 max-w-md">
                  {list.textLists.map((text, idx) => (
                    <p 
                      key={text} 
                      className={`
                        text-white font-semibold leading-tight
                        ${idx === 0 ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-lg md:text-2xl lg:text-3xl text-white/90'}
                      `}
                    >
                      {text}
                    </p>
                  ))}
                </div>

                {/* Video Number Badge */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                    {String(i + 1).padStart(2, '0')} / {String(hightlightsSlides.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Progress Indicators */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 rounded-full">
          {hightlightsSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleIndicatorClick(i)}
              ref={el => (videoDivRef.current[i] = el)}
              className="h-2 bg-neutral-300 rounded-full relative cursor-pointer transition-all duration-300 overflow-hidden"
              style={{ width: '8px' }}
            >
              <span
                ref={el => (videoSpanRef.current[i] = el)}
                className="absolute left-0 top-0 h-full w-0 rounded-full bg-amber-500"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default VideoCarousel;