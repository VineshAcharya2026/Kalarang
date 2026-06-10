import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AboutTeaser() {
  return (
    <section id="about-teaser" className="text-center max-w-3xl mx-auto">
      <span className="font-sans text-xs tracking-[0.3em] text-gold uppercase font-bold">
        Heritage & Devotion
      </span>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso uppercase mt-2">
        Where Tradition Weaves Its Story
      </h2>
      <div className="h-0.5 w-16 bg-gold mx-auto mt-2" />
      <p className="font-serif text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
        At KALARANG — Silks & Studio, every saree is more than six yards of fabric; it is a
        canvas where centuries of Indian traditional loom art, devotion, and weaver family stories
        come to life.
      </p>
      <Link
        to="/about"
        className="inline-flex items-center gap-1 mt-5 text-xs font-bold text-maroon hover:text-gold uppercase tracking-wider transition-colors"
      >
        Our Story <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
