import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services } from '../../content/siteContent';
import SectionHeader from './SectionHeader';

const TEASER_IDS = ['hand-painting', 'custom-tailoring', 'heirloom-transformation'] as const;

export default function ServicesOverviewSection() {
  const teaserServices = services.filter((s) =>
    TEASER_IDS.includes(s.id as (typeof TEASER_IDS)[number])
  );

  return (
    <section id="our-services" aria-label="Studio services">
      <SectionHeader
        eyebrow="Studio Services"
        title="Beyond the Saree"
        description="Hand painting, tailoring, and heirloom transformations."
        link={{ label: 'All services', href: '/services' }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teaserServices.map((service) => (
          <Link
            key={service.id}
            to={`/services#${service.id}`}
            className="kit-card p-6 group hover:shadow-[var(--shadow-kit-lg)] transition-shadow flex flex-col gap-3"
          >
            <h3 className="font-sans text-base font-bold text-espresso group-hover:text-maroon transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed flex-grow line-clamp-3">{service.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-maroon">
              Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
