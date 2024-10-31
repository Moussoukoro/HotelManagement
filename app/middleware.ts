// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Définir l'interface pour le payload JWT
interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

// Étendre l'interface NextRequest pour inclure l'utilisateur
declare module 'next/server' {
  interface NextRequest {
    user?: JWTPayload;
  }
}

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie ? tokenCookie.value : null;
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isPublicPage = isAuthPage;

  // Si pas de token et page protégée -> redirection vers la page de connexion
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Si token et page d'auth -> redirection vers la page d'accueil
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Vérification du token
  if (token) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as JWTPayload;
      
      // Créer une nouvelle requête avec l'utilisateur
      const requestWithUser = new NextRequest(request.url, {
        ...request,
      });
      // @ts-ignore - Ajouter l'utilisateur à la requête
      requestWithUser.user = decoded;

      // Retourner la réponse avec la requête modifiée
      return NextResponse.next({
        request: requestWithUser,
      });
    } catch (error) {
      // Si le token n'est pas valide, redirigez l'utilisateur vers la page de connexion
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};