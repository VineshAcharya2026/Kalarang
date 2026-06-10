import React from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '../../types';

interface CategoriesSectionProps {
  collections: Collection[];
  loading: boolean;
}

export default function CategoriesSection({ collections, loading }: CategoriesSectionProps) {
  return (
    <section id="collections-slide">
      <div className="flex flex-col mb-8 text-center sm:text-left">
        <h2 className="font-serif text-2xl sm:text-3xl text-espresso font-bold tracking-wide uppercase">
          Shop by Collection
        </h2>
        <div className="h-0.5 w-24 bg-gold mt-2 mx-auto sm:mx-0" />
        <p className="font-sans text-xs sm:text-sm text-gray-500 mt-2">
          Browse our luxurious sarees divided by their authentic handloom fabric types.
        </p>
      </div>

      {loading ? (
        <div className="py-4 text-center w-full text-xs text-gray-400">Loading fine collections...</div>
      ) : collections.length === 0 ? (
        <div className="py-4 text-center w-full text-xs text-gray-400">
          No collections configured yet in dashboard.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {collections.map((col) => (
            <Link key={col.id} to={`/collections/${col.slug}`} className="group">
              <div className="relative aspect-square rounded-md overflow-hidden bg-sand/30 border border-gold/10">
                <img
                  src={
                    col.coverImage ||
                    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={col.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-espresso/40 flex items-end p-3.5" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider group-hover:text-sand transition-colors">
                    {col.name}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
