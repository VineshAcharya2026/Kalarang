import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import ProductGrid from '../products/ProductGrid';
import CenteredSectionHeader from '../marketing/CenteredSectionHeader';
import HomeSection from './HomeSection';

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  searchQuery?: string;
}

export default function FeaturedProductsSection({
  products,
  loading,
  searchQuery,
}: FeaturedProductsSectionProps) {
  const title = searchQuery ? `Results for "${searchQuery}"` : 'Top picks';

  return (
    <section id="featured-products" className="scroll-mt-24" aria-label="Top picks">
      <HomeSection variant="surface">
        <CenteredSectionHeader title={title} />

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
          <ProductGrid
            products={products}
            variant="minimal"
            columns={products.length <= 5 ? 5 : undefined}
            emptyMessage={
              searchQuery
                ? 'No sarees match your search. Try a different term or browse all collections.'
                : 'Our weavers are crafting new masterpieces. Check back soon!'
            }
          />
        )}

        {!loading && products.length > 0 && !searchQuery && (
          <div className="flex justify-center mt-10 sm:mt-12">
            <Link to="/collections/all" className="kanya-btn-dark">
              View All
            </Link>
          </div>
        )}
      </HomeSection>
    </section>
  );
}
