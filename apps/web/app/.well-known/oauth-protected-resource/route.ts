import { NextRequest, NextResponse } from 'next/server';
import { generateProtectedResourceMetadata, getPublicOrigin } from 'mcp-handler';

export const runtime = 'nodejs';

export function GET(request: NextRequest) {
  const origin = getPublicOrigin(request);
  const metadata = generateProtectedResourceMetadata({
    authServerUrls: [origin],
    resourceUrl: `${origin}/api/mcp`,
    additionalMetadata: {
      scopes_supported: ['gymmer:read', 'gymmer:write'],
      bearer_methods_supported: ['header'],
      resource_name: 'Gymmer MCP',
    },
  });

  return NextResponse.json(metadata, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
