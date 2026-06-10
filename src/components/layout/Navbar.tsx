import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useCollections } from '../../hooks/useCollections';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { collections } = useCollections();
  const { itemCount } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const activeCollections = collections.filter(c => c.isActive);

  return (
    <nav id="main-navbar" className="sticky top-0 z-40 bg-[#FDF8F2] border-b border-[#B8860B]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Brand Signature */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-start leading-none group">
              <span id="brand-title" className="font-serif text-2xl font-bold tracking-[0.15em] text-[#1C1008] group-hover:text-[#7A1C2E] transition-colors duration-300">
                KALARANG
              </span>
              <span id="brand-tagline" className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] text-[#B8860B] uppercase font-semibold mt-0.5">
                Silks & Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="font-sans text-sm font-medium text-[#1C1008] hover:text-[#7A1C2E] transition-colors">
              Home
            </Link>
            
            {/* Dynamic Saree Collection Dropdown */}
            <div className="relative group text-[#1C1008]">
              <button className="font-sans text-sm font-medium hover:text-[#7A1C2E] flex items-center gap-1 py-4 focus:outline-none">
                Sarees & Collections
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-[#FDF8F2] border border-[#B8860B]/10 rounded-md shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {activeCollections.length === 0 ? (
                  <div className="px-4 py-2 text-xs font-sans text-gray-400">Loading Categories...</div>
                ) : (
                  activeCollections.map((col) => (
                    <Link
                      key={col.id}
                      to={`/collections/${col.slug}`}
                      className="block px-4 py-2.5 text-xs sm:text-sm font-sans text-[#1C1008] hover:bg-[#E8D5B0] hover:text-[#7A1C2E] transition-colors"
                    >
                      {col.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link to="/about" className="font-sans text-sm font-medium text-[#1C1008] hover:text-[#7A1C2E] transition-colors">
              About Story
            </Link>
          </div>

          {/* Icons Action Area */}
          <div className="flex items-center space-x-4">
            {/* Admin Switcher */}
            <Link 
              to={user ? '/admin' : '/admin/login'} 
              className="text-[#1C1008] hover:text-[#B8860B] p-2 rounded-full transition-colors relative"
              title="Admin Panel"
            >
              <User className="h-5 w-5" />
              {user && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#FDF8F2]"></span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <Link 
              to="/cart" 
              className="text-[#1C1008] hover:text-[#7A1C2E] p-2 rounded-full transition-colors relative"
              title="Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7A1C2E] text-[#FDF8F2] font-semibold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#1C1008] hover:text-[#7A1C2E] p-2 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FDF8F2] border-t border-[#B8860B]/10 py-3 space-y-1">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-base font-sans font-medium text-[#1C1008] hover:bg-[#E8D5B0] hover:text-[#7A1C2E]"
          >
            Home
          </Link>

          <div className="px-4 py-1 text-xs font-sans tracking-widest text-[#B8860B] font-semibold uppercase mt-2">
            Browse Categories
          </div>
          {activeCollections.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              onClick={() => setIsOpen(false)}
              className="block pl-8 pr-4 py-2 text-sm font-sans text-gray-700 hover:bg-[#E8D5B0] hover:text-[#7A1C2E]"
            >
              {col.name}
            </Link>
          ))}

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-base font-sans font-medium text-[#1C1008] hover:bg-[#E8D5B0] hover:text-[#7A1C2E] border-t border-[#B8860B]/5 mt-2"
          >
            About Story
          </Link>
        </div>
      )}
    </nav>
  );
}
