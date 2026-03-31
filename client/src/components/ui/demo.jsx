import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "../../hooks/useRouter.jsx";
import ScrollExpandMedia from "./scroll-expansion-hero";

const sampleMediaContent = {
  image: {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1280&q=80",
    background:
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1920&q=80",
    title: "Step Into New Arrivals",
    date: "Fresh Drop",
    scrollToExpand: "Scroll to expand",
    about: {
      overview:
        "Meet the newest SprintShoes lineup: lightweight cushioning, breathable knits, and all-day support built for daily movement.",
      conclusion:
        "Explore the full catalog and find your next pair designed for comfort, speed, and style.",
    },
  },
};

const MediaContent = () => {
  const currentMedia = sampleMediaContent.image;

  return (
    <div className="max-w-4xl mx-auto text-neutral-900">
      <h3 className="text-2xl sm:text-3xl font-bold mb-4">New Arrivals</h3>
      <p className="text-base sm:text-lg mb-6 text-neutral-700">{currentMedia.about.overview}</p>
      <p className="text-base sm:text-lg mb-8 text-neutral-700">{currentMedia.about.conclusion}</p>

      <Link
        href="/products?sort=newest"
        className="group inline-flex items-center gap-3 px-7 py-3 bg-yellow-400 text-neutral-900 font-bold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/40"
      >
        Shop New Arrivals
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export const NewArrivalsScrollExpansion = () => {
  const currentMedia = sampleMediaContent.image;

  return (
    <ScrollExpandMedia
        mediaType="image"
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent />
      </ScrollExpandMedia>
  );
};

export default NewArrivalsScrollExpansion;
