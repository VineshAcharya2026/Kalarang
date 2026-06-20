import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { whatsAppUrl } from '../../constants/contact';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'minimal';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const showAddToCart = product.inStock && product.allowAddToCart !== false;

  const discountPercent = Math.round(
    ((product.mrp - product.salePrice) / product.mrp) * 100
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = (product.colors && product.colors[0]) || 'Standard';
    addItem(product, defaultColor);
  };

  const mainImage =
    (product.images && product.images[0]) ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

  if (variant === 'minimal') {
    return (
      <article id={`product-card-${product.id}`} className="group flex flex-col h-full">
        <Link to={`/products/${product.slug}`} className="block flex-grow">
          <div className="relative aspect-[3/4] bg-sand overflow-hidden mb-3 home-card group-hover:shadow-[var(--shadow-soft-hover)] transition-shadow duration-300">
            <img
              src={mainImage}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.isNewArrival && (
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-espresso text-white text-[9px] font-bold uppercase tracking-wider">
                New
              </span>
            )}
            {discountPercent > 0 && product.inStock && (
              <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-tan text-white text-[9px] font-bold">
                -{discountPercent}%
              </span>
            )}
          </div>
          <h3 className="font-sans text-sm text-espresso leading-snug line-clamp-2 group-hover:text-tan transition-colors text-center">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="font-sans text-sm font-semibold text-espresso">
              ₹{product.salePrice.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.salePrice && (
              <span className="text-xs text-muted line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <motion.article
      id={`product-card-${product.id}`}
      whileHover={{ y: -4 }}
      className="group kit-card overflow-hidden flex flex-col h-full transition-shadow hover:shadow-[var(--shadow-kit-lg)]"
    >
      <Link to={`/products/${product.slug}`} className="block flex-grow">
        <div className="relative aspect-[3/4] bg-cream overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.isNewArrival && (
              <span className="px-2.5 py-1 rounded-full bg-maroon text-white text-[10px] font-semibold">
                New
              </span>
            )}
            {discountPercent > 0 && product.inStock && (
              <span className="px-2.5 py-1 rounded-full bg-espresso text-white text-[10px] font-semibold">
                -{discountPercent}%
              </span>
            )}
            {!product.inStock && (
              <span className="px-2.5 py-1 rounded-full bg-muted text-white text-[10px] font-semibold">
                Sold out
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const message = `Hi KALARANG! I'm interested in "${product.name}".`;
              window.open(whatsAppUrl(message), '_blank');
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-muted hover:text-maroon opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Enquire"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-0.5 text-gold">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-3 w-3 ${i <= 4 ? 'fill-gold text-gold' : 'text-border'}`} />
            ))}
            <span className="text-[10px] text-muted ml-1">(4.0)</span>
          </div>
          <p className="text-[11px] font-medium text-muted uppercase tracking-wide">{product.fabric}</p>
          <h3 className="font-sans text-sm font-semibold text-espresso leading-snug line-clamp-2 group-hover:text-maroon transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-auto pt-1">
            <span className="font-sans text-lg font-bold text-espresso">
              ₹{product.salePrice.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.salePrice && (
              <span className="text-xs text-muted line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {showAddToCart && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cream border border-border text-sm font-semibold text-espresso hover:bg-maroon hover:text-white hover:border-maroon transition-colors cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      )}
    </motion.article>
  );
}
