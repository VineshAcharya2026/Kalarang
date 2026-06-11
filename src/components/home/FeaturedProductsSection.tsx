import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import ProductGrid from '../products/ProductGrid';

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
  const title = searchQuery
    ? `Results for "${searchQuery}"`
    : 'Featured Collection';

  return (
    <section id="featured-products" className="scroll-mt-24">
      <div className="flex justify-between items-end mb-8 border-b border-gold/20 pb-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-espresso font-bold tracking-wide uppercase flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-gold" /> {title}
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Handpicked sarees from our studio — authentic silk, heritage weave.
          </p>
        </div>
        <Link
          to="/collections/all"
          className="font-sans text-xs sm:text-sm font-bold text-maroon hover:text-gold flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          Shop All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-sand/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid
          products={products}
          emptyMessage={
            searchQuery
              ? 'No sarees match your search. Try a different term or browse all collections.'
              : 'Our weavers are crafting new masterpieces. Check back soon!'
          }
        />
      )}
    </section>
  );
}
