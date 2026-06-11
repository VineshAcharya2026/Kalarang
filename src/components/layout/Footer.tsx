import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ExternalLink, Mail } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useCollections } from '../../hooks/useCollections';

export default function Footer() {
  const { settings } = useSettings();
  const { collections } = useCollections();
  const [email, setEmail] = useState('');

  const activeCollections = collections.filter((c) => c.isActive).slice(0, 6);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer id="footer-section" className="bg-espresso text-cream/80 font-sans border-t-2 border-gold mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex flex-col items-start leading-none mb-4">
              <span className="font-serif text-2xl font-bold tracking-[0.15em] text-cream">
                KALARANG
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold mt-0.5">
                Silks & Studio
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-sand/80 font-serif italic">
              "Where Tradition Weaves Its Story"
            </p>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Bringing you premium sarees meticulously sourced from genuine Indian heritage.
              From Banana Silk and Russian Katan Silk to traditional Banarasi heirloom products.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/collections/all" className="hover:text-sand transition-colors">
                  All Sarees
                </Link>
              </li>
              {activeCollections.map((col) => (
                <li key={col.id}>
                  <Link
                    to={`/collections/${col.slug}`}
                    className="hover:text-sand transition-colors"
                  >
                    {col.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/about" className="hover:text-sand transition-colors">
                  Our Weaver Story
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/cart" className="hover:text-sand transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-sand transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-sand transition-colors flex items-center gap-1">
                  Admin <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm mb-5">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>WhatsApp: +{settings?.whatsappNumber}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  KALARANG Studio, Silk Bazaar, Bangalore, India
                </span>
              </li>
            </ul>

            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-wider text-gold font-semibold flex items-center gap-1">
                <Mail className="h-3 w-3" /> Newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-xs rounded bg-espresso border border-gold/20 text-cream placeholder:text-gray-500 focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-maroon hover:bg-gold text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {settings?.storeName || 'KALARANG'}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 italic">
            Proudly Handloomed Traditional Heritage
          </p>
        </div>
      </div>
    </footer>
  );
}
