import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCollections } from '../hooks/useCollections';
import { useBanners } from '../hooks/useBanners';
import { useVideos } from '../hooks/useVideos';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import HeroSection from '../components/home/HeroSection';
import CategoryPills from '../components/home/CategoryPills';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import TrustBadges from '../components/home/TrustBadges';
import OffersSection from '../components/home/OffersSection';
import NewArrivalsSection from '../components/home/NewArrivalsSection';
import BestSellersSection from '../components/home/BestSellersSection';
import OccasionsSection from '../components/home/OccasionsSection';
import AboutTeaser from '../components/home/AboutTeaser';
import VideoReelsSection from '../components/home/VideoReelsSection';
import VideoSpotlightModal from '../components/home/VideoSpotlightModal';

export default function Home() {
  const { products, loading: productsLoading } = useProducts();
  const { collections, loading: collectionsLoading } = useCollections();
  const { banners } = useBanners();
  const { videos } = useVideos();
  const navigate = useNavigate();

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const inStockProducts = products.filter((p) => p.inStock);
  const activeCollections = collections.filter((c) => c.isActive);

  const featuredProducts = useMemo(() => {
    let filtered = inStockProducts;

    if (activeCategoryId) {
      filtered = filtered.filter((p) => p.collectionId === activeCategoryId);
    }

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
    return [...featured, ...rest].slice(0, 12);
  }, [inStockProducts, activeCategoryId, searchQuery]);

  const newArrivals = products.filter((p) => p.isNewArrival && p.inStock).slice(0, 8);
  const bestSellers = products.filter((p) => p.isFeatured && p.inStock).slice(0, 8);
  const offers = products.filter((p) => p.salePrice < p.mrp && p.inStock).slice(0, 8);

  const activeBanner = banners.find((b) => b.isActive) || {
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    headline: 'Weaving Elegance Across Generations',
    subtext:
      'Discover the pure heritage of traditional Indian loom-woven masterpieces, crafted in rich silk and gold brocade design.',
    ctaLabel: 'Shop Saree Catalog',
    ctaLink: '/collections/all',
  };

  const activeVideo = videos.find((v) => v.isActive);

  const handlePlayVideo = (url: string, title: string) => {
    setSelectedVideoUrl(url);
    setSelectedVideoTitle(title);
  };

  const handleCloseVideo = () => {
    setSelectedVideoUrl(null);
    setSelectedVideoTitle('');
  };

  const handleOccasionClick = (slug: string) => {
    navigate(`/collections/all?occasion=${slug}`);
  };

  return (
    <div id="home-view" className="min-h-screen flex flex-col bg-cream">
      <AnnouncementBar />
      <Navbar
        transparent
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <HeroSection
        banner={activeBanner}
        activeVideo={activeVideo}
        onWatchVideo={handlePlayVideo}
      />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-16 w-full">
        <CategoryPills
          collections={activeCollections}
          activeId={activeCategoryId}
          onSelect={setActiveCategoryId}
          loading={collectionsLoading}
        />

        <FeaturedProductsSection
          products={featuredProducts}
          loading={productsLoading}
          searchQuery={searchQuery.trim() || undefined}
        />

        <TrustBadges />

        <OffersSection products={offers} loading={productsLoading} />
        <NewArrivalsSection products={newArrivals} loading={productsLoading} />
        <BestSellersSection products={bestSellers} loading={productsLoading} />
        <OccasionsSection onOccasionClick={handleOccasionClick} />
        <AboutTeaser />
        <VideoReelsSection videos={videos} onPlayVideo={handlePlayVideo} />
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
