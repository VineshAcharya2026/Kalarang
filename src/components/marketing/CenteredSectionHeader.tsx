import React from 'react';
import { motion } from 'motion/react';

interface CenteredSectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

export default function CenteredSectionHeader({
  title,
  subtitle,
  eyebrow,
  className = '',
}: CenteredSectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center mb-10 sm:mb-12 ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-[10px] sm:text-xs font-semibold text-tan uppercase tracking-[0.25em] mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-espresso tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-sm text-muted mt-3 max-w-lg mx-auto leading-relaxed tracking-wide">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
