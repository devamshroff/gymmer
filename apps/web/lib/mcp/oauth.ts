import crypto from 'crypto';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { getDatabase } from '@/lib/database';

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
const AUTH_CODE_TTL_SECONDS = 60 * 5;
const DEFAULT_SCOPE = 'gymmer:read';
const SUPPORTED_SCOPES = new Set(['gymmer:read', 'gymmer:write', 'offline_access']);

let tablesReady = false;

type OAuthClient = {
  client_id: string;
  client_secret_hash: string | null;
  redirect_uris: string;
  grant_types: string;
  response_types: string;
  scope: string;
  token_endpoint_auth_method: string;
  client_name: string | null;
};

type AuthorizationCodeRow = {
  client_id: string;
  user_id: string;
  redirect_uri: string;
  scope: string;
  code_challenge: string;
  code_challenge_method: string;
  resource: string | null;
  expires_at: number;
};

type OAuthTokenRow = {
  id: number;
  client_id: string;
  user_id: string;
  scope: string;
  resource: string | null;
  access_expires_at: number;
  refresh_expires_at: number | null;
};

type OAuthClientMetadata = {
  redirect_uris?: string[];
  grant_types?: string[];
  response_types?: string[];
  scope?: string;
  token_endpoint_auth_method?: string;
  client_name?: string;
};

export function getMcpOAuthScopes(scope?: string | null): string[] {
  const requested = typeof scope === 'string' && scope.trim()
    ? scope.trim().split(/\s+/)
    : [DEFAULT_SCOPE];
  return Array.from(new Set(requested.filter((item) => SUPPORTED_SCOPES.has(item))));
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function base64urlSha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('base64url');
}

function safeJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function normalizeStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const strings = value.map((item) => String(item)).filter(Boolean);
  return strings.length > 0 ? Array.from(new Set(strings)) : fallback;
}

function validateRedirectUri(uri: string): boolean {
  try {
    const parsed = new URL(uri);
    return parsed.protocol === 'https:' || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

export async function ensureMcpOAuthTables(): Promise<void> {
  if (tablesReady) return;
  const db = getDatabase();

  await db.batch([
    {
      sql: `
        CREATE TABLE IF NOT EXISTS mcp_oauth_clients (
          client_id TEXT PRIMARY KEY,
          client_secret_hash TEXT,
          redirect_uris TEXT NOT NULL,
          grant_types TEXT NOT NULL,
          response_types TEXT NOT NULL,
          scope TEXT NOT NULL,
          token_endpoint_auth_method TEXT NOT NULL,
          client_name TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `,
      args: [],
    },
    {
      sql: `
        CREATE TABLE IF NOT EXISTS mcp_oauth_authorization_codes (
          code_hash TEXT PRIMARY KEY,
          client_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          redirect_uri TEXT NOT NULL,
          scope TEXT NOT NULL,
          code_challenge TEXT NOT NULL,
          code_challenge_method TEXT NOT NULL,
          resource TEXT,
          expires_at INTEGER NOT NULL,
          created_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (client_id) REFERENCES mcp_oauth_clients(client_id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `,
      args: [],
    },
    {
      sql: `
        CREATE TABLE IF NOT EXISTS mcp_oauth_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          access_token_hash TEXT NOT NULL UNIQUE,
          refresh_token_hash TEXT UNIQUE,
          client_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          scope TEXT NOT NULL,
          resource TEXT,
          access_expires_at INTEGER NOT NULL,
          refresh_expires_at INTEGER,
          revoked_at TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (client_id) REFERENCES mcp_oauth_clients(client_id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `,
      args: [],
    },
    {
      sql: 'CREATE INDEX IF NOT EXISTS idx_mcp_oauth_tokens_access ON mcp_oauth_tokens(access_token_hash)',
      args: [],
    },
    {
      sql: 'CREATE INDEX IF NOT EXISTS idx_mcp_oauth_tokens_refresh ON mcp_oauth_tokens(refresh_token_hash)',
      args: [],
    },
  ]);

  tablesReady = true;
}

export async function registerMcpOAuthClient(metadata: OAuthClientMetadata) {
  await ensureMcpOAuthTables();

  const redirectUris = normalizeStringArray(metadata.redirect_uris, []);
  if (redirectUris.length === 0 || redirectUris.some((uri) => !validateRedirectUri(uri))) {
    throw new Error('redirect_uris must contain at least one valid URL');
  }

  const tokenEndpointAuthMethod = metadata.token_endpoint_auth_method || 'none';
  const isPublicClient = tokenEndpointAuthMethod === 'none';
  const clientSecret = isPublicClient ? null : randomToken(32);
  const clientId = `gymmer_mcp_${randomToken(24)}`;
  const grantTypes = normalizeStringArray(metadata.grant_types, ['authorization_code', 'refresh_token']);
  const responseTypes = normalizeStringArray(metadata.response_types, ['code']);
  const scope = getMcpOAuthScopes(metadata.scope).join(' ') || DEFAULT_SCOPE;

  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO mcp_oauth_clients (
        client_id,
        client_secret_hash,
        redirect_uris,
        grant_types,
        response_types,
        scope,
        token_endpoint_auth_method,
        client_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      clientId,
      clientSecret ? sha256(clientSecret) : null,
      JSON.stringify(redirectUris),
      JSON.stringify(grantTypes),
      JSON.stringify(responseTypes),
      scope,
      tokenEndpointAuthMethod,
      metadata.client_name || null,
    ],
  });

  return {
    client_id: clientId,
    client_secret: clientSecret,
    client_id_issued_at: nowSeconds(),
    redirect_uris: redirectUris,
    grant_types: grantTypes,
    response_types: responseTypes,
    scope,
    token_endpoint_auth_method: tokenEndpointAuthMethod,
    client_name: metadata.client_name,
  };
}

export async function getMcpOAuthClient(clientId: string): Promise<OAuthClient | null> {
  await ensureMcpOAuthTables();
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM mcp_oauth_clients WHERE client_id = ? LIMIT 1',
    args: [clientId],
  });
  return (result.rows[0] as unknown as OAuthClient | undefined) || null;
}

export function validateMcpOAuthClientRedirect(client: OAuthClient, redirectUri: string): boolean {
  return safeJsonArray(client.redirect_uris).includes(redirectUri);
}

export async function createMcpAuthorizationCode(params: {
  clientId: string;
  userId: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  resource?: string | null;
}): Promise<string> {
  await ensureMcpOAuthTables();
  const code = randomToken(32);
  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO mcp_oauth_authorization_codes (
        code_hash,
        client_id,
        user_id,
        redirect_uri,
        scope,
        code_challenge,
        code_challenge_method,
        resource,
        expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      sha256(code),
      params.clientId,
      params.userId,
      params.redirectUri,
      params.scope,
      params.codeChallenge,
      params.codeChallengeMethod,
      params.resource || null,
      nowSeconds() + AUTH_CODE_TTL_SECONDS,
    ],
  });
  return code;
}

function verifyPkce(codeVerifier: string, codeChallenge: string, method: string): boolean {
  if (method !== 'S256') return false;
  return base64urlSha256(codeVerifier) === codeChallenge;
}

async function authenticateTokenClient(params: {
  clientId: string | null;
  clientSecret: string | null;
  authorizationHeader: string | null;
}): Promise<OAuthClient | null> {
  const basic = params.authorizationHeader?.startsWith('Basic ')
    ? params.authorizationHeader.slice('Basic '.length)
    : null;
  let clientId = params.clientId;
  let clientSecret = params.clientSecret;

  if (basic) {
    try {
      const decoded = Buffer.from(basic, 'base64').toString('utf8');
      const separator = decoded.indexOf(':');
      if (separator >= 0) {
        clientId = decodeURIComponent(decoded.slice(0, separator));
        clientSecret = decodeURIComponent(decoded.slice(separator + 1));
      }
    } catch {
      return null;
    }
  }

  if (!clientId) return null;
  const client = await getMcpOAuthClient(clientId);
  if (!client) return null;

  if (client.token_endpoint_auth_method === 'none') {
    return client;
  }

  if (!client.client_secret_hash || !clientSecret) return null;
  return sha256(clientSecret) === client.client_secret_hash ? client : null;
}

async function issueMcpOAuthTokens(params: {
  clientId: string;
  userId: string;
  scope: string;
  resource?: string | null;
  includeRefreshToken: boolean;
}) {
  const accessToken = randomToken(32);
  const refreshToken = params.includeRefreshToken ? randomToken(32) : null;
  const accessExpiresAt = nowSeconds() + ACCESS_TOKEN_TTL_SECONDS;
  const refreshExpiresAt = refreshToken ? nowSeconds() + REFRESH_TOKEN_TTL_SECONDS : null;

  const db = getDatabase();
  await db.execute({
    sql: `
      INSERT INTO mcp_oauth_tokens (
        access_token_hash,
        refresh_token_hash,
        client_id,
        user_id,
        scope,
        resource,
        access_expires_at,
        refresh_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      sha256(accessToken),
      refreshToken ? sha256(refreshToken) : null,
      params.clientId,
      params.userId,
      params.scope,
      params.resource || null,
      accessExpiresAt,
      refreshExpiresAt,
    ],
  });

  const response: {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    scope: string;
    refresh_token?: string;
  } = {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    scope: params.scope,
  };
  if (refreshToken) response.refresh_token = refreshToken;
  return response;
}

export async function exchangeMcpAuthorizationCode(params: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
  clientId: string | null;
  clientSecret: string | null;
  authorizationHeader: string | null;
}) {
  await ensureMcpOAuthTables();
  const client = await authenticateTokenClient(params);
  if (!client) {
    throw new Error('invalid_client');
  }

  const db = getDatabase();
  const codeHash = sha256(params.code);
  const result = await db.execute({
    sql: 'SELECT * FROM mcp_oauth_authorization_codes WHERE code_hash = ? LIMIT 1',
    args: [codeHash],
  });
  const row = result.rows[0] as unknown as AuthorizationCodeRow | undefined;
  if (!row) {
    throw new Error('invalid_grant');
  }

  await db.execute({
    sql: 'DELETE FROM mcp_oauth_authorization_codes WHERE code_hash = ?',
    args: [codeHash],
  });

  if (row.expires_at < nowSeconds()) {
    throw new Error('invalid_grant');
  }
  if (row.client_id !== client.client_id || row.redirect_uri !== params.redirectUri) {
    throw new Error('invalid_grant');
  }
  if (!verifyPkce(params.codeVerifier, row.code_challenge, row.code_challenge_method)) {
    throw new Error('invalid_grant');
  }

  return issueMcpOAuthTokens({
    clientId: client.client_id,
    userId: row.user_id,
    scope: row.scope,
    resource: row.resource,
    includeRefreshToken: getMcpOAuthScopes(row.scope).includes('offline_access'),
  });
}

export async function refreshMcpOAuthToken(params: {
  refreshToken: string;
  clientId: string | null;
  clientSecret: string | null;
  authorizationHeader: string | null;
}) {
  await ensureMcpOAuthTables();
  const client = await authenticateTokenClient(params);
  if (!client) {
    throw new Error('invalid_client');
  }

  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT *
      FROM mcp_oauth_tokens
      WHERE refresh_token_hash = ?
        AND client_id = ?
        AND revoked_at IS NULL
      LIMIT 1
    `,
    args: [sha256(params.refreshToken), client.client_id],
  });
  const row = result.rows[0] as unknown as OAuthTokenRow | undefined;
  if (!row || !row.refresh_expires_at || row.refresh_expires_at < nowSeconds()) {
    throw new Error('invalid_grant');
  }

  await db.execute({
    sql: 'UPDATE mcp_oauth_tokens SET revoked_at = datetime(\'now\') WHERE id = ?',
    args: [Number(row.id)],
  });

  return issueMcpOAuthTokens({
    clientId: client.client_id,
    userId: row.user_id,
    scope: row.scope,
    resource: row.resource,
    includeRefreshToken: true,
  });
}

export async function verifyMcpAccessToken(token: string, expectedResource?: string): Promise<AuthInfo | undefined> {
  if (!token) return undefined;
  await ensureMcpOAuthTables();
  const db = getDatabase();
  const result = await db.execute({
    sql: `
      SELECT access_token_hash, client_id, user_id, scope, resource, access_expires_at
      FROM mcp_oauth_tokens
      WHERE access_token_hash = ?
        AND revoked_at IS NULL
      LIMIT 1
    `,
    args: [sha256(token)],
  });
  const row = result.rows[0] as unknown as OAuthTokenRow | undefined;
  if (!row || row.access_expires_at < nowSeconds()) {
    return undefined;
  }
  if (row.resource && expectedResource && row.resource !== expectedResource) {
    return undefined;
  }

  return {
    token,
    clientId: String(row.client_id),
    scopes: String(row.scope || '').split(/\s+/).filter(Boolean),
    expiresAt: Number(row.access_expires_at),
    resource: row.resource ? new URL(String(row.resource)) : undefined,
    extra: {
      userId: String(row.user_id),
    },
  };
}
