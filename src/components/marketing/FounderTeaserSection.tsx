import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { founder } from '../../content/siteContent';

export default function FounderTeaserSection() {
  return (
    <section id="founder-teaser" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="aspect-[4/3] bg-sand/30 rounded-md overflow-hidden border border-gold/10 shadow-lg">
        <img
          src={founder.imageUrl}
          alt={founder.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-sans text-xs tracking-[0.3em] text-gold uppercase font-bold">
          {founder.eyebrow}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso uppercase">
          {founder.name}
        </h2>
        <p className="font-sans text-sm text-maroon font-semibold">{founder.title}</p>
        <p className="font-serif text-sm sm:text-base text-gray-600 leading-relaxed">
          {founder.teaser}
        </p>
        <blockquote className="border-l-4 border-gold pl-4 italic text-maroon font-medium text-sm">
          &ldquo;{founder.vision}&rdquo;
        </blockquote>
        <Link
          to="/founder"
          className="inline-flex items-center gap-1 w-fit text-xs font-bold text-maroon hover:text-gold uppercase tracking-wider transition-colors"
        >
          Read Her Story <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
