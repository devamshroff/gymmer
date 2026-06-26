const DEFAULT_CLAUDE_MODEL = 'claude-sonnet-4-5';
const DEFAULT_ANTHROPIC_VERSION = '2023-06-01';

export class ClaudeRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ClaudeRequestError';
  }
}

type ClaudeMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ClaudeTextRequest = {
  system?: string;
  messages: ClaudeMessage[];
  model?: string;
  temperature?: number;
  maxTokens: number;
};

type ClaudeTextResponse = {
  text: string;
  usage: unknown;
  model: string | null;
};

export function getClaudeModel(): string {
  return process.env.ANTHROPIC_MODEL || DEFAULT_CLAUDE_MODEL;
}

export function hasClaudeApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getClaudeErrorStatus(error: unknown, fallback = 500): number {
  return error instanceof ClaudeRequestError ? error.status : fallback;
}

export async function createClaudeText({
  system,
  messages,
  model = getClaudeModel(),
  temperature,
  maxTokens,
}: ClaudeTextRequest): Promise<ClaudeTextResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ClaudeRequestError('Missing ANTHROPIC_API_KEY', 500);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': process.env.ANTHROPIC_VERSION || DEFAULT_ANTHROPIC_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      system,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ClaudeRequestError(`Claude request failed: ${errorText}`, 502);
  }

  const data = await response.json();
  const text = Array.isArray(data.content)
    ? data.content
      .filter((part: unknown): part is { type: string; text: string } => {
        const block = part as { type?: unknown; text?: unknown };
        return block.type === 'text' && typeof block.text === 'string';
      })
      .map((part: { text: string }) => part.text)
      .join('\n')
      .trim()
    : '';

  if (!text) {
    throw new ClaudeRequestError('No content returned from model', 502);
  }

  return {
    text,
    usage: data.usage ?? null,
    model: typeof data.model === 'string' ? data.model : null,
  };
}
