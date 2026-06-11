import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, Play, Volume2, VolumeX } from 'lucide-react';
import type { Banner, HeroVideo } from '../../types';

interface HeroSectionProps {
  banner: Pick<Banner, 'imageUrl' | 'headline' | 'subtext' | 'ctaLabel' | 'ctaLink'>;
  activeVideo?: HeroVideo;
  onWatchVideo: (url: string, title: string) => void;
}

export default function HeroSection({ banner, activeVideo, onWatchVideo }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);

  const scrollToProducts = () => {
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero-banner" className="relative lg:h-[85vh] min-h-[560px] bg-slate-900 overflow-hidden -mt-20">
      <div className="absolute inset-0">
        {activeVideo ? (
          <div className="relative w-full h-full">
            <video
              src={activeVideo.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
            />
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-24 right-6 z-20 bg-espresso/70 hover:bg-maroon border border-gold/30 text-white rounded-full p-2.5 cursor-pointer backdrop-blur-sm transition-colors shadow-lg"
              title={isMuted ? 'Unmute Video' : 'Mute Video'}
            >
              {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5 animate-pulse" />}
            </button>
          </div>
        ) : (
          <img
            src={banner.imageUrl}
            alt="Kalarang Premium Hero Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-65"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-espresso/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col items-center justify-center sm:px-6 lg:px-8 z-10 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl flex flex-col gap-4 text-cream text-center"
        >
          <span className="font-sans text-xs tracking-[0.2em] text-gold uppercase font-bold">
            ✨ Traditional Master Craftsmanship ✨
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight uppercase font-medium">
            {banner.headline}
          </h1>
          <p className="font-serif text-base sm:text-lg text-cream/90 leading-relaxed italic max-w-xl mx-auto">
            {banner.subtext}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2.5 bg-maroon hover:bg-gold text-white px-7 py-3 rounded text-xs font-sans tracking-widest font-bold uppercase border border-transparent transition-all shadow-xl hover:shadow-2xl cursor-pointer"
            >
              Shop Collection
              <ArrowRight className="h-4.5 w-4.5" />
            </button>

            <Link
              to={banner.ctaLink === '/collections/all' ? '/collections/all' : banner.ctaLink}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-cream font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded border border-white/25 hover:border-white/40 transition-colors"
            >
              Full Catalog
            </Link>

            {activeVideo && (
              <button
                onClick={() => onWatchVideo(activeVideo.videoUrl, activeVideo.title)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-cream font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded border border-white/25 hover:border-white/40 cursor-pointer transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-white text-white" /> Watch Video
              </button>
            )}
          </div>
        </motion.div>

        <button
          onClick={scrollToProducts}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/70 hover:text-gold transition-colors animate-bounce cursor-pointer"
          aria-label="Scroll to products"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
