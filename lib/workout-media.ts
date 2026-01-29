const FALLBACK_FORM_TIPS = 'No form tips yet.';

export function getFormTips(tips?: string | null): string {
  if (typeof tips !== 'string') {
    return FALLBACK_FORM_TIPS;
  }

  const trimmed = tips.trim();
  return trimmed.length > 0 ? trimmed : FALLBACK_FORM_TIPS;
}

export function getVideoUrl(name?: string | null, videoUrl?: string | null): string {
  if (typeof videoUrl === 'string' && videoUrl.trim().length > 0) {
    return videoUrl.trim();
  }

  const baseName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : 'exercise';
  const query = `${baseName} form`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
