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
