const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

type TipRequest = {
  kind: 'exercise' | 'stretch';
  name: string;
  muscleGroups?: string[];
  equipment?: string;
  difficulty?: string;
  duration?: string;
  stretchType?: string;
};

function formatList(items?: string[]): string {
  if (!items || items.length === 0) return 'Unknown';
  return items.join(', ');
}

function buildUserPrompt(data: TipRequest): string {
  if (data.kind === 'stretch') {
    return [
      `Stretch: ${data.name}`,
      `Type: ${data.stretchType || 'Unknown'}`,
      `Duration: ${data.duration || 'Unknown'}`,
      `Muscle groups: ${formatList(data.muscleGroups)}`,
      'Provide 1-2 concise form tips with posture and breathing cues.'
    ].join('\n');
  }

  return [
    `Exercise: ${data.name}`,
    `Muscle groups: ${formatList(data.muscleGroups)}`,
    `Equipment: ${data.equipment || 'Unknown'}`,
    `Difficulty: ${data.difficulty || 'Unknown'}`,
    'Provide 1-2 concise form tips with safe technique cues.'
  ].join('\n');
}

function normalizeTipOutput(value: string): string {
  return value
    .replace(/^[\s"'`*-]+/, '')
    .replace(/[\s"'`]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
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
            content: 'You are a fitness coach. Return 1-2 short sentences. No markdown or bullet points.'
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
