// Maintenance is handled in app.js (custom server) to avoid Edge Runtime self-fetch issues.
// This middleware is a no-op passthrough required by Next.js.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}