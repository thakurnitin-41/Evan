import React, { useState } from 'react';
import { Event } from '../types/event';
import { Palette, Copy, Check, Sparkles, Image, Flame, Flower2, Utensils, ArrowLeft } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface MoodboardStudioProps {
  event: Event;
  onNavigateTab?: (tab: string) => void;
}

export const MoodboardStudio: React.FC<MoodboardStudioProps> = ({ event, onNavigateTab }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-8 text-[#F4EEE5]">
      {onNavigateTab && (
        <button
          onClick={() => onNavigateTab('overview')}
          className="inline-flex items-center gap-1.5 text-xs text-[#D8BC91] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>
      )}
      
      {/* 1. HEADER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#29252A] border border-[#3B333B] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#A7B49A] font-medium">
            Visual & Aesthetic Direction
          </div>
          <h1 className="text-3xl font-serif text-[#F4EEE5] mt-1">Moodboard Studio</h1>
          <p className="text-xs text-gray-400 mt-1">
            Curated color palettes, decor directions, floral arrangements, and tablescape concepts for {event.title}.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-[#D8BC91]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored to {event.styleVibe}</span>
        </div>
      </div>

      {/* 2. PRIMARY MOODBOARD IMAGE */}
      <div className="relative rounded-2xl overflow-hidden border border-[#3B333B] bg-[#29252A] group">
        <div className="relative h-80 sm:h-[400px] w-full overflow-hidden">
          <SafeImage
            src={event.concept.moodboardImage}
            alt={event.concept.title}
            fallbackTitle={event.concept.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211721] via-transparent to-transparent opacity-90" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-2">
          <span className="text-xs font-mono text-[#D8BC91] uppercase tracking-wider">
            Atmospheric Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white">{event.concept.headline}</h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-3xl">
            {event.concept.description}
          </p>
        </div>
      </div>

      {/* 3. COLOR PALETTE CHIPS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#29252A] border border-[#3B333B] space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#D8BC91]" />
          <h2 className="text-xl font-serif text-[#F4EEE5]">Curated Color Palette</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {(event.concept.colorPalette || []).map((color, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyHex(color.hex)}
              className="p-4 rounded-xl bg-[#211721] border border-[#3B333B] hover:border-[#D8BC91] transition-all cursor-pointer group space-y-3"
            >
              {/* Color Swatch Box */}
              <div
                className="w-full h-20 rounded-lg shadow-inner border border-white/10 flex items-end justify-end p-2 transition-transform group-hover:scale-95"
                style={{ backgroundColor: color.hex }}
              >
                <div className="p-1 rounded bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedHex === color.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-white group-hover:text-[#D8BC91] transition-colors">
                  {color.name}
                </div>
                <div className="text-[11px] font-mono text-gray-400">{color.hex}</div>
                <div className="text-[10px] text-[#A7B49A] mt-1">{color.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DECOR & ATMOSPHERE DIRECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(event.concept.decorDirections || []).map((dir, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8BC91]/10 flex items-center justify-center text-[#D8BC91]">
              {dir.category.toLowerCase().includes('lighting') ? (
                <Flame className="w-5 h-5" />
              ) : dir.category.toLowerCase().includes('floral') ? (
                <Flower2 className="w-5 h-5" />
              ) : (
                <Utensils className="w-5 h-5" />
              )}
            </div>

            <div className="text-xs font-mono text-[#A7B49A] uppercase tracking-wider">
              {dir.category}
            </div>

            <h3 className="text-lg font-serif text-[#F4EEE5]">{dir.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{dir.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
