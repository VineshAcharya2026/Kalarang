import React from 'react';
import { motion } from 'motion/react';
import { Clapperboard, Play } from 'lucide-react';
import type { HeroVideo } from '../../types';

interface VideoReelsSectionProps {
  videos: HeroVideo[];
  onPlayVideo: (url: string, title: string) => void;
}

export default function VideoReelsSection({ videos, onPlayVideo }: VideoReelsSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section id="studio-video-reels">
      <div className="flex flex-col mb-8 text-center sm:text-left">
        <h2 className="font-serif text-2xl sm:text-3xl text-espresso font-bold tracking-wide uppercase flex items-center justify-center sm:justify-start gap-2">
          <Clapperboard className="h-6 w-6 text-gold" /> Studio Video Reels
        </h2>
        <div className="h-0.5 w-24 bg-gold mt-2 mx-auto sm:mx-0" />
        <p className="font-sans text-xs sm:text-sm text-gray-500 mt-2">
          Watch our weavers at work and explore the artistry behind every drape.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((vid, index) => (
          <motion.button
            key={vid.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={() => onPlayVideo(vid.videoUrl, vid.title)}
            className={`text-left flex flex-col rounded-lg overflow-hidden border cursor-pointer transition-all group ${
              vid.isActive
                ? 'border-maroon/40 bg-maroon/5 hover:bg-maroon/10'
                : 'border-gold/15 bg-white hover:border-gold/30'
            }`}
          >
            <div className="relative aspect-video bg-black/40 overflow-hidden">
              <video
                src={vid.videoUrl}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                preload="metadata"
                muted
              />
              <div className="absolute inset-0 bg-espresso/20 flex items-center justify-center group-hover:bg-espresso/10 transition-colors">
                <div className="bg-espresso/70 rounded-full p-3 border border-gold/30">
                  <Play className="h-5 w-5 text-sand fill-sand" />
                </div>
              </div>
              {vid.isActive && (
                <span className="absolute top-2 right-2 text-[9px] font-mono bg-maroon text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">
                  Live
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-1">
              <span className="text-sm font-bold text-espresso truncate">{vid.title}</span>
              {vid.subtitle && (
                <span className="text-xs text-gray-500 truncate">{vid.subtitle}</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
