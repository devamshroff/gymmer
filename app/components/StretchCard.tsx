'use client';

import Timer from './Timer';

export interface StretchData {
  name: string;
  duration: string;
  timerSeconds?: number;
  tips: string;
  videoUrl: string;
}

interface StretchCardProps {
  stretch: StretchData;
  /** Unique key for timer reset when stretch changes */
  timerKey?: number;
  /** Border color variant */
  variant?: 'pre' | 'post';
}

/**
 * Reusable stretch card component for displaying stretch information.
 * Used in both pre-workout and post-workout stretch pages.
 */
export default function StretchCard({
  stretch,
  timerKey = 0,
  variant = 'pre',
}: StretchCardProps) {
  const borderColor = variant === 'pre' ? 'border-green-600' : 'border-blue-600';
  const emoji = variant === 'pre' ? '🏃' : '🧘';

  return (
    <div className={`bg-zinc-800 rounded-lg p-8 border-2 ${borderColor} mb-8`}>
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold text-white mb-4">{stretch.name}</h2>
        <div className="text-xl text-blue-400 font-semibold mb-4">{stretch.duration}</div>
      </div>

      {/* Timer - only shows if stretch has a timer value */}
      <Timer key={timerKey} timerSeconds={stretch.timerSeconds || 0} />

      <div className="bg-zinc-900 rounded-lg p-4 mb-6">
        <div className="text-zinc-400 text-sm mb-2">Tips:</div>
        <p className="text-zinc-200 text-lg leading-relaxed">{stretch.tips}</p>
      </div>

      <a
        href={stretch.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg text-lg font-semibold transition-colors"
      >
        📺 Watch Video
      </a>
    </div>
  );
}
