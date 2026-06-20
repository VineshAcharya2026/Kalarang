import React from 'react';
import { Play, ShoppingBag } from 'lucide-react';
import type { HeroVideo } from '../../types';
import CenteredSectionHeader from '../marketing/CenteredSectionHeader';

interface VideoReelsSectionProps {
  videos: HeroVideo[];
  onPlayVideo: (url: string, title: string) => void;
}

export default function VideoReelsSection({ videos, onPlayVideo }: VideoReelsSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section id="studio-video-reels" aria-label="Shoppable reels" className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CenteredSectionHeader
          title="Shoppable reels"
          subtitle="Watch, choose, shop your favorites"
        />

        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory justify-center">
          {videos.map((vid) => (
            <button
              key={vid.id}
              type="button"
              onClick={() => onPlayVideo(vid.videoUrl, vid.title)}
              className="group relative shrink-0 w-[160px] sm:w-[180px] aspect-[9/16] overflow-hidden bg-espresso snap-start cursor-pointer"
            >
              <video
                src={vid.videoUrl}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                preload="metadata"
                muted
              />
              <div className="absolute inset-0 bg-espresso/20 group-hover:bg-espresso/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Play className="h-4 w-4 text-espresso fill-espresso ml-0.5" />
                </div>
              </div>
              <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/95 flex items-center justify-center shadow-sm">
                <ShoppingBag className="h-3.5 w-3.5 text-espresso" />
              </div>
              {vid.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-espresso/80 to-transparent">
                  <span className="text-[10px] font-semibold text-white line-clamp-2">{vid.title}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
