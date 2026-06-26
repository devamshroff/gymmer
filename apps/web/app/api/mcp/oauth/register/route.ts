import { NextRequest, NextResponse } from 'next/server';
import { registerMcpOAuthClient } from '@/lib/mcp/oauth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();
    const client = await registerMcpOAuthClient(metadata);
    return NextResponse.json(client, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'invalid_client_metadata',
        error_description: error instanceof Error ? error.message : 'Invalid client metadata',
      },
      { status: 400 }
    );
  }
}
