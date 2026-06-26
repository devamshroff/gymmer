import { NextRequest, NextResponse } from 'next/server';
import { exchangeMcpAuthorizationCode, refreshMcpOAuthToken } from '@/lib/mcp/oauth';

export const runtime = 'nodejs';

function tokenError(error: string, status = 400) {
  return NextResponse.json(
    { error },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      },
    }
  );
}

function tokenResponse(body: Record<string, unknown>) {
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const grantType = params.get('grant_type');
  const authorizationHeader = request.headers.get('authorization');

  try {
    if (grantType === 'authorization_code') {
      const code = params.get('code');
      const redirectUri = params.get('redirect_uri');
      const codeVerifier = params.get('code_verifier');
      if (!code || !redirectUri || !codeVerifier) {
        return tokenError('invalid_request');
      }

      const tokens = await exchangeMcpAuthorizationCode({
        code,
        redirectUri,
        codeVerifier,
        clientId: params.get('client_id'),
        clientSecret: params.get('client_secret'),
        authorizationHeader,
      });

      return tokenResponse(tokens);
    }

    if (grantType === 'refresh_token') {
      const refreshToken = params.get('refresh_token');
      if (!refreshToken) {
        return tokenError('invalid_request');
      }

      const tokens = await refreshMcpOAuthToken({
        refreshToken,
        clientId: params.get('client_id'),
        clientSecret: params.get('client_secret'),
        authorizationHeader,
      });

      return tokenResponse(tokens);
    }

    return tokenError('unsupported_grant_type');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    if (message === 'invalid_client') return tokenError(message, 401);
    if (message === 'invalid_grant') return tokenError(message, 400);
    console.error('MCP OAuth token exchange failed:', error);
    return tokenError('server_error', 500);
  }
}
