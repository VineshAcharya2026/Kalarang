import React from 'react';

type HomeSectionVariant = 'default' | 'sand' | 'surface';

interface HomeSectionProps {
  id?: string;
  variant?: HomeSectionVariant;
  className?: string;
  children: React.ReactNode;
  compact?: boolean;
}

const variantClasses: Record<HomeSectionVariant, string> = {
  default: 'bg-cream',
  sand: 'bg-sand',
  surface: 'bg-surface',
};

export default function HomeSection({
  id,
  variant = 'default',
  className = '',
  children,
  compact = false,
}: HomeSectionProps) {
  return (
    <div id={id} className={`${variantClasses[variant]} ${className}`}>
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${
          compact ? 'py-10 lg:py-12' : 'py-12 lg:py-16'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
