import React from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
      {eyebrow && (
        <span className="font-sans text-xs tracking-[0.3em] text-gold uppercase font-bold">
          {eyebrow}
        </span>
      )}
      <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-espresso uppercase tracking-normal leading-tight font-medium">
        {title}
      </h1>
      {subtitle && (
        <p className="font-serif italic text-base sm:text-lg text-maroon mt-1">{subtitle}</p>
      )}
      <div className="h-0.5 w-16 bg-gold mx-auto mt-2" />
    </div>
  );
}
