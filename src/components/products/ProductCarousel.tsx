import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-cream/50">
        <p className="font-serif text-base text-espresso italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      <div className="hidden sm:flex absolute -top-14 right-0 gap-1 z-10">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="h-9 w-9 rounded-full border border-border bg-surface flex items-center justify-center text-espresso hover:border-maroon hover:text-maroon transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll('right')}
          className="h-9 w-9 rounded-full border border-border bg-surface flex items-center justify-center text-espresso hover:border-maroon hover:text-maroon transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-1 px-1"
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[72vw] sm:w-64 lg:w-72 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
