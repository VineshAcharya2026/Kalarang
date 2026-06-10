import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import type { Product } from '../../types';
import ProductGrid from '../products/ProductGrid';

interface BestSellersSectionProps {
  products: Product[];
  loading: boolean;
}

export default function BestSellersSection({ products, loading }: BestSellersSectionProps) {
  return (
    <section id="best-sellers">
      <div className="flex justify-between items-end mb-8 border-b border-gold/20 pb-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-espresso font-bold tracking-wide uppercase flex items-center gap-2">
            <Heart className="h-5 w-5 text-maroon" /> Best Sellers
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            The most beloved designs and fabrics highly-coveted by our clients.
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
          emptyMessage="No featured sarees found. Explore our complete catalogue!"
        />
      )}
    </section>
  );
}
