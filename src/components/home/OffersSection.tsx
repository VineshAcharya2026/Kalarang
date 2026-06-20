import React from 'react';
import type { Product } from '../../types';
import ProductCarousel from '../products/ProductCarousel';
import SectionHeader from '../marketing/SectionHeader';

interface OffersSectionProps {
  products: Product[];
  loading: boolean;
}

export default function OffersSection({ products, loading }: OffersSectionProps) {
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section id="offers" className="scroll-mt-24" aria-label="Special offers">
      <div className="rounded-2xl border border-maroon/15 bg-gradient-to-br from-maroon/5 via-surface to-gold/5 p-5 sm:p-8">
        <SectionHeader
          eyebrow="Exclusive"
          title="Special Offers"
          description="Selected sarees at exceptional value."
          link={{ label: 'See all', href: '/collections/all' }}
        />

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-64 aspect-[3/4] bg-sand/50 rounded-2xl animate-pulse shrink-0" />
            ))}
          </div>
        ) : (
          <ProductCarousel products={products} emptyMessage="No active offers right now." />
        )}
      </div>
    </section>
  );
}
