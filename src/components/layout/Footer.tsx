import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useCollections } from '../../hooks/useCollections';
import { brand } from '../../content/siteContent';

export default function Footer() {
  const { settings } = useSettings();
  const { collections } = useCollections();
  const activeCollections = collections.filter((c) => c.isActive).slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <footer id="footer-section" className="bg-espresso text-cream/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {/* Shop */}
          <div>
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
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Our Story</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Kalarang</Link></li>
              <li><Link to="/founder" className="hover:text-white transition-colors">Meet Founder</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Follow us</h4>
            <p className="text-sm leading-relaxed mb-5">
              Follow {brand.name} on social media for new arrivals, studio updates, and styling inspiration.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              {settings?.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-wider border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  WhatsApp
                </a>
              )}
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
