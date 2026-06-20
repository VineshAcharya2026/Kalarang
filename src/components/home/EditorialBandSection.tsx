import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { about, founder } from '../../content/siteContent';

const ease = [0.22, 1, 0.36, 1] as const;

export default function EditorialBandSection() {
  return (
    <section id="editorial-band" aria-label="Our story" className="py-14 sm:py-20 bg-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease }}
          className="relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl bg-surface border border-border/50 shadow-[0_20px_60px_rgb(0_0_0/0.06)] hover:shadow-[0_28px_70px_rgb(0_0_0/0.09)] transition-shadow duration-500"
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[440px] overflow-hidden bg-sand m-3 sm:m-4 lg:m-5 lg:mr-0 rounded-2xl lg:rounded-3xl"
          >
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease }}
              src={founder.imageUrl}
              alt={`${founder.name}, ${founder.title}`}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent pointer-events-none rounded-2xl lg:rounded-3xl" />
            <div className="absolute bottom-4 left-4 right-4 lg:hidden">
              <p className="text-[10px] font-semibold text-gold uppercase tracking-widest">{founder.eyebrow}</p>
              <p className="font-serif text-lg text-white font-medium mt-1">{founder.name}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="flex flex-col justify-center gap-4 p-8 sm:p-10 lg:p-12 xl:p-14 bg-gradient-to-br from-surface via-surface to-sand/30"
          >
            <span className="text-[10px] font-semibold text-tan uppercase tracking-[0.25em]">
              Our Story
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl xl:text-[2rem] font-medium text-espresso leading-snug">
              {about.title}
            </h2>

            <div className="hidden lg:block pb-2 border-b border-border/60">
              <p className="text-xs font-semibold text-gold uppercase tracking-wide">{founder.eyebrow}</p>
              <p className="font-sans text-sm font-bold text-espresso mt-1">{founder.name}</p>
              <p className="text-xs text-muted">{founder.title}</p>
            </div>

            <p className="text-sm text-muted leading-relaxed">{about.teaser}</p>

            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm italic text-maroon/90 bg-tan/10 rounded-2xl px-5 py-4 border border-tan/20"
            >
              &ldquo;{founder.vision}&rdquo;
              <footer className="text-xs not-italic text-muted mt-2 font-sans">— {founder.name}</footer>
            </motion.blockquote>

            <div className="flex flex-wrap gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/about"
                  className="kanya-btn inline-flex items-center gap-2 rounded-full !px-6 transition-all duration-300 hover:shadow-lg hover:shadow-tan/25"
                >
                  Our Story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/founder"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider text-espresso bg-cream border border-border hover:border-tan hover:text-tan hover:bg-white transition-all duration-300"
                >
                  Meet Founder
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
