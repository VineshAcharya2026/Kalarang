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
          <div key={i} className="h-9 w-20 rounded-full bg-cream animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  const pill = (active: boolean) =>
    `shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
      active
        ? 'bg-maroon text-white shadow-sm'
        : 'bg-surface border border-border text-muted hover:border-maroon/30 hover:text-maroon'
    }`;

  return (
    <div id="category-pills" className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button type="button" onClick={() => onSelect(null)} className={pill(activeId === null)}>
        All
      </button>
      {collections.map((col) => (
        <button key={col.id} type="button" onClick={() => onSelect(col.id)} className={pill(activeId === col.id)}>
          {col.name}
        </button>
      ))}
    </div>
  );
}
