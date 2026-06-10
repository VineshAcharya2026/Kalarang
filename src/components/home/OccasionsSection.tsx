import React from 'react';
import { ArrowRight } from 'lucide-react';

const OCCASIONS = [
  {
    name: 'Wedding Wear',
    slug: 'Wedding',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Festive Wear',
    slug: 'Festive',
    image: 'https://images.unsplash.com/photo-1610030469854-2c069b3f3b90?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Office / Formals',
    slug: 'Office',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Temple & Gifting',
    slug: 'Gifting',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  },
];

interface OccasionsSectionProps {
  onOccasionClick: (slug: string) => void;
}

export default function OccasionsSection({ onOccasionClick }: OccasionsSectionProps) {
  return (
    <section id="shop-by-occasion" className="bg-sand rounded-md p-8 sm:p-12 border border-gold/15">
      <div className="text-center mb-10 max-w-lg mx-auto flex flex-col gap-2">
        <span className="text-[10px] sm:text-xs tracking-[0.25em] text-maroon font-bold uppercase">
          Curated Dresscodes
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-espresso font-bold tracking-wide uppercase">
          Shop by Occasion
        </h2>
        <div className="h-0.5 w-16 bg-maroon mx-auto mt-1" />
        <p className="font-sans text-xs sm:text-sm text-gray-600 italic">
          From temple rituals to office elegance, find the perfect drape style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {OCCASIONS.map((occ) => (
          <button
            key={occ.name}
            onClick={() => onOccasionClick(occ.slug)}
            className="relative aspect-[3/4] bg-neutral-100 rounded-md overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-maroon border-0"
          >
            <img
              src={occ.image}
              alt={occ.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent flex items-end p-4 justify-center" />
            <div className="absolute bottom-6 left-2 right-2 text-center text-white">
              <h4 className="font-serif text-base sm:text-lg font-bold tracking-wide uppercase">
                {occ.name}
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase font-sans font-semibold text-sand/95 mt-1 border-b border-sand/40 group-hover:border-sand transition-colors">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
