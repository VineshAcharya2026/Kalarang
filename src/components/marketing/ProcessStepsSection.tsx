import React from 'react';
import { process } from '../../content/siteContent';

export default function ProcessStepsSection() {
  return (
    <section id="our-process" className="flex flex-col gap-10">
      <div className="text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso uppercase">
          {process.title}
        </h2>
        <div className="h-0.5 w-16 bg-gold mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {process.steps.map((step) => (
          <div
            key={step.step}
            className="flex flex-col items-center text-center gap-3 p-4 rounded-md border border-gold/10 bg-white"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-maroon text-cream font-serif font-bold text-lg">
              {step.step}
            </span>
            <h3 className="font-serif text-base font-bold text-espresso uppercase tracking-wide">
              {step.title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
