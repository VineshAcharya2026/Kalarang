import React from 'react';
import MarketingPageShell from '../components/marketing/MarketingPageShell';
import PageHero from '../components/marketing/PageHero';
import ServiceDetailSection from '../components/marketing/ServiceDetailSection';
import CTASection from '../components/marketing/CTASection';
import { services } from '../content/siteContent';

export default function ServicesPage() {
  return (
    <MarketingPageShell id="services-page">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <PageHero title="Our Services" subtitle="From curated sarees to custom creations" />

        <div className="flex flex-col">
          {services.map((service, index) => (
            <ServiceDetailSection
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              listLabel={service.listLabel}
              items={service.items}
              footnote={service.footnote}
              cta={service.cta}
              reverse={index % 2 === 1}
            />
          ))}
        </div>

        <div className="mt-16">
          <CTASection />
        </div>
      </div>
    </MarketingPageShell>
  );
}
