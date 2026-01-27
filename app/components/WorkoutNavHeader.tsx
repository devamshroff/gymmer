'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WorkoutNavHeaderProps {
  exitUrl: string;
  previousUrl: string | null;
  onPrevious?: () => void; // Optional callback for internal state changes
  skipUrl?: string; // Optional skip button on right side
  skipLabel?: string;
  onSkip?: () => void;
  // For review mode - show Next instead of Skip
  nextLabel?: string;
  onNext?: () => void;
}

/**
 * Unified navigation header for workout flow
 * Shows exit button and previous button on left, optional skip/next on right
 */
export default function WorkoutNavHeader({
  exitUrl,
  previousUrl,
  onPrevious,
  skipUrl,
  skipLabel = 'Skip',
  onSkip,
  nextLabel = 'Next',
  onNext,
}: WorkoutNavHeaderProps) {
  const router = useRouter();

  const handlePrevious = () => {
    if (onPrevious) {
      // Use callback for internal navigation (within same page)
      onPrevious();
    } else if (previousUrl) {
      // Navigate to previous URL
      router.push(previousUrl);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else if (skipUrl) {
      router.push(skipUrl);
    }
  };

  const canGoPrevious = !!previousUrl || !!onPrevious;
  const showSkip = skipUrl || onSkip;
  const showNext = !!onNext;

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Left side: Exit and Previous */}
      <div className="flex items-center gap-4">
        <Link
          href={exitUrl}
          className="text-red-400 hover:text-red-300 font-medium"
        >
          Exit
        </Link>
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`font-medium ${
            canGoPrevious
              ? 'text-blue-400 hover:text-blue-300'
              : 'text-zinc-600 cursor-not-allowed'
          }`}
        >
          ← Previous
        </button>
      </div>

      {/* Right side: Next (review mode) or Skip */}
      {showNext ? (
        <button
          onClick={onNext}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          {nextLabel} →
        </button>
      ) : showSkip ? (
        <button
          onClick={handleSkip}
          className="text-zinc-400 hover:text-zinc-300"
        >
          {skipLabel} →
        </button>
      ) : null}
    </div>
  );
}
