import { describe, expect, it } from 'vitest';
import {
  buildAuthorizeCallbackUrl,
  buildAuthorizeConsentFields,
} from '@/app/api/mcp/oauth/authorize/route';
import { getMcpOAuthScopes } from '@/lib/mcp/oauth';

describe('getMcpOAuthScopes', () => {
  it('defaults to read-only Gymmer access', () => {
    expect(getMcpOAuthScopes()).toEqual(['gymmer:read']);
  });

  it('keeps only supported MCP scopes', () => {
    expect(getMcpOAuthScopes('gymmer:read gymmer:write offline_access write:anything')).toEqual([
      'gymmer:read',
      'gymmer:write',
      'offline_access',
    ]);
  });
});

describe('buildAuthorizeCallbackUrl', () => {
  it('reconstructs an authorize GET callback without consent-only fields', () => {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'client_123',
      redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
      state: 'state_123',
      scope: 'gymmer:read offline_access',
      code_challenge: 'challenge_123',
      code_challenge_method: 'S256',
      resource: 'https://gymmer.example/api/mcp',
      csrf: 'do-not-forward',
    });

    const url = new URL(buildAuthorizeCallbackUrl('https://gymmer.example/api/mcp/oauth/authorize', params));

    expect(url.pathname).toBe('/api/mcp/oauth/authorize');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('client_id')).toBe('client_123');
    expect(url.searchParams.get('redirect_uri')).toBe('https://claude.ai/api/mcp/auth_callback');
    expect(url.searchParams.get('csrf')).toBeNull();
  });
});

describe('buildAuthorizeConsentFields', () => {
  it('preserves all authorize parameters required by the consent POST', () => {
    const fields = buildAuthorizeConsentFields(
      {
        responseType: 'code',
        clientId: 'client_123',
        redirectUri: 'https://claude.ai/api/mcp/auth_callback',
        state: 'state_123',
        scope: 'gymmer:read',
        codeChallenge: 'challenge_123',
        codeChallengeMethod: 'S256',
        resource: 'https://gymmer.example/api/mcp',
      },
      'csrf_123'
    );

    expect(Object.fromEntries(fields)).toEqual({
      response_type: 'code',
      client_id: 'client_123',
      redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
      state: 'state_123',
      scope: 'gymmer:read',
      code_challenge: 'challenge_123',
      code_challenge_method: 'S256',
      resource: 'https://gymmer.example/api/mcp',
      csrf: 'csrf_123',
    });
  });
});
