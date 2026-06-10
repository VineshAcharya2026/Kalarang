import React from 'react';
import { Clapperboard, X } from 'lucide-react';

interface VideoSpotlightModalProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export default function VideoSpotlightModal({ videoUrl, title, onClose }: VideoSpotlightModalProps) {
  return (
    <div
      id="video-spotlight-modal"
      className="fixed inset-0 z-50 bg-espresso/95 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="relative max-w-4xl w-full bg-black rounded-lg overflow-hidden border border-gold/30 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center bg-espresso border-b border-gold/20 py-3.5 px-5 text-cream">
          <div className="flex items-center gap-2">
            <Clapperboard className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider">
              {title || 'Studio Saree Spotlight'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-1.5 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black relative">
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain focus:outline-none"
          />
        </div>

        <div className="bg-espresso border-t border-gold/20 py-3.5 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-400">
          <p className="italic">
            Exquisite handcrafted drapes in authentic silk and heritage weave.
          </p>
          <button
            onClick={onClose}
            className="bg-maroon hover:bg-gold text-white px-5 py-2 rounded text-[11px] font-sans tracking-widest font-bold uppercase cursor-pointer transition-colors"
          >
            Close Video
          </button>
        </div>
      </div>
    </div>
  );
}
