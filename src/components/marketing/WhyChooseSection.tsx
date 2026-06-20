import React from 'react';
import { whyChoose } from '../../content/siteContent';

export default function WhyChooseSection() {
  return (
    <section id="why-choose" className="bg-sand/30 border border-gold/15 rounded-lg p-8 sm:p-12">
      <h2 className="font-serif text-2xl font-bold uppercase text-espresso tracking-wide mb-10 text-center">
        {whyChoose.title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {whyChoose.pillars.map((pillar) => (
          <div key={pillar.title} className="flex flex-col gap-2 text-center sm:text-left">
            <h3 className="font-serif text-lg font-bold text-espresso uppercase tracking-wide">
              {pillar.title}
            </h3>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
