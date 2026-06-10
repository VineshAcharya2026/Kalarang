import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Product } from '../../types';
import ProductGrid from '../products/ProductGrid';

interface NewArrivalsSectionProps {
  products: Product[];
  loading: boolean;
}

export default function NewArrivalsSection({ products, loading }: NewArrivalsSectionProps) {
  return (
    <section id="new-arrivals">
      <div className="flex justify-between items-end mb-8 border-b border-gold/20 pb-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-espresso font-bold tracking-wide uppercase flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold" /> New Arrivals
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Freshly handloomed masterpieces added to our studio this week.
          </p>
        </div>
        <Link
          to="/collections/all"
          className="font-sans text-xs sm:text-sm font-bold text-maroon hover:text-gold flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          See All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Retrieving exquisite inventory...</div>
      ) : (
        <ProductGrid
          products={products}
          emptyMessage="Our weavers are busy crafting new items. Check back soon!"
        />
      )}
    </section>
  );
}
