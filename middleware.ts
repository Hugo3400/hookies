import { NextRequest, NextResponse } from 'next/server';

const MAINTENANCE_CACHE_TTL_MS = 30000;
let maintenanceCache = {
  value: false,
  updatedAt: 0,
};

async function isMaintenanceEnabled(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return true;
  }

  const now = Date.now();
  if (now - maintenanceCache.updatedAt < MAINTENANCE_CACHE_TTL_MS) {
    return maintenanceCache.value;
  }

  try {
    const url = new URL('/api/public/maintenance', request.url);
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'x-maintenance-probe': '1',
      },
    });

    if (!response.ok) {
      return maintenanceCache.value;
    }

    const data = (await response.json()) as { maintenanceMode?: boolean };
    maintenanceCache = {
      value: Boolean(data.maintenanceMode),
      updatedAt: now,
    };
    return maintenanceCache.value;
  } catch {
    return maintenanceCache.value;
  }
}

export async function middleware(request: NextRequest) {
  const maintenanceEnabled = await isMaintenanceEnabled(request);
  if (!maintenanceEnabled) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Leave maintenance page and static assets reachable.
  if (
    pathname === '/maintenance' ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/da') ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/api/public/maintenance' ||
    pathname === '/api/auth/me' ||
    pathname === '/api/auth/login' ||
    pathname.startsWith('/api/admin/')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.json(
      {
        error: 'Service indisponible pour maintenance',
        maintenance: true,
      },
      {
        status: 503,
        headers: {
          'Retry-After': '3600',
        },
      }
    );
  }

  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = '/maintenance';
  maintenanceUrl.search = '';

  return NextResponse.redirect(maintenanceUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};