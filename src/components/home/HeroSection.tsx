import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { brand, hero } from '../../content/siteContent';
import type { Banner } from '../../types';

interface HeroSectionProps {
  banner: Pick<Banner, 'imageUrl' | 'headline' | 'subtext' | 'ctaLabel' | 'ctaLink'>;
  collageImages?: string[];
}

const DEFAULT_COLLAGE = [
  'https://images.unsplash.com/photo-1610030469854-2c069b3f3b90?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
];

const COLLAGE_LAYOUT = [
  { className: 'top-[8%] left-[5%] w-[38%] h-[42%] -rotate-6 z-10' },
  { className: 'top-[4%] right-[8%] w-[34%] h-[38%] rotate-3 z-20' },
  { className: 'top-[38%] left-[18%] w-[32%] h-[36%] rotate-2 z-30' },
  { className: 'top-[42%] right-[4%] w-[36%] h-[40%] -rotate-4 z-20' },
  { className: 'bottom-[6%] left-[32%] w-[34%] h-[38%] rotate-1 z-10' },
];

export default function HeroSection({ banner, collageImages }: HeroSectionProps) {
  const images = collageImages?.length
    ? [...collageImages, ...DEFAULT_COLLAGE].slice(0, 5)
    : [banner.imageUrl, ...DEFAULT_COLLAGE].slice(0, 5);

  const scrollToProducts = () => {
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero-banner" className="bg-cream border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[520px] sm:min-h-[580px] py-12 sm:py-16 lg:py-20">
          {/* Copy — left */}
          <div className="flex flex-col items-start justify-center order-2 lg:order-1 px-2 sm:px-6 lg:px-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] sm:text-xs font-sans font-medium tracking-[0.2em] text-muted uppercase"
            >
              {import.meta.env.VITE_APP_URL?.replace('https://', 'WWW.').toUpperCase() || 'WWW.KALARANG.COM'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-xs sm:text-sm font-sans font-semibold tracking-[0.25em] text-espresso uppercase mt-6"
            >
              {hero.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-[5rem] sm:text-[6.5rem] lg:text-[7.5rem] font-medium text-tan leading-none tracking-tight mt-2"
            >
              NEW
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-serif text-lg sm:text-xl text-espresso/80 mt-4 max-w-sm leading-snug"
            >
              {banner.headline || hero.headline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <button type="button" onClick={scrollToProducts} className="kanya-btn">
                Shop Now
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-xs text-muted mt-6 max-w-md leading-relaxed hidden sm:block"
            >
              {banner.subtext || hero.subtext}
            </motion.p>

            <Link
              to={hero.primaryCta.href}
              className="text-xs font-semibold text-tan hover:text-tan-dark mt-4 uppercase tracking-wider underline-offset-4 hover:underline"
            >
              {hero.primaryCta.label}
            </Link>
          </div>

          {/* Collage — right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative order-1 lg:order-2 w-full aspect-square max-w-lg mx-auto lg:max-w-none lg:min-h-[480px]"
          >
            {images.map((src, i) => (
              <div key={i} className={`hero-collage-item ${COLLAGE_LAYOUT[i].className}`}>
                <img
                  src={src}
                  alt={`${brand.name} collection ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[var(--radius-home)]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
