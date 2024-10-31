// app/next.d.ts
import { NextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest {
    user?: any; // Vous pouvez remplacer `any` par un type plus spécifique si vous avez un type défini pour l'utilisateur
  }
}
