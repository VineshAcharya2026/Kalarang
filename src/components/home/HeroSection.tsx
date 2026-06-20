import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { brand, hero, heroSlides } from '../../content/siteContent';
import type { Banner } from '../../types';

interface HeroSectionProps {
  banner: Pick<Banner, 'imageUrl' | 'headline' | 'subtext' | 'ctaLabel' | 'ctaLink'>;
  collageImages?: string[];
}

const AUTOPLAY_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection({ banner, collageImages }: HeroSectionProps) {
  const slides = useMemo(() => {
    return heroSlides.map((slide, i) => ({
      ...slide,
      image: collageImages?.[i] || slide.image,
    }));
  }, [collageImages]);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const scrollToProducts = () => {
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeSlide = slides[current];

  return (
    <section
      id="hero-banner"
      className="relative overflow-hidden min-h-[620px] sm:min-h-[680px] lg:min-h-[720px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured saree collections"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a0610] via-[#4a0412] to-[#1a1a1a]" />

      {/* Animated pattern layer — changes per slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.patternClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 ${activeSlide.patternClass}`}
          aria-hidden
        />
      </AnimatePresence>

      {/* Gold shimmer overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #d4af37 0%, transparent 40%), radial-gradient(circle at 80% 70%, #b8956f 0%, transparent 35%)',
        }}
        aria-hidden
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0510]/90 via-[#1a0510]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0510]/80 via-transparent to-[#1a0510]/30 pointer-events-none" />

      {/* Carousel images */}
      <div className="absolute inset-0 lg:left-[38%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease }}
            className="absolute inset-0"
          >
            <img
              src={activeSlide.image}
              alt={`${activeSlide.pattern} saree`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a0510]/20 to-[#1a0510]/70 lg:via-[#1a0510]/10 lg:to-[#1a0510]/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[620px] sm:min-h-[680px] lg:min-h-[720px] flex flex-col justify-end lg:justify-center pb-10 sm:pb-12 lg:pb-0">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] sm:text-xs font-sans font-medium tracking-[0.25em] text-gold/80 uppercase"
          >
            {brand.tagline}
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-[10px] sm:text-xs font-semibold text-gold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                {activeSlide.pattern}
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-[1.05] tracking-tight mt-5">
                {hero.headline.split(' ').slice(0, 2).join(' ')}
                <span className="block text-tan mt-1">
                  {hero.headline.split(' ').slice(2).join(' ')}
                </span>
              </h1>

              <p className="font-sans text-sm sm:text-base text-white/75 mt-4 max-w-md leading-relaxed">
                {activeSlide.tagline}. {banner.subtext || hero.subtext}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 mt-8"
          >
            <button
              type="button"
              onClick={scrollToProducts}
              className="kanya-btn rounded-full !px-7 shadow-lg shadow-tan/20 hover:shadow-tan/30 transition-shadow"
            >
              Shop Now
            </button>
            <Link
              to={hero.secondaryCta.href}
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-colors"
            >
              {hero.secondaryCta.label}
            </Link>
          </motion.div>

          {/* Slide indicators + pattern strip */}
          <div className="mt-10 lg:mt-12">
            <div className="flex items-center gap-2 mb-4">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`View ${slide.pattern}`}
                  aria-current={i === current ? 'true' : undefined}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === current
                      ? 'w-10 bg-gold'
                      : 'w-3 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <div className="hidden sm:flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 border ${
                    i === current
                      ? 'bg-gold/20 border-gold/50 text-gold'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/25'
                  }`}
                >
                  {slide.pattern}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Decorative border frame */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-4 sm:top-6 sm:bottom-6 border border-gold/10 rounded-3xl pointer-events-none z-10" />
    </section>
  );
}
