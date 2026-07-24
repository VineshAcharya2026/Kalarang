import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCollections } from '../hooks/useCollections';
import { useBanners } from '../hooks/useBanners';
import { useVideos } from '../hooks/useVideos';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import HeroSection from '../components/home/HeroSection';
import CollectionTilesSection from '../components/home/CollectionTilesSection';
import ColorSection from '../components/home/ColorSection';
import EditorialBandSection from '../components/home/EditorialBandSection';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import NewArrivalsSection from '../components/home/NewArrivalsSection';
import TestimonialsSection from '../components/marketing/TestimonialsSection';
import VideoReelsSection from '../components/home/VideoReelsSection';
import VideoSpotlightModal from '../components/home/VideoSpotlightModal';
import { hero } from '../content/siteContent';

export default function Home() {
  const { products, loading: productsLoading } = useProducts();
  const { collections, loading: collectionsLoading } = useCollections({
    includeSeedFallbacks: true,
  });
  const { banners } = useBanners();
  const { videos } = useVideos();
  const location = useLocation();

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const state = location.state as { search?: string; scrollTo?: string } | null;
    if (state?.search) {
      setSearchQuery(state.search);
      window.history.replaceState({}, document.title);
    }
    if (state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(state.scrollTo!)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const inStockProducts = products.filter((p) => p.inStock);
  const activeCollections = collections.filter((c) => c.isActive);

  const featuredProducts = useMemo(() => {
    let filtered = inStockProducts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          (p.work && p.work.toLowerCase().includes(q))
      );
    }

    const featured = filtered.filter((p) => p.isFeatured);
    const rest = filtered.filter((p) => !p.isFeatured);
    return [...featured, ...rest].slice(0, 5);
  }, [inStockProducts, searchQuery]);

  const newArrivals = products.filter((p) => p.isNewArrival && p.inStock).slice(0, 5);

  const collageImages = useMemo(() => {
    const fromProducts = inStockProducts
      .flatMap((p) => p.images || [])
      .filter((url) => url.startsWith('http'));
    return fromProducts.slice(0, 5);
  }, [inStockProducts]);

  const activeBanner = banners.find((b) => b.isActive) || {
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    headline: hero.headline,
    subtext: hero.subtext,
    ctaLabel: hero.primaryCta.label,
    ctaLink: hero.primaryCta.href,
  };

  const handlePlayVideo = (url: string, title: string) => {
    setSelectedVideoUrl(url);
    setSelectedVideoTitle(title);
  };

  const handleCloseVideo = () => {
    setSelectedVideoUrl(null);
    setSelectedVideoTitle('');
  };

  return (
    <div id="home-view" className="min-h-screen flex flex-col bg-cream">
      <AnnouncementBar />
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* 1. Hero */}
      <HeroSection banner={activeBanner} collageImages={collageImages} />

      <main className="flex flex-col w-full">
        {/* 2. Explore collections */}
        <CollectionTilesSection collections={activeCollections} loading={collectionsLoading} />

        <ColorSection />

        {/* 3. Our Story */}
        <EditorialBandSection />

        <TestimonialsSection />

        {videos.length > 0 && (
          <VideoReelsSection videos={videos} onPlayVideo={handlePlayVideo} />
        )}

        <FeaturedProductsSection
          products={featuredProducts}
          loading={productsLoading}
          searchQuery={searchQuery.trim() || undefined}
        />

        <NewArrivalsSection products={newArrivals} loading={productsLoading} />
      </main>

      {selectedVideoUrl && (
        <VideoSpotlightModal
          videoUrl={selectedVideoUrl}
          title={selectedVideoTitle}
          onClose={handleCloseVideo}
        />
      )}

      <WhatsAppFAB />
      <Footer />
    </div>
  );
}
