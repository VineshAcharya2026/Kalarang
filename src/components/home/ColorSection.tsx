import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { COLOR_FAMILIES } from '../../constants/colors';
import CenteredSectionHeader from '../marketing/CenteredSectionHeader';
import HomeSection from './HomeSection';

const ease = [0.22, 1, 0.36, 1] as const;

export default function ColorSection() {
  return (
    <section id="shop-by-colour" aria-label="Shop by colour">
      <HomeSection>
        <CenteredSectionHeader
          title="Shop by Colour"
          subtitle="Browse by our main colours — ask us for the exact shade when you enquire."
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5">
          {COLOR_FAMILIES.map((family, index) => (
            <motion.div
              key={family.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45, delay: index * 0.06, ease }}
              className="flex flex-col items-center text-center gap-3"
            >
              <Link
                to={`/collections/all?color=${encodeURIComponent(family.name)}`}
                className="flex flex-col items-center gap-3 group"
                aria-label={`Shop ${family.name}`}
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-gold/30 shadow-sm group-hover:border-maroon transition-colors"
                  style={{ backgroundColor: family.swatch }}
                  aria-hidden
                />
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-espresso group-hover:text-maroon transition-colors">
                  {family.name}
                </p>
              </Link>
              <div className="flex flex-wrap justify-center gap-1.5">
                {family.shades
                  .filter((shade) => shade !== family.name)
                  .map((shade) => (
                    <Link
                      key={shade}
                      to={`/collections/all?color=${encodeURIComponent(shade)}`}
                      className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border border-gold/20 bg-cream text-espresso hover:bg-maroon hover:text-white hover:border-transparent transition-colors"
                    >
                      {shade}
                    </Link>
                  ))}
              </div>
            </motion.div>
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
            Browse all colours <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </HomeSection>
    </section>
  );
}
