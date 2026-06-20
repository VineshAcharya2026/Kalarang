import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../marketing/SectionHeader';

const OCCASIONS = [
  { name: 'Wedding Wear', slug: 'Wedding', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Festive Wear', slug: 'Festive', image: 'https://images.unsplash.com/photo-1610030469854-2c069b3f3b90?auto=format&fit=crop&w=600&q=80' },
  { name: 'Office & Formals', slug: 'Office', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Temple & Gifting', slug: 'Gifting', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80' },
];

interface OccasionsSectionProps {
  onOccasionClick: (slug: string) => void;
}

export default function OccasionsSection({ onOccasionClick }: OccasionsSectionProps) {
  return (
    <section id="shop-by-occasion" aria-label="Shop by occasion">
      <SectionHeader eyebrow="Occasions" title="Shop by Occasion" centered />

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
        {OCCASIONS.map((occ) => (
          <button
            key={occ.name}
            type="button"
            onClick={() => onOccasionClick(occ.slug)}
            className="group relative shrink-0 w-[72vw] sm:w-56 lg:w-auto aspect-[3/4] rounded-2xl overflow-hidden kit-card !p-0 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-maroon snap-start"
          >
            <img
              src={occ.image}
              alt={occ.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="font-sans text-sm font-bold text-white">{occ.name}</h4>
              <span className="inline-flex items-center gap-1 text-xs text-white/70 group-hover:text-gold mt-1 transition-colors">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
