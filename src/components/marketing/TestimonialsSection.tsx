import React from 'react';
import { Star, User } from 'lucide-react';
import { testimonials } from '../../content/siteContent';
import CenteredSectionHeader from './CenteredSectionHeader';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-14 sm:py-20 bg-surface border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CenteredSectionHeader title="Happy Customers" subtitle="Loved by our community" />

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {testimonials.quotes.map((quote, index) => (
            <blockquote
              key={index}
              className="shrink-0 w-[280px] sm:w-[300px] snap-start bg-cream border border-border/80 p-5 sm:p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sand flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-muted" />
                </div>
                <div className="flex gap-0.5 text-tan">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-tan text-tan" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed flex-grow">&ldquo;{quote}&rdquo;</p>
              <footer className="text-xs font-semibold text-espresso uppercase tracking-wide">
                Happy Customer
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
