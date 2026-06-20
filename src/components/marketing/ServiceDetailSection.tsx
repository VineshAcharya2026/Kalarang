import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceDetailSectionProps {
  id: string;
  title: string;
  description: string;
  listLabel: string;
  items: string[];
  footnote?: string;
  cta: { label: string; href: string };
  reverse?: boolean;
}

export default function ServiceDetailSection({
  id,
  title,
  description,
  listLabel,
  items,
  footnote,
  cta,
  reverse,
}: ServiceDetailSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start py-8 border-b border-gold/10 last:border-b-0 ${
        reverse ? 'lg:[direction:rtl]' : ''
      }`}
    >
      <div className={`flex flex-col gap-4 ${reverse ? 'lg:[direction:ltr]' : ''}`}>
        <h2 className="font-serif text-2xl font-bold text-espresso uppercase tracking-wide">
          {title}
        </h2>
        <p className="font-serif text-sm sm:text-base text-gray-700 leading-relaxed">
          {description}
        </p>
        {footnote && (
          <p className="font-serif italic text-maroon text-sm font-medium">{footnote}</p>
        )}
        <Link
          to={cta.href}
          className="inline-flex items-center gap-2 w-fit bg-maroon hover:bg-gold text-white px-5 py-2.5 rounded text-xs font-sans tracking-widest font-bold uppercase transition-colors"
        >
          {cta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className={`bg-sand/20 rounded-md p-6 border border-gold/10 ${reverse ? 'lg:[direction:ltr]' : ''}`}>
        <h3 className="font-sans text-xs font-bold text-gold uppercase tracking-wider mb-4">
          {listLabel}
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="font-sans text-sm text-gray-700 flex items-start gap-2 before:content-['•'] before:text-maroon before:font-bold"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
