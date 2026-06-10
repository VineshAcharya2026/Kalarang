import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, AlertCircle } from 'lucide-react';
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

  // Find collection name
  const collectionObj = collections.find((c) => c.id === product.collectionId);
  const collectionName = collectionObj ? collectionObj.name : 'Exclusive Saree';

  // Calculate discount percentage
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

  const mainImage = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -6 }}
      className="bg-[#FDF8F2] border border-[#B8860B]/10 rounded-md overflow-hidden shadow-md flex flex-col justify-between group transition-all"
    >
      <Link to={`/products/${product.slug}`} className="block flex-grow">
        
        {/* Saree Thumbnail Image container */}
        <div className="relative aspect-[3/4] bg-[#E8D5B0]/30 overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* New Arrival / Featured / Out of Stock Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="bg-[#7A1C2E] text-[#FDF8F2] text-[10px] tracking-widest font-semibold px-2 py-0.5 uppercase shadow-sm">
                New Arrival
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-[#B8860B] text-[#1C1008] text-[10px] tracking-widest font-semibold px-2 py-0.5 uppercase shadow-sm">
                Best Seller
              </span>
            )}
            {!product.inStock && (
              <span className="bg-[#1C1008]/80 text-white text-[10px] tracking-widest font-semibold px-2 py-0.5 uppercase flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" /> Sold Out
              </span>
            )}
          </div>

          {/* Discount Ribbon */}
          {discountPercent > 0 && product.inStock && (
            <div className="absolute top-2 right-2 bg-green-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Product Copy Specifications */}
        <div className="p-4 flex flex-col gap-1.5">
          <span className="text-[10px] text-[#B8860B] tracking-widest uppercase font-semibold">
            {collectionName} — {product.fabric}
          </span>
          <h3 className="font-serif text-base text-[#1C1008] font-semibold leading-snug tracking-wide group-hover:text-[#7A1C2E] line-clamp-2 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="font-sans font-bold text-[#7A1C2E]">
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

      {/* Quick CTAs Footer Panel */}
      <div className="p-4 pt-0 border-t border-[#B8860B]/5 flex gap-2">
        {product.inStock ? (
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2 px-1 rounded text-xs font-sans tracking-wide font-medium flex items-center justify-center gap-1 border border-transparent transition-colors cursor-pointer"
            title="Add product to bag"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            Add To Cart
          </button>
        ) : (
          <button
            disabled
            className="flex-1 bg-gray-200 text-gray-400 py-2 px-1 rounded text-xs font-sans tracking-wide font-medium flex items-center justify-center cursor-not-allowed"
          >
            No Stock
          </button>
        )}
        
        <button
          onClick={handleWhatsAppEnquiry}
          className="bg-transparent text-[#7A1C2E] hover:text-[#B8860B] p-2 rounded border border-[#7A1C2E]/20 hover:border-[#B8860B]/30 flex items-center justify-center transition-all cursor-pointer"
          title="Direct enquiry on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>

    </motion.div>
  );
}
