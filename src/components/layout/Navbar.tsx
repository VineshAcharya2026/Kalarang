import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useCollections } from '../../hooks/useCollections';
import { useCartStore } from '../../store/cartStore';

interface NavbarProps {
  transparent?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Navbar({ transparent, searchQuery, onSearchChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { collections } = useCollections();
  const { itemCount } = useCartStore();
  const location = useLocation();

  const activeCollections = collections.filter((c) => c.isActive);
  const isHome = location.pathname === '/';
  const useTransparent = transparent && isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinkClass = `font-sans text-sm font-medium transition-colors ${
    useTransparent
      ? 'text-cream hover:text-gold'
      : 'text-espresso hover:text-maroon'
  }`;

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        useTransparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-cream border-b border-gold/20 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-start leading-none group">
              <span
                id="brand-title"
                className={`font-serif text-2xl font-bold tracking-[0.15em] transition-colors duration-300 ${
                  useTransparent
                    ? 'text-cream group-hover:text-gold'
                    : 'text-espresso group-hover:text-maroon'
                }`}
              >
                KALARANG
              </span>
              <span
                id="brand-tagline"
                className={`font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold mt-0.5 ${
                  useTransparent ? 'text-gold' : 'text-gold'
                }`}
              >
                Silks & Studio
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex space-x-6 items-center">
            <Link to="/" className={navLinkClass}>
              Home
            </Link>

            <div className="relative group text-inherit">
              <button className={`${navLinkClass} flex items-center gap-1 py-4 focus:outline-none`}>
                Collections
              </button>
              <div className="absolute left-0 mt-0 w-64 bg-cream border border-gold/10 rounded-md shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {activeCollections.length === 0 ? (
                  <div className="px-4 py-2 text-xs font-sans text-gray-400">Loading...</div>
                ) : (
                  activeCollections.map((col) => (
                    <Link
                      key={col.id}
                      to={`/collections/${col.slug}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-sand/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded overflow-hidden bg-sand/30 shrink-0 border border-gold/10">
                        {col.coverImage && (
                          <img
                            src={col.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-sans text-espresso hover:text-maroon">
                        {col.name}
                      </span>
                    </Link>
                  ))
                )}
                <Link
                  to="/collections/all"
                  className="block px-4 py-2.5 text-xs font-bold text-maroon hover:bg-sand/40 border-t border-gold/10 mt-1 uppercase tracking-wider"
                >
                  View All Sarees →
                </Link>
              </div>
            </div>

            {isHome ? (
              <>
                <button onClick={() => scrollToSection('new-arrivals')} className={navLinkClass}>
                  New Arrivals
                </button>
                <button onClick={() => scrollToSection('offers')} className={navLinkClass}>
                  Offers
                </button>
              </>
            ) : (
              <>
                <Link to="/collections/all" className={navLinkClass}>
                  New Arrivals
                </Link>
                <Link to="/collections/all" className={navLinkClass}>
                  Offers
                </Link>
              </>
            )}

            <Link to="/about" className={navLinkClass}>
              About
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {onSearchChange && (
              <div className="hidden md:flex items-center relative">
                <Search
                  className={`absolute left-3 h-4 w-4 ${
                    useTransparent ? 'text-cream/60' : 'text-gray-400'
                  }`}
                />
                <input
                  type="search"
                  placeholder="Search sarees..."
                  value={searchQuery ?? ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`pl-9 pr-3 py-2 w-40 lg:w-48 text-xs rounded-full border focus:outline-none focus:ring-1 focus:ring-gold transition-colors ${
                    useTransparent
                      ? 'bg-white/10 border-white/20 text-cream placeholder:text-cream/50'
                      : 'bg-cream border-gold/25 text-espresso placeholder:text-gray-400'
                  }`}
                />
              </div>
            )}

            <Link
              to="/cart"
              className={`p-2 rounded-full transition-colors relative ${
                useTransparent ? 'text-cream hover:text-gold' : 'text-espresso hover:text-maroon'
              }`}
              title="Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon text-cream font-semibold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 focus:outline-none ${
                  useTransparent ? 'text-cream hover:text-gold' : 'text-espresso hover:text-maroon'
                }`}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-cream border-t border-gold/10 py-3 space-y-1">
          {onSearchChange && (
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search sarees..."
                  value={searchQuery ?? ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gold/25 bg-cream text-espresso focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-base font-sans font-medium text-espresso hover:bg-sand/50 hover:text-maroon"
          >
            Home
          </Link>

          <div className="px-4 py-1 text-xs font-sans tracking-widest text-gold font-semibold uppercase mt-1">
            Collections
          </div>
          {activeCollections.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              onClick={() => setIsOpen(false)}
              className="block pl-8 pr-4 py-2 text-sm font-sans text-gray-700 hover:bg-sand/50 hover:text-maroon"
            >
              {col.name}
            </Link>
          ))}

          {isHome ? (
            <>
              <button
                onClick={() => scrollToSection('new-arrivals')}
                className="block w-full text-left px-4 py-2.5 text-base font-sans font-medium text-espresso hover:bg-sand/50 hover:text-maroon"
              >
                New Arrivals
              </button>
              <button
                onClick={() => scrollToSection('offers')}
                className="block w-full text-left px-4 py-2.5 text-base font-sans font-medium text-espresso hover:bg-sand/50 hover:text-maroon"
              >
                Offers
              </button>
            </>
          ) : (
            <Link
              to="/collections/all"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-base font-sans font-medium text-espresso hover:bg-sand/50 hover:text-maroon"
            >
              Shop All
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-base font-sans font-medium text-espresso hover:bg-sand/50 hover:text-maroon border-t border-gold/5 mt-2"
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
