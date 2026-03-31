import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoCarousel from './VideoCarousel';
import { Play, ArrowRight, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Highlights = () => {
  useGSAP(() => {
    gsap.to('#title', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#highlights',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    gsap.to('.link', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#highlights',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }, []);

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
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="inline-block text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">
              New Collection
            </span>
            <h2
              id="title"
              className="
                text-neutral-900
                text-3xl sm:text-4xl lg:text-5xl
                font-extrabold tracking-[-0.02em]
                opacity-0 translate-y-8
              "
            >
              Step Into Style.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="
              link
              group
              inline-flex items-center gap-2
              px-6 py-2.5
              bg-neutral-900 hover:bg-neutral-800
              text-white
              text-sm font-medium
              rounded-full
              opacity-0 translate-y-8
              transition-all duration-[250ms] ease cursor-pointer
              hover:shadow-[var(--shadow-soft)]
            ">
              <Play className="w-4 h-4" fill="currentColor" />
              Watch Collection
            </button>

            <button className="
              link
              group
              inline-flex items-center gap-2
              px-6 py-2.5
              bg-white hover:bg-neutral-50
              text-neutral-900
              text-sm font-medium
              rounded-full
              border-2 border-neutral-200 hover:border-amber-500
              opacity-0 translate-y-8
              transition-all duration-[250ms] ease cursor-pointer
            ">
              Shop Now
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <VideoCarousel />
      </div>
    </section>
  );
};

export default Highlights;
