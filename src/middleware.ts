import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérifier si c'est une route admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Si c'est la page de login, laisser passer
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Pour les autres routes admin, vérifier l'authentification côté client
    // (la vérification réelle se fait dans les composants)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
