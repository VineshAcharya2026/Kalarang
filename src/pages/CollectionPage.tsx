import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCollections } from '../hooks/useCollections';
import ProductGrid from '../components/products/ProductGrid';
import FilterBar from '../components/products/FilterBar';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import { MAX_PRICE_FILTER } from '../constants/filters';
import { COLOR_FAMILIES } from '../constants/colors';

function colorMatchesSelection(productColors: string[] | undefined, selected: string[]): boolean {
  if (!productColors?.length) return false;
  const productSet = new Set(productColors.map((c) => c.toLowerCase()));
  return selected.some((sel) => {
    const key = sel.toLowerCase();
    if (productSet.has(key)) return true;
    const family = COLOR_FAMILIES.find((f) => f.name.toLowerCase() === key);
    if (!family) return false;
    return family.shades.some((shade) => productSet.has(shade.toLowerCase()));
  });
}

export default function CollectionPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading: productsLoading } = useProducts();
  const { collections, loading: collectionsLoading } = useCollections({
    includeSeedFallbacks: true,
  });

  // Filters State
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_FILTER);
  const [sortBy, setSortBy] = useState<string>('newest');

  // Trigger filters sync if query search params exist (e.g., redirect from Occasions grid)
  useEffect(() => {
    const qOccasion = searchParams.get('occasion');
    const qColor = searchParams.get('color');
    if (qOccasion) {
      setSelectedOccasions([qOccasion]);
      searchParams.delete('occasion');
      setSearchParams(searchParams);
    }
    if (qColor) {
      setSelectedColors([qColor]);
      searchParams.delete('color');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Reset filters when the collection route change (e.g. clicking Banana Silk then russian Silk)
  useEffect(() => {
    setSelectedOccasions([]);
    setSelectedColors([]);
    setMaxPrice(MAX_PRICE_FILTER);
  }, [slug]);

  if (productsLoading || collectionsLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex flex-col justify-between">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="font-serif italic text-base text-[#1C1008]">Refining traditional saree catalog sheets...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Identify collection by slug
  const isAll = slug === 'all' || !slug;
  const currentCollection = collections.find((c) => c.slug === slug);

  // If slug is not "all", and also not a valid collection, show not found
  if (!isAll && !currentCollection) {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex flex-col justify-between">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-8 max-w-sm mx-auto text-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C1008] mb-2 uppercase">Collection Not Found</h2>
            <p className="font-sans text-sm text-gray-500 mb-6">The collection slug you are trying to browse is not currently registered in our studio.</p>
            <Link to="/collections/all" className="bg-[#7A1C2E] text-white py-3 px-6 rounded text-xs font-sans tracking-widest font-semibold uppercase">Explore All Sarees</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter products by collection matching
  let filteredProducts = products.filter((p) => {
    if (isAll) return true;
    return p.collectionId === currentCollection?.id;
  });

  // Collect active unique occasions & colors for filters sidebar
  const availableOccasions: string[] = Array.from(
    new Set(filteredProducts.flatMap((p) => p.occasions || []))
  ).filter((item): item is string => typeof item === 'string');

  const availableColors: string[] = Array.from(
    new Set(filteredProducts.flatMap((p) => p.colors || []))
  ).filter((item): item is string => typeof item === 'string');

  // Apply User Selection Filters
  filteredProducts = filteredProducts.filter((product) => {
    // Occasions matcher
    if (selectedOccasions.length > 0) {
      const match = product.occasions?.some((occ) => selectedOccasions.includes(occ));
      if (!match) return false;
    }
    
    // Colors matcher (main colour family matches its listed shades)
    if (selectedColors.length > 0) {
      if (!colorMatchesSelection(product.colors, selectedColors)) return false;
    }

    // Price range slider
    if (product.salePrice > maxPrice) {
      return false;
    }

    return true;
  });

  // Apply Sorting
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.salePrice - b.salePrice;
    } else if (sortBy === 'price-desc') {
      return b.salePrice - a.salePrice;
    } else {
      // Default: newest
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    }
  });

  const handleClearFilters = () => {
    setSelectedOccasions([]);
    setSelectedColors([]);
    setMaxPrice(MAX_PRICE_FILTER);
  };

  const headerTitle = isAll ? 'Our Full Saree Catalogue' : currentCollection?.name || 'Exclusive Sarees';
  const headerDescription = isAll 
    ? 'Browse our complete catalog of meticulously handcrafted silk and cotton sarees sourced representing the absolute highest tier of loom design.'
    : `Explore the dynamic patterns, border configurations, and classic heritage behind our exclusive ${currentCollection?.name} collection.`;

  return (
    <div id={`collection-page-${slug}`} className="min-h-screen flex flex-col bg-[#FDF8F2]">
      <AnnouncementBar />
      <Navbar />

      {/* Page Header */}
      <header className="bg-[#E8D5B0]/40 border-b border-[#B8860B]/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <Link 
            to="/" 
            className="text-xs font-sans tracking-widest text-[#B8860B] hover:text-[#7A1C2E] uppercase font-bold"
          >
            &larr; Studio Lobby
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1008] font-bold tracking-wide uppercase mt-3">
            {headerTitle}
          </h1>
          <div className="h-0.5 w-16 bg-[#B8860B] mt-2 mb-3.5 mx-auto sm:mx-0" />
          <p className="font-serif italic text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
            {headerDescription}
          </p>
        </div>
      </header>

      {/* Main catalogue and sidebar layout */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Leftside filter bar */}
          <div className="w-full lg:w-64 shrink-0">
            <FilterBar
              selectedOccasions={selectedOccasions}
              setSelectedOccasions={setSelectedOccasions}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              availableOccasions={availableOccasions}
              availableColors={availableColors}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Rightside Saree grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6 font-sans text-xs sm:text-sm text-gray-500">
              <p>
                Showing <strong className="text-[#1C1008]">{filteredProducts.length}</strong> luxurious sarees
              </p>
              {isAll || (
                <div className="hidden sm:block">
                  <span className="text-[10px] bg-[#B8860B]/10 text-[#B8860B] px-2 py-1 select-none font-bold uppercase rounded">
                    Premium Section
                  </span>
                </div>
              )}
            </div>

            <ProductGrid 
              products={filteredProducts} 
              emptyMessage="No exquisite sarees in our inventory match all selected filters. Try clearing some refine parameters."
            />
          </div>

        </div>
      </div>

      <WhatsAppFAB />
      <Footer />
    </div>
  );
}
