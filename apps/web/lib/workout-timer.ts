import { useEffect, useRef, useState } from 'react';

export type TimerFeedbackOptions = {
  soundEnabled?: boolean;
  vibrateEnabled?: boolean;
};

export function formatElapsedTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function playTimerCompleteFeedback(options?: TimerFeedbackOptions) {
  if (typeof window === 'undefined') return;
  const soundEnabled = options?.soundEnabled ?? true;
  const vibrateEnabled = options?.vibrateEnabled ?? true;
  if (vibrateEnabled && 'vibrate' in navigator) {
    navigator.vibrate(500);
  }
  if (!soundEnabled) return;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  try {
    const context = new AudioCtx();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
    oscillator.onended = () => {
      context.close().catch(() => undefined);
    };
  } catch {
    // ignore audio errors
  }
}

export function useCountdownTimer(options?: {
  onComplete?: () => void;
  soundEnabled?: boolean;
  vibrateEnabled?: boolean;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const endTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(options?.onComplete);
  const feedbackRef = useRef<TimerFeedbackOptions>({
    soundEnabled: options?.soundEnabled,
    vibrateEnabled: options?.vibrateEnabled,
  });

  useEffect(() => {
    onCompleteRef.current = options?.onComplete;
  }, [options?.onComplete]);

  useEffect(() => {
    feedbackRef.current = {
      soundEnabled: options?.soundEnabled,
      vibrateEnabled: options?.vibrateEnabled,
    };
  }, [options?.soundEnabled, options?.vibrateEnabled]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (endTimeRef.current === null) return;
      const remainingMs = endTimeRef.current - Date.now();
      const nextRemaining = Math.max(0, Math.ceil(remainingMs / 1000));
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0) {
        endTimeRef.current = null;
        setIsRunning(false);
        playTimerCompleteFeedback(feedbackRef.current);
        onCompleteRef.current?.();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning]);

  const setDuration = (seconds: number) => {
    const next = Math.max(0, Math.round(seconds));
    setDurationSeconds(next);
    if (!isRunning) {
      setRemainingSeconds(next);
      endTimeRef.current = null;
    }
  };

  const start = () => {
    if (remainingSeconds <= 0) return;
    endTimeRef.current = Date.now() + remainingSeconds * 1000;
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    const remainingMs = endTimeRef.current ? endTimeRef.current - Date.now() : 0;
    const nextRemaining = Math.max(0, Math.ceil(remainingMs / 1000));
    endTimeRef.current = null;
    setRemainingSeconds(nextRemaining);
    setIsRunning(false);
  };

  const reset = () => {
    endTimeRef.current = null;
    setIsRunning(false);
    setRemainingSeconds(durationSeconds);
  };

  const elapsedSeconds = Math.max(0, durationSeconds - remainingSeconds);

  return {
    isRunning,
    durationSeconds,
    remainingSeconds,
    elapsedSeconds,
    setDuration,
    start,
    pause,
    reset,
  };
}
