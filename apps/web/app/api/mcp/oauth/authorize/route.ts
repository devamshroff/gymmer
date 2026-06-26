import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { auth } from '@/auth';
import {
  createMcpAuthorizationCode,
  getMcpOAuthClient,
  getMcpOAuthScopes,
  validateMcpOAuthClientRedirect,
} from '@/lib/mcp/oauth';

export const runtime = 'nodejs';
const CSRF_COOKIE = 'gymmer_mcp_oauth_csrf';
const AUTHORIZE_FORM_FIELDS = [
  'response_type',
  'client_id',
  'redirect_uri',
  'state',
  'scope',
  'code_challenge',
  'code_challenge_method',
  'resource',
] as const;

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function htmlResponse(body: string, status = 200): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function createCsrfToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function redirectWithError(redirectUri: string, error: string, state?: string | null): NextResponse {
  const url = new URL(redirectUri);
  url.searchParams.set('error', error);
  if (state) url.searchParams.set('state', state);
  return NextResponse.redirect(url, 303);
}

export function buildAuthorizeCallbackUrl(baseUrl: string, params: URLSearchParams): string {
  const url = new URL('/api/mcp/oauth/authorize', baseUrl);
  for (const field of AUTHORIZE_FORM_FIELDS) {
    const value = params.get(field);
    if (value) url.searchParams.set(field, value);
  }
  return url.toString();
}

export function buildAuthorizeConsentFields(
  parsed: {
    responseType: string;
    clientId: string;
    redirectUri: string;
    state: string | null;
    scope: string;
    codeChallenge: string;
    codeChallengeMethod: string;
    resource: string | null;
  },
  csrfToken: string
): string[][] {
  const values = {
    response_type: parsed.responseType,
    client_id: parsed.clientId,
    redirect_uri: parsed.redirectUri,
    state: parsed.state || '',
    scope: parsed.scope,
    code_challenge: parsed.codeChallenge,
    code_challenge_method: parsed.codeChallengeMethod,
    resource: parsed.resource || '',
  } satisfies Record<(typeof AUTHORIZE_FORM_FIELDS)[number], string>;

  return [
    ...AUTHORIZE_FORM_FIELDS.map((field) => [field, values[field]]),
    ['csrf', csrfToken],
  ];
}

async function validateAuthorizeParams(params: URLSearchParams) {
  const responseType = params.get('response_type');
  const clientId = params.get('client_id');
  const redirectUri = params.get('redirect_uri');
  const codeChallenge = params.get('code_challenge');
  const codeChallengeMethod = params.get('code_challenge_method');

  if (responseType !== 'code') {
    throw new Error('response_type must be code');
  }
  if (!clientId) {
    throw new Error('client_id is required');
  }
  if (!redirectUri) {
    throw new Error('redirect_uri is required');
  }
  if (!codeChallenge || codeChallengeMethod !== 'S256') {
    throw new Error('S256 PKCE is required');
  }

  const client = await getMcpOAuthClient(clientId);
  if (!client || !validateMcpOAuthClientRedirect(client, redirectUri)) {
    throw new Error('invalid client or redirect_uri');
  }

  const scopes = getMcpOAuthScopes(params.get('scope'));
  if (!scopes.includes('gymmer:read')) {
    scopes.unshift('gymmer:read');
  }

  return {
    responseType,
    client,
    clientId,
    redirectUri,
    state: params.get('state'),
    scope: scopes.join(' '),
    codeChallenge,
    codeChallengeMethod,
    resource: params.get('resource'),
  };
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl, 303);
  }

  let parsed: Awaited<ReturnType<typeof validateAuthorizeParams>>;
  try {
    parsed = await validateAuthorizeParams(request.nextUrl.searchParams);
  } catch (error: unknown) {
    return htmlResponse(`<p>${htmlEscape(errorMessage(error, 'Invalid authorization request'))}</p>`, 400);
  }

  const csrfToken = createCsrfToken();
  const fields = buildAuthorizeConsentFields(parsed, csrfToken);
  const hasWriteScope = parsed.scope.split(/\s+/).includes('gymmer:write');

  const response = htmlResponse(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Connect Claude to Temple</title>
        <style>
          body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #09090b; color: #f4f4f5; font-family: ui-sans-serif, system-ui, sans-serif; }
          main { width: min(92vw, 420px); border: 1px solid #27272a; border-radius: 20px; padding: 28px; background: #18181b; box-shadow: 0 20px 80px rgba(0,0,0,.35); }
          h1 { margin: 0 0 10px; font-size: 24px; }
          p { color: #a1a1aa; line-height: 1.5; }
          code { color: #34d399; }
          button { width: 100%; border: 0; border-radius: 12px; padding: 12px 16px; background: #059669; color: white; font-weight: 700; cursor: pointer; }
        </style>
      </head>
      <body>
        <main>
          <h1>Connect Claude to Temple</h1>
          <p>Claude is requesting ${hasWriteScope ? 'read and write' : 'read-only'} access to your Temple progress, workout history, routines, goals, settings, and nutrition data.</p>
          <p>Signed in as <code>${htmlEscape(session.user.email)}</code>.</p>
          <form method="post" action="/api/mcp/oauth/authorize">
            ${fields.map(([name, value]) => `<input type="hidden" name="${htmlEscape(name)}" value="${htmlEscape(value)}" />`).join('')}
            <button type="submit">Allow ${hasWriteScope ? 'read and write' : 'read-only'} access</button>
          </form>
        </main>
      </body>
    </html>
  `);
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: request.nextUrl.protocol === 'https:',
    path: '/api/mcp/oauth/authorize',
    maxAge: 60 * 10,
  });
  return response;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') params.set(key, value);
  }

  const session = await auth();
  if (!session?.user?.email) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', buildAuthorizeCallbackUrl(request.url, params));
    return NextResponse.redirect(loginUrl, 303);
  }

  const csrf = params.get('csrf');
  const expectedCsrf = request.cookies.get(CSRF_COOKIE)?.value;
  if (!csrf || !expectedCsrf || csrf !== expectedCsrf) {
    return htmlResponse('<p>Invalid authorization request.</p>', 400);
  }

  let parsed: Awaited<ReturnType<typeof validateAuthorizeParams>>;
  try {
    parsed = await validateAuthorizeParams(params);
  } catch (error: unknown) {
    const redirectUri = params.get('redirect_uri');
    const state = params.get('state');
    if (redirectUri) return redirectWithError(redirectUri, 'invalid_request', state);
    return htmlResponse(`<p>${htmlEscape(errorMessage(error, 'Invalid authorization request'))}</p>`, 400);
  }

  const code = await createMcpAuthorizationCode({
    clientId: parsed.clientId,
    userId: session.user.email,
    redirectUri: parsed.redirectUri,
    scope: parsed.scope,
    codeChallenge: parsed.codeChallenge,
    codeChallengeMethod: parsed.codeChallengeMethod,
    resource: parsed.resource,
  });

  const redirectUrl = new URL(parsed.redirectUri);
  redirectUrl.searchParams.set('code', code);
  if (parsed.state) redirectUrl.searchParams.set('state', parsed.state);
  const response = NextResponse.redirect(redirectUrl, 303);
  response.cookies.delete(CSRF_COOKIE);
  return response;
}
