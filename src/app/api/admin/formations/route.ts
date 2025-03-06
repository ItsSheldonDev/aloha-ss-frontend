// src/app/api/admin/formations/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { TypeFormation, StatutFormation } from '@prisma/client';

// GET - Récupérer toutes les formations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const month = searchParams.get('month');
    const status = searchParams.get('status');
    
    let whereClause: any = {};
    
    if (type) {
      whereClause.type = type as TypeFormation;
    }
    
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(+year, +monthNum - 1, 1);
      const endDate = new Date(+year, +monthNum, 0);
      whereClause.date = {
        gte: startDate,
        lte: endDate
      };
    }

    if (status) {
      whereClause.statut = status as StatutFormation;
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
        formateur: true,
        statut: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { inscriptions: true }
        }
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

// POST - Créer une formation
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const { titre, type, date, duree, placesTotal, prix, lieu, formateur } = data;

    // Validation basique
    if (!titre || !type || !date || !duree || !placesTotal || !prix || !lieu) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérification du type de formation
    if (!Object.values(TypeFormation).includes(type)) {
      return NextResponse.json(
        { error: 'Type de formation invalide' },
        { status: 400 }
      );
    }

    const formation = await prisma.formation.create({
      data: {
        titre,
        type,
        date: new Date(date),
        duree,
        placesTotal: parseInt(placesTotal),
        placesDisponibles: parseInt(placesTotal),
        prix: parseFloat(prix),
        lieu,
        formateur,
        statut: StatutFormation.PLANIFIEE
      }
    });

    return NextResponse.json(formation);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une formation
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    // Vérifier si la formation existe
    const existingFormation = await prisma.formation.findUnique({
      where: { id }
    });

    if (!existingFormation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la formation
    const formation = await prisma.formation.update({
      where: { id },
      data: {
        ...updateData,
        date: updateData.date ? new Date(updateData.date) : undefined,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(formation);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une formation
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    // Vérifier s'il y a des inscriptions associées
    const existingFormation = await prisma.formation.findUnique({
      where: { id },
      include: {
        _count: {
          select: { inscriptions: true }
        }
      }
    });

    if (!existingFormation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    if (existingFormation._count.inscriptions > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une formation avec des inscriptions' },
        { status: 400 }
      );
    }

    await prisma.formation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}