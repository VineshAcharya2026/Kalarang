import React from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductCarousel({
  products,
  emptyMessage = 'No products to display.',
}: ProductCarouselProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-gold/20 rounded-lg bg-cream/50">
        <p className="font-serif text-base text-espresso italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
      {products.map((product) => (
        <div key={product.id} className="flex-shrink-0 w-64 sm:w-72 snap-start">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
