import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import ProductGrid from '../products/ProductGrid';
import CenteredSectionHeader from '../marketing/CenteredSectionHeader';
import HomeSection from './HomeSection';

interface NewArrivalsSectionProps {
  products: Product[];
  loading: boolean;
}

export default function NewArrivalsSection({ products, loading }: NewArrivalsSectionProps) {
  if (!loading && products.length === 0) return null;

  return (
    <section id="new-arrivals" className="scroll-mt-24 border-t border-border/60" aria-label="New arrivals">
      <HomeSection variant="default">
        <CenteredSectionHeader title="New Arrivals" />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-sand animate-pulse rounded-[var(--radius-home)] shadow-[var(--shadow-soft)]"
              />
            ))}
          </div>
        ) : (
          <>
            <ProductGrid
              products={products}
              variant="minimal"
              columns={products.length <= 5 ? 5 : undefined}
            />
            <div className="flex justify-center mt-10 sm:mt-12">
              <Link to="/collections/all" className="kanya-btn-dark">
                View All
              </Link>
            </div>
          </>
        )}
      </HomeSection>
    </section>
  );
}
