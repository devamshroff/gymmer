import {
  MUSCLE_GROUP_TAGS,
  STRETCH_MUSCLE_TAGS,
  normalizeTypeList,
} from './muscle-tags';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  medium: 'Intermediate',
  advanced: 'Advanced',
};

type TipRequest = {
  kind: 'exercise' | 'stretch';
  name: string;
  muscleGroups?: string[];
  equipment?: string;
  difficulty?: string;
  timerSeconds?: number;
  goalsText?: string | null;
};

function formatList(items?: string[]): string {
  if (!items || items.length === 0) return 'Unknown';
  return items.join(', ');
}

function buildUserPrompt(data: TipRequest): string {
  const goalsLine = data.goalsText ? `User goals: ${data.goalsText}` : 'User goals: (not provided)';
  if (data.kind === 'stretch') {
    return [
      `Stretch: ${data.name}`,
      `Timer seconds: ${data.timerSeconds ?? 'Unknown'}`,
      `Muscle groups: ${formatList(data.muscleGroups)}`,
      goalsLine,
      'Provide 1-2 concise form tips with posture and breathing cues.'
    ].join('\n');
  }

  return [
    `Exercise: ${data.name}`,
    `Muscle groups: ${formatList(data.muscleGroups)}`,
    `Equipment: ${data.equipment || 'Unknown'}`,
    `Difficulty: ${data.difficulty || 'Unknown'}`,
    goalsLine,
    'Provide 1-2 concise form tips with safe technique cues.'
  ].join('\n');
}

function normalizeDifficulty(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned || cleaned === 'unknown') return null;
  return DIFFICULTY_LABELS[cleaned] || null;
}

function normalizeTipOutput(value: string): string {
  return value
    .replace(/^[\s"'`*-]+/, '')
    .replace(/[\s"'`]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }
  return content;
}

export type ExerciseInsights = {
  tips: string | null;
  isBodyweight: boolean | null;
  muscleGroups: string[] | null;
  difficulty: string | null;
};

export type StretchInsights = {
  tips: string | null;
  timerSeconds: number | null;
  muscleGroups: string[] | null;
};

export async function generateExerciseInsights(data: TipRequest): Promise<ExerciseInsights | null> {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'You are a gym trainer helping users make consistent progress.',
              'Return JSON only: {"tips":"...","isBodyweight":true|false,"muscleGroups":["chest","upper body compound"],"difficulty":"Intermediate"}.',
              `muscleGroups must be 1-2 items from: ${MUSCLE_GROUP_TAGS.join(', ')}.`,
              'difficulty must be one of: Beginner, Intermediate, Advanced.',
              'Use "unknown" if the muscle group is unclear.',
              'If the exercise is a compound movement, include one compound tag and one primary muscle tag when possible.',
              'tips should be 1-2 short sentences, no markdown.'
            ].join(' ')
          },
          { role: 'user', content: buildUserPrompt(data) }
        ],
        temperature: 0.3,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI exercise insights request failed:', errorText);
      return null;
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return null;
    }

    const rawJson = extractJson(content);
    const parsed = JSON.parse(rawJson);
    const tips = typeof parsed.tips === 'string' ? normalizeTipOutput(parsed.tips) : null;
    const isBodyweight = typeof parsed.isBodyweight === 'boolean' ? parsed.isBodyweight : null;
    const muscleGroups = normalizeTypeList(
      parsed.muscleGroups ?? parsed.exerciseTypes,
      MUSCLE_GROUP_TAGS
    );
    const difficulty = normalizeDifficulty(parsed.difficulty);
    return {
      tips: tips && tips.length > 0 ? tips : null,
      isBodyweight,
      muscleGroups: muscleGroups.length > 0 ? muscleGroups : null,
      difficulty,
    };
  } catch (error) {
    console.error('OpenAI exercise insights request error:', error);
    return null;
  }
}

export async function generateStretchInsights(data: TipRequest): Promise<StretchInsights | null> {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'You are a gym trainer helping users make consistent progress.',
              'Return JSON only: {"tips":"...","timerSeconds":30,"muscleGroups":["hamstrings","glutes"]}.',
              `muscleGroups must be 1-2 items from: ${STRETCH_MUSCLE_TAGS.join(', ')}.`,
              'Use "unknown" if the muscle group is unclear.',
              'timerSeconds is the hold time in seconds (integer).',
              'tips should be 1-2 short sentences, no markdown.'
            ].join(' ')
          },
          { role: 'user', content: buildUserPrompt(data) }
        ],
        temperature: 0.3,
        max_tokens: 160,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI stretch insights request failed:', errorText);
      return null;
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return null;
    }

    const rawJson = extractJson(content);
    const parsed = JSON.parse(rawJson);
    const tips = typeof parsed.tips === 'string' ? normalizeTipOutput(parsed.tips) : null;
    const timerSecondsRaw = Number(parsed.timerSeconds);
    const timerSeconds = Number.isFinite(timerSecondsRaw) && timerSecondsRaw > 0
      ? Math.round(timerSecondsRaw)
      : null;
    const muscleGroups = normalizeTypeList(parsed.muscleGroups ?? parsed.stretchTypes, STRETCH_MUSCLE_TAGS);
    return {
      tips: tips && tips.length > 0 ? tips : null,
      timerSeconds,
      muscleGroups: muscleGroups.length > 0 ? muscleGroups : null,
    };
  } catch (error) {
    console.error('OpenAI stretch insights request error:', error);
    return null;
  }
}

export async function generateFormTips(data: TipRequest): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a gym trainer helping users make consistent progress. Return 1-2 short sentences. No markdown or bullet points.'
          },
          { role: 'user', content: buildUserPrompt(data) }
        ],
        temperature: 0.3,
        max_tokens: 80,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI tips request failed:', errorText);
      return null;
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return null;
    }

    const normalized = normalizeTipOutput(content);
    return normalized.length > 0 ? normalized : null;
  } catch (error) {
    console.error('OpenAI tips request error:', error);
    return null;
  }
}
