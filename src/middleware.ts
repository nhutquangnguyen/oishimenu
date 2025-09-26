import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Admin subdomain
  if (hostname === 'admin.oishimenu.com') {
    // Redirect root to admin dashboard
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/admin', request.url));
    }
    
    // Rewrite admin routes
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
    
    // Rewrite other routes to admin
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }
  
  // Merchant subdomain
  if (hostname === 'merchant.oishimenu.com') {
    const pathParts = pathname.split('/').filter(Boolean);
    
    // If no path, show merchant selection page
    if (pathParts.length === 0) {
      return NextResponse.rewrite(new URL('/merchant/select', request.url));
    }
    
    const merchantId = pathParts[0];
    const route = pathParts[1] || 'dashboard';
    
    // Rewrite to merchant route
    return NextResponse.rewrite(
      new URL(`/merchant/${merchantId}/${route}`, request.url)
    );
  }
  
  // Main domain (oishimenu.com) - marketing site
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
