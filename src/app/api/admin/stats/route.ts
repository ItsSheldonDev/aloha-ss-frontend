import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const [sessionsAVenir, totalInscriptions, placesDisponibles] = await Promise.all([
      prisma.formation.count({
        where: {
          date: {
            gte: new Date()
          }
        }
      }),
      prisma.inscription.count(),
      prisma.formation.aggregate({
        where: {
          date: {
            gte: new Date()
          }
        },
        _sum: {
          placesDisponibles: true
        }
      })
    ]);

    return NextResponse.json({
      sessionsAVenir,
      totalInscriptions,
      placesDisponibles: placesDisponibles._sum.placesDisponibles || 0,
      tauxReussite: 98 // À implémenter avec un vrai calcul plus tard
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}