import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';
import type { Product } from '../../types';
import ProductCarousel from '../products/ProductCarousel';

interface OffersSectionProps {
  products: Product[];
  loading: boolean;
}

export default function OffersSection({ products, loading }: OffersSectionProps) {
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section id="offers" className="bg-maroon/5 border border-gold/15 rounded-lg p-6 sm:p-8 scroll-mt-24">
      <div className="flex justify-between items-end mb-6 border-b border-gold/20 pb-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-espresso font-bold tracking-wide uppercase flex items-center gap-2">
            <Gift className="h-6 w-6 text-gold" /> Special Offers
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Handpicked sarees at exclusive prices — swipe to explore.
          </p>
        </div>
        <Link
          to="/collections/all"
          className="font-sans text-xs sm:text-sm font-bold text-maroon hover:text-gold flex items-center gap-1 transition-colors uppercase tracking-wider shrink-0"
        >
          See All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-64 h-80 bg-sand/30 rounded-lg animate-pulse shrink-0" />
          ))}
        </div>
      ) : (
        <ProductCarousel products={products} emptyMessage="No active offers right now." />
      )}
    </section>
  );
}
