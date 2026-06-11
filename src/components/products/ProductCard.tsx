import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useSettings } from '../../hooks/useSettings';
import { useCollections } from '../../hooks/useCollections';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { settings } = useSettings();
  const { collections } = useCollections();

  const collectionObj = collections.find((c) => c.id === product.collectionId);
  const collectionName = collectionObj ? collectionObj.name : 'Exclusive Saree';

  const discountPercent = Math.round(
    ((product.mrp - product.salePrice) / product.mrp) * 100
  );

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!settings?.whatsappNumber) return;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const defaultColor = (product.colors && product.colors[0]) || 'Standard';

    const textMessage = `Hi KALARANG! I'm interested in the gorgeous [${product.name}] Saree from your "${collectionName}" fabrics, in the [${defaultColor}] color variant. Could you please share details on availability? 🙏`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultColor = (product.colors && product.colors[0]) || 'StandardStyle';
    addItem(product, defaultColor);
  };

  const mainImage =
    (product.images && product.images[0]) ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -4 }}
      className="bg-cream border border-gold/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl flex flex-col justify-between group transition-all duration-300"
    >
      <Link to={`/products/${product.slug}`} className="block flex-grow">
        <div className="relative aspect-[3/4] bg-sand/30 overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cream/95 text-espresso text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
              <Eye className="h-3.5 w-3.5" /> Quick View
            </span>
          </div>

          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="bg-maroon text-cream text-[10px] tracking-widest font-semibold px-2 py-0.5 uppercase shadow-sm">
                New
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gold text-espresso text-[10px] tracking-widest font-semibold px-2 py-0.5 uppercase shadow-sm">
                Best Seller
              </span>
            )}
            {!product.inStock && (
              <span className="bg-espresso/80 text-white text-[10px] tracking-widest font-semibold px-2 py-0.5 uppercase flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" /> Sold Out
              </span>
            )}
          </div>

          {discountPercent > 0 && product.inStock && (
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
              <span className="absolute top-3 -right-6 w-24 bg-green-700 text-white text-[9px] font-bold text-center py-0.5 rotate-45 shadow-sm">
                {discountPercent}% OFF
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-1">
          <span className="text-[10px] text-gold tracking-widest uppercase font-semibold">
            {collectionName} — {product.fabric}
          </span>
          <h3 className="font-serif text-base text-espresso font-semibold leading-snug tracking-wide group-hover:text-maroon line-clamp-2 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-sans font-bold text-lg text-maroon">
              ₹{product.salePrice.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.salePrice && (
              <span className="font-sans text-xs text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 overflow-hidden transition-all duration-300">
        {product.inStock ? (
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-maroon hover:bg-espresso text-white py-2.5 px-1 rounded text-xs font-sans tracking-wide font-medium flex items-center justify-center gap-1 border border-transparent transition-colors cursor-pointer"
            title="Add product to bag"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            Add To Cart
          </button>
        ) : (
          <button
            disabled
            className="flex-1 bg-gray-200 text-gray-400 py-2.5 px-1 rounded text-xs font-sans tracking-wide font-medium flex items-center justify-center cursor-not-allowed"
          >
            No Stock
          </button>
        )}

        <button
          onClick={handleWhatsAppEnquiry}
          className="bg-transparent text-maroon hover:text-gold p-2.5 rounded border border-maroon/20 hover:border-gold/30 flex items-center justify-center transition-all cursor-pointer"
          title="Direct enquiry on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
