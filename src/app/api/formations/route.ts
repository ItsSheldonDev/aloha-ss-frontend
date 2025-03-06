// src/app/api/formations/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TypeFormation, StatutFormation } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const month = searchParams.get('month');
    
    let whereClause: any = {
      statut: {
        in: ['PLANIFIEE', 'EN_COURS']
      },
      date: {
        gte: new Date()
      }
    };
    
    if (type && type !== 'all') {
      whereClause.type = type as TypeFormation;
    }
    
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
      whereClause.date = {
        gte: startDate,
        lte: endDate
      };
    }
    
    const formations = await prisma.formation.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
      select: {
        id: true,
        titre: true,
        type: true,
        date: true,
        duree: true,
        placesTotal: true,
        placesDisponibles: true,
        prix: true,
        lieu: true,
        statut: true,
        formateur: true
      }
    });

    return NextResponse.json(formations);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}