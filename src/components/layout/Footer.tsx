import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Mail, Phone } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useCollections } from '../../hooks/useCollections';
import { brand, contact } from '../../content/siteContent';
import { formatWhatsAppDisplay, normalizeWhatsAppNumber } from '../../constants/contact';

export default function Footer() {
  const { settings } = useSettings();
  const { collections } = useCollections();
  const activeCollections = collections.filter((c) => c.isActive).slice(0, 6);
  const year = new Date().getFullYear();
  const email = settings?.email || contact.email;
  const address = settings?.studioAddress || contact.address;
  const whatsappNumber = normalizeWhatsAppNumber(settings?.whatsappNumber);
  const whatsappDisplay = formatWhatsAppDisplay(settings?.whatsappNumber);

  return (
    <footer id="footer-section" className="bg-espresso text-cream/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link to="/" className="inline-flex mb-4 group" aria-label="Kalarang Silks and Studio — Home">
              <img
                src="/kalarang.png"
                alt="Kalarang Silks & Studio"
                className="h-20 sm:h-24 w-auto max-w-[280px] object-contain object-left drop-shadow-md group-hover:opacity-95 transition-opacity"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {brand.tagline}. Curated sarees, hand-painted artistry, and custom tailoring.
            </p>
          </div>

          {/* Shop */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/collections/all" className="hover:text-white transition-colors">
                  All Sarees
                </Link>
              </li>
              {activeCollections.map((col) => (
                <li key={col.id}>
                  <Link to={`/collections/${col.slug}`} className="hover:text-white transition-colors">
                    {col.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Studio Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Our story & policies */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Our Story</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Kalarang</Link></li>
              <li><Link to="/founder" className="hover:text-white transition-colors">Meet Founder</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Contact & follow */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm mb-5">
              <li className="flex items-start justify-center sm:justify-start gap-2">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              {address ? (
                <li className="flex items-start justify-center sm:justify-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
                  <span className="whitespace-pre-line text-left">{address}</span>
                </li>
              ) : null}
            </ul>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-wider border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-cream/40">
          <p>&copy; {year} {settings?.storeName || brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
