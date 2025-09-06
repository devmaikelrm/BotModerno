// web-panel/middleware.js
// Edge-compatible Basic Auth using atob (no Buffer)
export const config = { matcher: ['/((?!_next/|api/health).*)'] };

function parseAuth(header) {
  if (!header?.startsWith('Basic ')) return null;
  const b64 = header.slice(6);
  const [u, p] = atob(b64).split(':');
  return { u, p };
}

export default function middleware(req) {
  const url = new URL(req.url);
  const auth = parseAuth(req.headers.get('authorization'));
  const USER = process.env.PANEL_USER;
  const PASS = process.env.PANEL_PASS;

  if (!auth || auth.u !== USER || auth.p !== PASS) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Panel"' }
    });
  }
  return undefined;
}
