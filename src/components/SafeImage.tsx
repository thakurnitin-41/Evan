import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

/**
 * Normalizes image URLs for Vercel/Vite production build compatibility.
 * Replaces hardcoded '/src/assets/images/' paths with '/images/' static route.
 */
export function normalizeImagePath(path: string | undefined): string {
  if (!path) return '/images/elan_hero_wedding_1793474322640.jpg';
  if (path.startsWith('/src/assets/images/')) {
    return path.replace('/src/assets/images/', '/images/');
  }
  return path;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = normalizeImagePath(src);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#29252A] via-[#211721] to-[#1A131A] text-[#D8BC91] border border-[#3B333B] overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#D8BC91_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-xl bg-[#29252A]/90 border border-[#D8BC91]/30 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-[#D8BC91]" />
          </div>
          <p className="text-xs font-serif tracking-wide text-[#F4EEE5] max-w-[200px]">
            {fallbackTitle || alt || 'Atmospheric Event Visual'}
          </p>
          <span className="text-[10px] font-mono text-[#A7B49A] uppercase tracking-wider">
            EVAN. AI Studio Visual
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={normalizedSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
