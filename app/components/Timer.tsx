'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  duration: string; // e.g., "30 sec", "45 sec each side", "60 seconds"
  onComplete?: () => void;
}

function parseDuration(duration: string): number {
  // Extract the first number from the duration string
  const match = duration.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 30; // Default to 30 seconds
}

export default function Timer({ duration, onComplete }: TimerProps) {
  const totalSeconds = parseDuration(duration);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Reset timer when duration changes
    setSecondsLeft(parseDuration(duration));
    setIsRunning(false);
    setHasStarted(false);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, onComplete]);

  const handleStart = useCallback(() => {
    if (secondsLeft === 0) {
      // Reset if timer completed
      setSecondsLeft(totalSeconds);
    }
    setIsRunning(true);
    setHasStarted(true);
  }, [secondsLeft, totalSeconds]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setHasStarted(false);
  }, [totalSeconds]);

  // Format seconds as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="bg-zinc-900 rounded-lg p-4 mb-4">
      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className={`text-5xl font-bold font-mono ${
          secondsLeft <= 5 && isRunning ? 'text-red-500 animate-pulse' : 'text-white'
        }`}>
          {formatTime(secondsLeft)}
        </div>
        {secondsLeft === 0 && hasStarted && (
          <div className="text-green-400 text-lg font-semibold mt-2">
            Complete!
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {hasStarted && (
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-1000 ${
              secondsLeft === 0 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <span className="text-xl">▶</span>
            {hasStarted && secondsLeft > 0 ? 'Resume' : secondsLeft === 0 ? 'Restart' : 'Start Timer'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <span className="text-xl">⏸</span>
            Pause
          </button>
        )}
        {hasStarted && (
          <button
            onClick={handleReset}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
