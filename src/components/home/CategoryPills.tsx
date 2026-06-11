import React from 'react';
import type { Collection } from '../../types';

interface CategoryPillsProps {
  collections: Collection[];
  activeId: string | null;
  onSelect: (collectionId: string | null) => void;
  loading?: boolean;
}

export default function CategoryPills({
  collections,
  activeId,
  onSelect,
  loading,
}: CategoryPillsProps) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 bg-sand/40 rounded-full animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <section id="category-pills" className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="font-serif text-lg sm:text-xl text-espresso font-bold uppercase tracking-wide">
          Browse by Fabric
        </h2>
        <p className="font-sans text-xs text-gray-500">Tap a category to filter the collection below</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 px-5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeId === null
              ? 'bg-maroon text-cream border-maroon shadow-md'
              : 'bg-cream text-espresso border-gold/25 hover:border-gold/50 hover:bg-sand/30'
          }`}
        >
          All Sarees
        </button>
        {collections.map((col) => (
          <button
            key={col.id}
            onClick={() => onSelect(col.id)}
            className={`shrink-0 px-5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeId === col.id
                ? 'bg-maroon text-cream border-maroon shadow-md'
                : 'bg-cream text-espresso border-gold/25 hover:border-gold/50 hover:bg-sand/30'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>
    </section>
  );
}
