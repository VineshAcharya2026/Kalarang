import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brand, cta } from '../../content/siteContent';

export default function CTASection() {
  return (
    <section id="cta-band" className="rounded-2xl overflow-hidden !border-0 bg-maroon text-cream p-8 sm:p-12 lg:p-14 text-center flex flex-col items-center gap-4 shadow-[var(--shadow-kit-lg)]">
      <span className="text-xs font-semibold text-gold uppercase tracking-wide">{brand.tagline}</span>
      <h2 className="font-serif text-2xl sm:text-3xl font-semibold max-w-lg leading-snug">{cta.title}</h2>
      <p className="font-sans text-sm text-cream/75 max-w-md leading-relaxed">{cta.description}</p>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-maroon text-sm font-semibold hover:bg-gold hover:text-espresso transition-colors">
          Book Consultation
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/collections/all" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/30 text-sm font-semibold hover:bg-white/10 transition-colors">
          Shop Collections
        </Link>
      </div>
    </section>
  );
}
