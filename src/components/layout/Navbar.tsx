import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, ChevronDown } from 'lucide-react';
import { useCollections } from '../../hooks/useCollections';
import { useCartStore } from '../../store/cartStore';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const LOGO_SRC = '/kalarang.png';

const STATIC_NAV = [
  { label: 'Shop All', href: '/collections/all' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [shopOpen, setShopOpen] = useState(false);
  const { collections } = useCollections();
  const { itemCount } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const activeCollections = collections.filter((c) => c.isActive);
  const isHome = location.pathname === '/';
  const query = searchQuery ?? localSearch;

  const setQuery = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    else setLocalSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    if (!isHome) {
      navigate('/', { state: { search: query.trim() } });
      setIsOpen(false);
      return;
    }
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-maroon border-b border-gold/20 shadow-md">
      {/* Top bar — search | logo | account + cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative flex items-center justify-between h-24 sm:h-28 lg:h-32">
          <div className="flex items-center justify-start min-w-[2.5rem] sm:min-w-[5rem] z-10">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-10 w-10 flex items-center justify-center text-cream hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20"
            aria-label="Kalarang Silks and Studio — Home"
          >
            <img
              src={LOGO_SRC}
              alt="Kalarang Silks & Studio"
              className="h-20 sm:h-28 lg:h-[7.5rem] w-auto max-w-[260px] sm:max-w-[380px] lg:max-w-[440px] object-contain object-center group-hover:opacity-95 transition-opacity"
            />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2 min-w-[2.5rem] sm:min-w-[5rem] z-10 text-cream">
            <Link
              to="/admin/login"
              className="h-10 w-10 flex items-center justify-center hover:text-gold transition-colors"
              title="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              className="relative h-10 w-10 flex items-center justify-center hover:text-gold transition-colors"
              title="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-gold text-maroon text-[9px] font-bold flex items-center justify-center px-0.5">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center hover:text-gold transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Expandable search */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="pb-4 border-t border-gold/20 pt-3">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/60" />
              <input
                type="search"
                autoFocus
                placeholder="Search sarees, fabrics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gold/30 bg-maroon/80 text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold rounded-md"
              />
            </div>
          </form>
        )}
      </div>

      {/* Category nav — desktop */}
      <nav className="hidden lg:block border-t border-gold/20 bg-maroon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul className="flex items-center justify-center gap-6 xl:gap-10 py-3.5 flex-wrap">
            {STATIC_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                    location.pathname === link.href ? 'text-gold' : 'text-cream/90 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="relative">
              <button
                type="button"
                onClick={() => setShopOpen(!shopOpen)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] uppercase text-cream/90 hover:text-gold transition-colors"
              >
                Collections <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {shopOpen && (
                <>
                  <button type="button" className="fixed inset-0 z-40" aria-label="Close" onClick={() => setShopOpen(false)} />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-52">
                    <div className="bg-surface border border-border shadow-lg py-2 rounded-md">
                      {activeCollections.map((col) => (
                        <Link
                          key={col.id}
                          to={`/collections/${col.slug}`}
                          onClick={() => setShopOpen(false)}
                          className="block px-4 py-2.5 text-xs text-espresso hover:bg-cream hover:text-tan"
                        >
                          {col.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </li>
            <li>
              <Link
                to="/collections/all?filter=sale"
                className="text-[11px] font-semibold tracking-[0.15em] uppercase text-cream/90 hover:text-gold transition-colors"
              >
                Sale
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gold/20 bg-[#2a0108] px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
          {[...STATIC_NAV, { label: 'Founder', href: '/founder' }].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-3 text-sm font-medium tracking-wide uppercase text-cream hover:text-gold border-b border-gold/10"
            >
              {link.label}
            </Link>
          ))}
          {activeCollections.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              onClick={() => setIsOpen(false)}
              className="block py-2.5 text-sm text-cream/70 hover:text-gold pl-2"
            >
              {col.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
