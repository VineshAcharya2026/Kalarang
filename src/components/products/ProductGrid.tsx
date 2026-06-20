import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  variant?: 'default' | 'minimal';
  columns?: number;
}

export default function ProductGrid({
  products,
  emptyMessage = 'No exquisite sarees found matching your criteria.',
  variant = 'default',
  columns,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-[#B8860B]/20 rounded-md bg-[#FDF8F2]/50">
        <p className="font-serif text-lg text-[#1C1008] italic">
          {emptyMessage}
        </p>
        <p className="font-sans text-xs text-gray-500 mt-2">
          Try adjusting your selection filters or browse other saree collections.
        </p>
      </div>
    );
  }

  // Stagger animation container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  const effectiveColumns = columns ?? (products.length <= 5 ? 5 : 4);
  const gridColsClass =
    effectiveColumns === 5
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid ${gridColsClass} gap-4 sm:gap-6 lg:gap-8`}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} variant={variant} />
        </motion.div>
      ))}
    </motion.div>
  );
}
