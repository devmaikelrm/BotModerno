
import { NextResponse } from 'next/server';
export const config = { matcher: ['/admin/:path*','/api/admin/:path*'] };
export function middleware(req){
  const user = process.env.PANEL_USER || process.env.DASHBOARD_USER || 'admin';
  const pass = process.env.PANEL_PASS || process.env.DASHBOARD_PASS || 'admin';
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme === 'Basic' && encoded){
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const index = decoded.indexOf(':');
    const u = decoded.substring(0, index);
    const p = decoded.substring(index + 1);
    if (u === user && p === pass) return NextResponse.next();
  }
  const res = new NextResponse('Authentication required', { status: 401 });
  res.headers.set('WWW-Authenticate', 'Basic realm="BotModerno Admin"');
  return res;
}
