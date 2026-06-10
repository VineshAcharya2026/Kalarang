import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer id="footer-section" className="bg-[#1C1008] text-[#FDF8F2]/80 font-sans border-t-2 border-[#B8860B] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Brand Mission */}
          <div className="md:col-span-2">
            <Link to="/" className="flex flex-col items-start leading-none mb-4">
              <span className="font-serif text-2xl font-bold tracking-[0.15em] text-[#FDF8F2]">
                KALARANG
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] text-[#B8860B] uppercase font-semibold mt-0.5">
                Silks & Studio
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm mt-2 font-serif italic text-[#E8D5B0]">
              "Where Tradition Weaves Its Story"
            </p>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Bringing you premium sarees meticulously sourced of genuine Indian heritage. FromBanana Silk and Russian Katan Silk to traditional Banarasi heirloom products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#B8860B] tracking-wider uppercase mb-4">
              Explore Studio
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-[#E8D5B0] transition-colors">Premium Collection</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E8D5B0] transition-colors">Our Weaver Story</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#E8D5B0] transition-colors">Review Shopping Cart</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#E8D5B0] transition-colors flex items-center gap-1">
                  Admin Entrance <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-[#B8860B] tracking-wider uppercase mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#B8860B] shrink-0 mt-0.5" />
                <span>whatsapp: +{settings?.whatsappNumber}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#B8860B] shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  KALARANG Studio, Silk Bazaar, Bangalore, India
                </span>
              </li>
              <li className="flex items-start gap-3 mt-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-[#B8860B]/10 hover:bg-[#B8860B]/20 p-2 rounded-full transition-colors text-[#B8860B]"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright barrier */}
        <div className="border-t border-[#B8860B]/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {settings?.storeName}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 italic">
            Proudly Handloomed Traditional Heritage
          </p>
        </div>
      </div>
    </footer>
  );
}
