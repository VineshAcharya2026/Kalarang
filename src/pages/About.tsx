import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Sparkles, Heart, Palette } from 'lucide-react';
import MarketingPageShell from '../components/marketing/MarketingPageShell';
import PageHero from '../components/marketing/PageHero';
import { about, aboutValues, contact } from '../content/siteContent';
import { useSettings } from '../hooks/useSettings';
import { formatWhatsAppDisplay } from '../constants/contact';

const valueIcons = [Sparkles, Heart, Palette];

export default function About() {
  const { settings } = useSettings();

  return (
    <MarketingPageShell id="about-story-page">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <PageHero eyebrow={about.eyebrow} title={about.title} subtitle={about.intro} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="aspect-[4/3] bg-sand/30 rounded-md overflow-hidden border border-gold/10 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
              alt="KalaRang creative studio"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 justify-center font-serif text-gray-700 leading-relaxed text-sm sm:text-base">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <section className="bg-sand/30 border border-gold/15 rounded-lg p-8 sm:p-12 mb-20 text-center">
          <h2 className="font-serif text-2xl font-bold uppercase text-espresso tracking-wide mb-10">
            {aboutValues.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutValues.items.map((item, index) => {
              const Icon = valueIcons[index] ?? Sparkles;
              return (
                <div key={item.title} className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-maroon/10 rounded-full text-maroon">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-espresso uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xs">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="max-w-2xl mx-auto text-center flex flex-col gap-5 bg-white p-8 rounded-md border border-gold/10 shadow-sm font-sans text-xs sm:text-sm mb-10">
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-espresso tracking-wide">
            Visit Our Studio
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Have questions about custom designs, fabric options, or our services? We would love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Phone className="h-4.5 w-4.5 text-gold" />
              <span>WhatsApp: {formatWhatsAppDisplay(settings?.whatsappNumber)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-gold" />
              <span>Email: {settings?.email || contact.email}</span>
            </div>
            {(settings?.studioAddress || contact.address) ? (
              <div className="flex items-start gap-2 max-w-md text-left">
                <MapPin className="h-4.5 w-4.5 text-gold shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{settings?.studioAddress || contact.address}</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-maroon hover:bg-gold text-white px-5 py-2.5 rounded text-xs font-sans tracking-widest font-bold uppercase transition-colors"
            >
              Our Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-maroon text-maroon hover:bg-maroon hover:text-white px-5 py-2.5 rounded text-xs font-sans tracking-widest font-bold uppercase transition-colors"
            >
              Book a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
