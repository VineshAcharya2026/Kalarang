import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { Collection } from '../../types';
import CenteredSectionHeader from '../marketing/CenteredSectionHeader';
import HomeSection from './HomeSection';

interface CollectionTilesSectionProps {
  collections: Collection[];
  loading?: boolean;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

const ease = [0.22, 1, 0.36, 1] as const;

function CollectionTile({
  col,
  index,
}: {
  col: Pick<Collection, 'id' | 'slug' | 'name' | 'coverImage'>;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      className="w-full"
    >
      <Link to={`/collections/${col.slug}`} className="group block text-center">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35, ease }}
          className="relative aspect-[3/4] home-card mb-4 group-hover:shadow-[var(--shadow-soft-hover)]"
        >
          <img
            src={col.coverImage || FALLBACK_IMAGE}
            alt={col.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white uppercase tracking-wider">
              Shop <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </motion.div>
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-espresso group-hover:text-tan transition-colors duration-300">
          {col.name}
        </p>
      </Link>
    </motion.div>
  );
}

export default function CollectionTilesSection({
  collections,
  loading,
}: CollectionTilesSectionProps) {
  const tiles = collections;

  return (
    <section id="shop-collections" aria-label="Explore collections">
      <HomeSection>
      <CenteredSectionHeader
        title="Explore our collections"
        subtitle="Shop curated sarees, dresses, and blouses by fabric, occasion, and style."
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-sand/80 rounded-[var(--radius-home)] animate-pulse shadow-[var(--shadow-soft)]"
            />
          ))}
        </div>
      ) : tiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/collections/all" className="inline-block group">
            <div className="w-64 sm:w-72 aspect-[3/4] mx-auto home-card group-hover:shadow-[var(--shadow-soft-hover)] transition-shadow duration-500">
              <img
                src={FALLBACK_IMAGE}
                alt="All sarees"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <p className="mt-5 text-sm font-semibold tracking-wide uppercase text-espresso group-hover:text-tan transition-colors duration-300">
              Shop All Sarees
            </p>
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 sm:gap-6">
            {tiles.map((col, index) => (
              <CollectionTile key={col.id} col={col} index={index} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-espresso hover:text-tan border-b border-transparent hover:border-tan pb-0.5 transition-all duration-300"
            >
              View all collections <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </>
      )}
      </HomeSection>
    </section>
  );
}
