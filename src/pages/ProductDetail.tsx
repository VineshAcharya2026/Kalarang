import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Tag, Check, ArrowLeft, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useProducts } from '../hooks/useProducts';
import { useCollections } from '../hooks/useCollections';
import { useCartStore } from '../store/cartStore';
import { useSettings } from '../hooks/useSettings';
import ProductGrid from '../components/products/ProductGrid';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { collections } = useCollections();
  const { addItem } = useCartStore();
  const { settings } = useSettings();

  // Selected State
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  const product = products.find((p) => p.slug === slug && !p.isDeleted);

  // Set initial selected state when product loads
  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor('Standard');
      }
    }
  }, [product, slug]);

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex flex-col justify-between">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="font-serif italic text-base text-[#1C1008]">Polishing your selected handloom artifact...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex flex-col justify-between">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-8 max-w-sm mx-auto text-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C1008] mb-2 uppercase">Saree Not Found</h2>
            <p className="font-sans text-sm text-gray-500 mb-6">The item you are attempting to review may be currently deleted or out of stock.</p>
            <Link to="/collections/all" className="bg-[#7A1C2E] text-white py-3 px-6 rounded text-xs font-sans tracking-widest font-semibold uppercase">Browse Saree Catalogue</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Lookup Saree Collection Info
  const collectionObj = collections.find((c) => c.id === product.collectionId);
  const collectionName = collectionObj ? collectionObj.name : 'Exclusive Design';

  // Saree Price Discount details
  const discountPercent = Math.round(
    ((product.mrp - product.salePrice) / product.mrp) * 100
  );

  // Similar items (same collection except current item)
  const relatedSarees = products
    .filter((p) => p.collectionId === product.collectionId && p.id !== product.id && p.inStock)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, selectedColor);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const handleWhatsAppEnquiry = () => {
    if (!settings?.whatsappNumber) return;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const messageText = `Hi KALARANG! I'm interested in [${product.name}] Saree from your "${collectionName}" collection, in the [${selectedColor}] color variant. Could you please share more details and availability? 🙏`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`, '_blank');
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div id={`product-detail-${slug}`} className="min-h-screen flex flex-col bg-[#FDF8F2]">
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        
        {/* Navigation Breadcrumbs */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-sans tracking-wider text-gray-500 hover:text-[#7A1C2E] uppercase font-bold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>

        {/* Product Splitted Core View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Saree Images Canvas / Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] bg-[#E8D5B0]/25 border border-[#B8860B]/10 overflow-hidden rounded">
              <img
                src={activeImage || imagesList[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              
              {/* Sold out stamp on details */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-[#1C1008] text-white border-2 border-[#B8860B] font-serif tracking-widest text-lg font-bold uppercase py-3.5 px-8 select-none">
                    Currently Selected Hand
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Carousel */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 aspect-[3/4] overflow-hidden rounded bg-[#E8D5B0]/30 border-2 transition-all cursor-pointer ${
                      activeImage === img ? 'border-[#7A1C2E] scale-95 shadow-md' : 'border-[#B8860B]/10 hover:border-[#B8860B]/30'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail view ${idx + 1}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saree Specifications Metadata Panel */}
          <div className="flex flex-col gap-6">
            
            {/* Header copy */}
            <div className="flex flex-col gap-2">
              <Link
                to={`/collections/${collectionObj?.slug || 'all'}`}
                className="text-xs tracking-[0.2em] text-[#B8860B] uppercase font-bold hover:text-[#7A1C2E] transition-colors"
              >
                {collectionName} Section
              </Link>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1008] font-bold tracking-normal leading-tight uppercase font-medium">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <span className="bg-[#E8D5B0] text-[#1C1008] text-[10px] sm:text-xs font-semibold px-2.5 py-1 uppercase rounded tracking-wider">
                  Fabric: {product.fabric}
                </span>
                <span className="bg-green-700/10 text-green-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 uppercase rounded tracking-wider">
                  Traditional Design
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-[#E8D5B0]/35 border border-[#B8860B]/10 p-5 rounded-md">
              <div className="flex items-baseline gap-4">
                <span className="font-sans text-3xl font-extrabold text-[#7A1C2E]">
                  ₹{product.salePrice.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.salePrice && (
                  <>
                    <span className="font-sans text-lg text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-sans font-bold text-green-700">
                      You Save {discountPercent}%!
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-2 font-sans">
                Price is inclusive of all taxes. Free shipping applies above standard threshold values.
              </p>
            </div>

            {/* Color variants selector chips */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#1C1008] uppercase tracking-wider mb-2.5">
                  Available Colorways: {selectedColor}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3.5 py-2 text-xs font-sans font-medium rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C1008] text-[#FDF8F2] border-transparent shadow'
                            : 'bg-[#FDF8F2] text-[#1C1008] border-[#B8860B]/20 hover:border-[#7A1C2E]'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 shrink-0" />}
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTAs Trigger Area */}
            <div className="flex flex-col sm:flex-row gap-3.5 mt-2">
              {product.inStock ? (
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4.5 px-6 rounded text-xs tracking-widest font-sans font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAddedFeedback
                      ? 'bg-green-700 text-white shadow-xl'
                      : 'bg-[#7A1C2E] hover:bg-[#1C1008] text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {isAddedFeedback ? (
                    <>
                      <Check className="h-4.5 w-4.5 animate-bounce" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4.5 w-4.5 shrink-0" />
                      Add to Shopping Cart
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-grow py-4.5 px-6 rounded text-xs tracking-widest font-sans font-bold uppercase cursor-not-allowed bg-gray-200 text-gray-400 flex items-center justify-center"
                >
                  Sold Out Design
                </button>
              )}

              <button
                onClick={handleWhatsAppEnquiry}
                className="bg-[#FDF8F2] hover:bg-[#7A1C2E]/5 text-[#7A1C2E] hover:text-[#7A1C2E] py-4.5 px-6 rounded text-xs tracking-widest font-sans font-bold uppercase transition-all border border-[#7A1C2E]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="h-4.5 w-4.5 shrink-0" />
                Enquire on WhatsApp
              </button>
            </div>

            {/* Technical Specifications Specs Grid */}
            <div className="border-t border-[#B8860B]/10 pt-6">
              <h3 className="font-serif text-lg font-bold text-[#1C1008] uppercase mb-4 tracking-wider">
                Saree Overview & Features
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm font-sans mb-4">
                <div className="bg-[#E8D5B0]/15 p-3 rounded">
                  <span className="text-[10px] text-gray-500 block uppercase font-medium">Loom Fabric</span>
                  <strong className="text-[#1C1008]">{product.fabric}</strong>
                </div>
                <div className="bg-[#E8D5B0]/15 p-3 rounded">
                  <span className="text-[10px] text-gray-500 block uppercase font-medium">Work / Motif</span>
                  <strong className="text-[#1C1008]">{product.work || 'Pure Handloom Work'}</strong>
                </div>
                <div className="bg-[#E8D5B0]/15 p-3 rounded">
                  <span className="text-[10px] text-gray-500 block uppercase font-medium">Border Details</span>
                  <strong className="text-[#1C1008]">{product.border || 'Zari Border'}</strong>
                </div>
                <div className="bg-[#E8D5B0]/15 p-3 rounded">
                  <span className="text-[10px] text-gray-500 block uppercase font-medium">Texture Style</span>
                  <strong className="text-[#1C1008]">{product.texture || 'Soft Comfort Velvet'}</strong>
                </div>
              </div>

              {/* Recommended Occasions Chips */}
              {product.occasions && product.occasions.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">Recommended Occasion Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.occasions.map((occ) => (
                      <span
                        key={occ}
                        className="bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/15 text-[10px] px-2.5 py-0.5 rounded-full font-sans uppercase font-bold"
                      >
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Guarantees Trust elements */}
            <div className="border-t border-[#B8860B]/10 pt-6 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs text-gray-500 font-sans mt-4">
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-[#B8860B]" />
                <span>Express delivery in India</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-5 w-5 text-[#B8860B]" />
                <span>100% Genuine Loom Silk</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="h-5 w-5 text-[#B8860B]" />
                <span>Easy replacement support</span>
              </div>
            </div>

          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedSarees.length > 0 && (
          <section id="related-sarees-carousel" className="border-t border-[#B8860B]/15 mt-16 pt-12">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="font-serif text-2xl text-[#1C1008] tracking-wide uppercase font-bold">
                You May Also Like
              </h2>
              <div className="h-0.5 w-16 bg-[#B8860B] mt-1.5 mx-auto sm:mx-0" />
            </div>
            
            <ProductGrid products={relatedSarees} />
          </section>
        )}

      </div>

      <WhatsAppFAB />
      <Footer />
    </div>
  );
}
