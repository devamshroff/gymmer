'use client';

import { useEffect, useMemo, useState } from 'react';

type AutosaveDetail = {
  status: 'saving' | 'success' | 'error';
  eventType?: string;
  at?: number;
};

type AutosaveState = Omit<AutosaveDetail, 'status'> & {
  status: AutosaveDetail['status'] | 'idle';
};

export default function AutosaveBadge({ className = '' }: { className?: string }) {
  const [state, setState] = useState<AutosaveState>({ status: 'idle' });

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<AutosaveDetail>).detail;
      if (!detail) return;
      setState({ ...detail });
    };

    window.addEventListener('workout-autosave', handler);
    return () => window.removeEventListener('workout-autosave', handler);
  }, []);

  const timeLabel = useMemo(() => {
    if (!state.at) return '';
    return new Date(state.at).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }, [state.at]);

  const { label, badgeClass } = useMemo(() => {
    switch (state.status) {
      case 'saving':
        return { label: 'Autosave: saving…', badgeClass: 'text-amber-300 border-amber-500/40' };
      case 'success':
        return { label: `Autosave: saved ${timeLabel}`, badgeClass: 'text-emerald-300 border-emerald-500/40' };
      case 'error':
        return { label: `Autosave: failed ${timeLabel}`, badgeClass: 'text-red-300 border-red-500/40' };
      default:
        return { label: 'Autosave: idle', badgeClass: 'text-zinc-400 border-zinc-600/40' };
    }
  }, [state.status, timeLabel]);

  return (
    <div
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass} ${className}`}
      aria-live="polite"
    >
      {label}
    </div>
  );
}
