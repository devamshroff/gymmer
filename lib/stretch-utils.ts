export function formatStretchTimer(timerSeconds?: number | null): string {
  if (!timerSeconds || timerSeconds <= 0) {
    return 'Timer not set';
  }
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  if (minutes > 0 && seconds === 0) {
    return `${minutes} min`;
  }
  if (minutes > 0) {
    return `${minutes} min ${seconds} sec`;
  }
  return `${timerSeconds} sec`;
}

export function parseTimerSecondsFromText(value?: string | null): number | null {
  if (!value) return null;
  const text = value.toLowerCase();
  const secondsMatch = text.match(/(\d+)\s*(sec|second)/);
  if (secondsMatch) {
    return Number(secondsMatch[1]);
  }
  const minutesMatch = text.match(/(\d+)\s*(min|minute)/);
  if (minutesMatch) {
    return Number(minutesMatch[1]) * 60;
  }
  return null;
}
