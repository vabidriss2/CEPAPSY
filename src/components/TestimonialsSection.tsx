import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star, Award, ShieldCheck } from "lucide-react";
import { useData } from "../lib/DataContext";

export default function TestimonialsSection() {
  const { testimonials } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Minimum distance required to trigger a swipe
  const minSwipeDistance = 50;

  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    if (testimonials.length <= 1) return;
    autoplayRef.current = setInterval(() => {
      handleNext();
    }, 7000); // Auto-rotate every 7 seconds
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [currentIndex, testimonials]);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for responsive swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section 
      id="temoignages-section" 
      className="py-16 md:py-24 bg-stone-custom-50 border-t border-stone-custom-150 relative overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-emerald-custom-100/20 blur-3xl -ml-28 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-clay-100/30 blur-3xl -mr-32 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header containing badge, title, and descriptive text */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 bg-emerald-custom-100/80 text-emerald-custom-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-emerald-custom-200">
            <Award className="w-3.5 h-3.5" />
            Récits Cliniques & Retours d'Expérience
          </span>
          <h2 className="serif-title text-3xl md:text-4xl font-extrabold text-stone-custom-900 tracking-tight leading-tight">
            Témoignages de nos bénéficiaires
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-stone-custom-800 mt-3 max-w-xl mx-auto">
            Afin de préserver le secret professionnel et le respect absolu de la vie privée, tous nos retours cliniques sont rigoureusement anonymisés.
          </p>
        </div>

        {/* Carousel container */}
        <div className="max-w-4xl mx-auto relative px-2 md:px-12">
          
          {/* Main Slider Cards with Gesture Handling */}
          <div 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative overflow-hidden min-h-[340px] md:min-h-[280px] flex items-center bg-stone-custom-100 rounded-2xl md:rounded-3xl border border-stone-custom-200 p-6 sm:p-8 md:p-12 shadow-sm select-none"
          >
            {/* Background absolute Quote sign */}
            <Quote className="absolute right-6 top-6 w-24 h-24 text-emerald-custom-600/5 rotate-180 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full flex flex-col justify-between h-full"
              >
                {/* 5 Star rating & quote */}
                <div className="space-y-4 md:space-y-6">
                  {/* Rating star sequence */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < (currentTestimonial.rating || 5) ? "fill-clay-500 text-clay-500" : "text-stone-300"}`} 
                      />
                    ))}
                  </div>

                  {/* Main Quote Text */}
                  <blockquote className="text-sm sm:text-base md:text-lg text-stone-custom-900 font-medium md:leading-relaxed italic pl-3 sm:pl-4 border-l-2 border-emerald-custom-600">
                    « {currentTestimonial.quote} »
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="mt-8 flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-stone-custom-200/80">
                  <div className="flex items-center gap-3">
                    {/* Anonymized Elegant Avatar Indicator */}
                    <div className="w-10 h-10 rounded-full bg-emerald-custom-700 flex items-center justify-center text-stone-custom-50 text-xs font-bold tracking-wider shrink-0 shadow-inner">
                      {getInitials(currentTestimonial.author)}
                    </div>
                    <div>
                      <cite className="font-bold text-stone-custom-900 text-xs sm:text-sm not-italic block font-sans">
                        {currentTestimonial.author}
                      </cite>
                      <span className="text-[10px] sm:text-xs text-stone-custom-800 block mt-0.5">
                        {currentTestimonial.context}
                      </span>
                    </div>
                  </div>

                  {/* Trust indicator badge */}
                  <div className="flex items-center gap-1 bg-stone-custom-200/50 rounded-full px-2.5 py-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-custom-600 shrink-0" />
                    <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-custom-850">
                      Anonymat Garanti
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigational Arrows - Hidden on tiny screens, beautiful targets on desktop */}
          <button
            onClick={handlePrev}
            className="absolute left-[-20px] md:left-[-16px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-stone-custom-50 hover:bg-stone-custom-100 border border-stone-custom-200 shadow-sm flex items-center justify-center text-stone-custom-850 hover:text-emerald-custom-700 transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer hidden sm:flex"
            aria-label="Témoignage précédent"
            id="testimonial-prev-btn"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-20px] md:right-[-16px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-stone-custom-50 hover:bg-stone-custom-100 border border-stone-custom-200 shadow-sm flex items-center justify-center text-stone-custom-850 hover:text-emerald-custom-700 transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer hidden sm:flex"
            aria-label="Témoignage suivant"
            id="testimonial-next-btn"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Indicator Bullets and Mobile Touch Arrows */}
        <div className="flex flex-col items-center gap-6 mt-8">
          {/* Bullets */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full h-2.5 cursor-pointer ${
                  index === currentIndex ? "w-8 bg-emerald-custom-600" : "w-2.5 bg-stone-custom-200 hover:bg-stone-custom-300"
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
                id={`testimonial-dot-${index}`}
              />
            ))}
          </div>

          {/* Quick swipe helper and Mobile Prev/Next indicators */}
          <div className="flex sm:hidden items-center gap-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-stone-custom-100 border border-stone-custom-200 flex items-center justify-center text-stone-custom-850 focus:outline-none"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] uppercase font-mono tracking-wider text-stone-custom-800">
              Faites glisser ou touchez
            </span>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-stone-custom-100 border border-stone-custom-200 flex items-center justify-center text-stone-custom-850 focus:outline-none"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
