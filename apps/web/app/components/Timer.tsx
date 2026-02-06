'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerProps {
  timerSeconds: number; // Explicit timer value in seconds, 0 means no timer
  onComplete?: () => void;
}

export default function Timer({ timerSeconds, onComplete }: TimerProps) {
  // Don't render anything if no timer is needed
  if (!timerSeconds || timerSeconds <= 0) {
    return null;
  }

  return <TimerContent timerSeconds={timerSeconds} onComplete={onComplete} />;
}

function TimerContent({ timerSeconds, onComplete }: { timerSeconds: number; onComplete?: () => void }) {
  const totalSeconds = timerSeconds;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const didCompleteRef = useRef(false);

  useEffect(() => {
    // Reset timer when timerSeconds changes
    setSecondsLeft(timerSeconds);
    setIsRunning(false);
    setHasStarted(false);
    endTimeRef.current = null;
    didCompleteRef.current = false;
  }, [timerSeconds]);

  const updateRemaining = useCallback(() => {
    if (!endTimeRef.current) return;
    const remainingMs = endTimeRef.current - Date.now();
    const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    setSecondsLeft(nextSeconds);
    if (nextSeconds === 0) {
      setIsRunning(false);
      if (!didCompleteRef.current) {
        didCompleteRef.current = true;
        onComplete?.();
      }
    }
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return;
    updateRemaining();
    const interval = setInterval(updateRemaining, 250);
    return () => clearInterval(interval);
  }, [isRunning, updateRemaining]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateRemaining();
      }
    };
    const handleFocus = () => {
      updateRemaining();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [updateRemaining]);

  const handleStart = useCallback(() => {
    const baseSeconds = secondsLeft === 0 ? totalSeconds : secondsLeft;
    if (baseSeconds <= 0) return;
    if (secondsLeft === 0) {
      setSecondsLeft(baseSeconds);
    }
    didCompleteRef.current = false;
    endTimeRef.current = Date.now() + baseSeconds * 1000;
    setIsRunning(true);
    setHasStarted(true);
  }, [secondsLeft, totalSeconds]);

  const handlePause = useCallback(() => {
    if (endTimeRef.current) {
      const remainingMs = endTimeRef.current - Date.now();
      const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setSecondsLeft(nextSeconds);
    }
    endTimeRef.current = null;
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setHasStarted(false);
    endTimeRef.current = null;
    didCompleteRef.current = false;
  }, [totalSeconds]);

  // Format seconds as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          <div className="text-blue-300 text-lg font-semibold mt-2">
            Complete!
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
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
