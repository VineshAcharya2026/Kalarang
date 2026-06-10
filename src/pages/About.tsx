import React from 'react';
import { Mail, Phone, MapPin, Sparkles, Heart, ShieldAlert, Award } from 'lucide-react';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';

export default function About() {
  return (
    <div id="about-story-page" className="min-h-screen flex flex-col bg-[#FDF8F2]">
      <AnnouncementBar />
      <Navbar />

      {/* Main page content container */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex-grow">
        
        {/* Story Greeting Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <span className="font-sans text-xs tracking-[0.3em] text-[#B8860B] uppercase font-bold">
            Heritage & Devotion
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1C1008] uppercase tracking-normal leading-tight font-medium">
            KALARANG Story
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#7A1C2E] mt-1">
            "Where Tradition Weaves Its Story"
          </p>
          <div className="h-0.5 w-16 bg-[#B8860B] mx-auto mt-2" />
        </div>

        {/* Visual Content Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="aspect-[4/3] bg-[#E8D5B0]/30 rounded-md overflow-hidden border border-[#B8860B]/10 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
              alt="Indian Silk Weaving"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 justify-center font-serif text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl font-bold uppercase text-[#1C1008] tracking-wide">
              The Loom and the Soul
            </h2>
            <p>
              At KALARANG — Silks & Studio, we believe a saree is more than six yards of fabric; it is a canvas where centuries of Indian traditional loom art, devotion, and weaver family stories come to life.
            </p>
            <p>
              Every thread is spun to convey elegance, warmth, and luxury. We work in direct partnership with handloom weavers across India—from the ancient lanes of Varanasi to the artisanal clusters of Chanderi—bringing you authentic designs that stand the test of time.
            </p>
            <p className="border-l-4 border-[#B8860B] pl-4 italic text-[#7A1C2E] font-medium py-1">
              "We preserve traditional craftsmanship so you can carry a piece of heritage wherever you walk."
            </p>
          </div>
        </div>

        {/* Quality Pillars Grid */}
        <section className="bg-[#E8D5B0]/40 border-2 border-[#B8860B]/15 rounded-lg p-8 sm:p-12 mb-20 text-center">
          <h2 className="font-serif text-2xl font-bold uppercase text-[#1C1008] tracking-wide mb-10">
            Our Quality Standards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-[#7A1C2E]/10 rounded-full text-[#7A1C2E]">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1008] uppercase tracking-wide">
                100% Genuine Silk
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xs">
                We strictly source authentic, certified silk varieties. From lustrous Russian Katan to Banana silk and crepe, quality is guaranteed.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-[#B8860B]/10 rounded-full text-[#B8860B]">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1008] uppercase tracking-wide">
                Handcrafted Zari
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xs">
                Our brocades and borders feature stunning, traditional thread motifs woven on traditional looms.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-[#1C1008]/15 rounded-full text-[#1C1008]">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1008] uppercase tracking-wide">
                Fair Trade Weavers
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xs">
                By purchasing from KALARANG, you directly support Indian textile artisan communities, helping preserve handloom traditions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact/Query Section */}
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-5 bg-white p-8 rounded-md border border-[#B8860B]/10 shadow-sm font-sans text-xs sm:text-sm">
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-[#1C1008] tracking-wide">
            Visit Our Studio Lobby
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Have questions about custom silk borders, specific textures, or color options? Ping us directly! Our designers love talking to customers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Phone className="h-4.5 w-4.5 text-[#B8860B]" />
              <span>WhatsApp: +91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-[#B8860B]" />
              <span>Email: studio@kalarang.com</span>
            </div>
          </div>
        </div>

      </div>

      <WhatsAppFAB />
      <Footer />
    </div>
  );
}
