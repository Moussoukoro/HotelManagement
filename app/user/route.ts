// app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb'; 

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis le middleware
    const user = request.user;
    
    if (!user || !user.userId) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les informations complètes de l'utilisateur depuis la base de données
    const userInfo = await prisma.user.findUnique({
      where: {
        id: user.userId
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        // On exclut explicitement le mot de passe
      }
    });

    if (!userInfo) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(userInfo);

  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}