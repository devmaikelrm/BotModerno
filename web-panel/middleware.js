
import { NextResponse } from 'next/server';

export const config = { 
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/bot-config',
    '/webhook-status',
    '/analytics',
    '/exports',
    '/reports'
  ] 
};

export function middleware(req) {
  const user = process.env.PANEL_USER || process.env.DASHBOARD_USER || 'admin';
  const pass = process.env.PANEL_PASS || process.env.DASHBOARD_PASS || 'admin';
  
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  
  if (scheme === 'Basic' && encoded) {
    try {
      // Use TextDecoder instead of Buffer for Edge Runtime compatibility
      const decoded = atob(encoded);
      const index = decoded.indexOf(':');
      
      if (index === -1) {
        return createUnauthorizedResponse();
      }
      
      const u = decoded.substring(0, index);
      const p = decoded.substring(index + 1);
      
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Auth decode error:', error);
      return createUnauthorizedResponse();
    }
  }
  
  return createUnauthorizedResponse();
}

function createUnauthorizedResponse() {
  const res = new NextResponse('Authentication required', { 
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="CubaModel Bot Admin"'
    }
  });
  return res;
}
