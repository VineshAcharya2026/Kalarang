import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingPageShell from '../components/marketing/MarketingPageShell';
import PageHero from '../components/marketing/PageHero';
import { founder } from '../content/siteContent';

export default function FounderPage() {
  return (
    <MarketingPageShell id="founder-page">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <PageHero eyebrow={founder.eyebrow} title={founder.name} subtitle={founder.title} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="aspect-[3/4] bg-sand/30 rounded-md overflow-hidden border border-gold/10 shadow-lg sticky top-28">
            <img
              src={founder.imageUrl}
              alt={founder.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 font-serif text-gray-700 leading-relaxed text-sm sm:text-base">
            <p className="text-lg text-espresso font-semibold">{founder.intro}</p>
            {founder.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="border-l-4 border-gold pl-4 py-2 mt-2">
              <p className="text-xs font-sans font-bold text-gold uppercase tracking-wider mb-2">
                Her Vision
              </p>
              <p className="italic text-maroon font-medium">
                &ldquo;{founder.vision}&rdquo;
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 w-fit mt-4 bg-maroon hover:bg-gold text-white px-6 py-3 rounded text-xs font-sans tracking-widest font-bold uppercase transition-colors"
            >
              Book a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
