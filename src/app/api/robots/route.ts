import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oishimenu.com';

  const robots = `User-agent: *
Allow: /
Allow: /auth/signin
Allow: /auth/signup
Disallow: /dashboard*
Disallow: /api*
Disallow: /_next*
Disallow: /admin*

Sitemap: ${baseUrl}/sitemap.xml

# OishiMenu - Digital Menu Platform for Restaurants
# Visit ${baseUrl} to create your smart QR menu`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}