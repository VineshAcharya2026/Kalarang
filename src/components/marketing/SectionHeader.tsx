import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 ${
        centered ? 'text-center sm:text-center sm:items-center sm:justify-center' : ''
      }`}
    >
      <div className={centered ? 'max-w-xl mx-auto' : ''}>
        {eyebrow && (
          <span className="inline-block text-[11px] font-semibold tracking-wide text-maroon uppercase mb-1">
            {eyebrow}
          </span>
        )}
        <h2 className="font-sans text-2xl sm:text-[1.75rem] font-bold text-espresso tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="font-sans text-sm text-muted mt-2 leading-relaxed">{description}</p>
        )}
      </div>
      {link && !centered && (
        <Link
          to={link.href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-maroon hover:text-gold transition-colors shrink-0"
        >
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
