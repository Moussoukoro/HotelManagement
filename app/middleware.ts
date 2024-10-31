import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Interface pour le payload JWT
interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie ? tokenCookie.value : null;

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isPublicPage = isAuthPage;

  // Gestion des tokens et redirections
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token) {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

      // Ajouter l'utilisateur à la requête de manière type-safe
      Object.assign(request, { user: decoded });

      return NextResponse.next();
    } catch (_error) {
      // Utiliser _error pour indiquer une variable intentionnellement non utilisée
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};