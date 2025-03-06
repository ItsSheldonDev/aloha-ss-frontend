// src/app/api/admin/inscriptions/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { StatutInscription } from '@prisma/client';

// GET - Récupérer toutes les inscriptions
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const formationId = searchParams.get('formationId');
    const search = searchParams.get('search')?.toLowerCase();
    
    let whereClause: any = {};
    
    if (status) {
      whereClause.statut = status as StatutInscription;
    }
    
    if (formationId) {
      whereClause.formationId = formationId;
    }

    if (search) {
      whereClause.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const inscriptions = await prisma.inscription.findMany({
      where: whereClause,
      include: {
        formation: {
          select: {
            titre: true,
            type: true,
            date: true,
            duree: true,
            lieu: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(inscriptions);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une inscription
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      nom, 
      prenom, 
      email, 
      telephone, 
      dateNaissance, 
      formationId,
      message
    } = data;

    // Validation basique
    if (!nom || !prenom || !email || !telephone || !dateNaissance || !formationId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier la formation
    const formation = await prisma.formation.findUnique({
      where: { id: formationId }
    });

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier les places disponibles
    if (formation.placesDisponibles <= 0) {
      return NextResponse.json(
        { error: 'Plus de places disponibles' },
        { status: 400 }
      );
    }

    // Créer l'inscription
    const inscription = await prisma.inscription.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        dateNaissance: new Date(dateNaissance),
        message,
        formationId,
        statut: StatutInscription.EN_ATTENTE
      },
      include: {
        formation: true
      }
    });

    // Mettre à jour les places disponibles
    await prisma.formation.update({
      where: { id: formationId },
      data: {
        placesDisponibles: {
          decrement: 1
        }
      }
    });

    // Envoyer un email de confirmation à l'utilisateur
    await sendEmail({
      to: email,
      subject: `Confirmation de réception - Formation ${formation.titre}`,
      template: 'INSCRIPTION',
      data: {
        prenom,
        nom,
        formation: formation.titre,
        date: formation.date,
        lieu: formation.lieu,
        duree: formation.duree
      }
    });

    // Envoyer une notification aux administrateurs
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'Nouvelle inscription',
      template: 'NOTIFICATION',
      data: {
        inscription,
        formation
      }
    });

    return NextResponse.json(inscription);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une inscription
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

    // Vérifier si l'inscription existe
    const existingInscription = await prisma.inscription.findUnique({
      where: { id },
      include: {
        formation: true
      }
    });

    if (!existingInscription) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour l'inscription
    const inscription = await prisma.inscription.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        formation: true
      }
    });

    // Si le statut change pour ACCEPTEE ou REFUSEE, envoyer un email
    if (updateData.statut && updateData.statut !== existingInscription.statut) {
      if (updateData.statut === StatutInscription.ACCEPTEE) {
        await sendEmail({
          to: inscription.email,
          subject: `Inscription acceptée - ${inscription.formation.titre}`,
          template: 'INSCRIPTION_ACCEPTEE',
          data: {
            prenom: inscription.prenom,
            nom: inscription.nom,
            formation: inscription.formation.titre,
            date: inscription.formation.date,
            lieu: inscription.formation.lieu
          }
        });
      } else if (updateData.statut === StatutInscription.REFUSEE) {
        await sendEmail({
          to: inscription.email,
          subject: `Inscription refusée - ${inscription.formation.titre}`,
          template: 'INSCRIPTION_REFUSEE',
          data: {
            prenom: inscription.prenom,
            nom: inscription.nom,
            formation: inscription.formation.titre
          }
        });
      }
    }

    return NextResponse.json(inscription);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une inscription
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

    // Vérifier si l'inscription existe
    const inscription = await prisma.inscription.findUnique({
      where: { id },
      include: {
        formation: true
      }
    });

    if (!inscription) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    // Si l'inscription était acceptée, incrémenter le nombre de places disponibles
    if (inscription.statut === 'ACCEPTEE') {
      await prisma.formation.update({
        where: { id: inscription.formationId },
        data: {
          placesDisponibles: {
            increment: 1
          }
        }
      });
    }

    // Supprimer l'inscription
    await prisma.inscription.delete({
      where: { id }
    });

    // Envoyer un email d'annulation si nécessaire
    await sendEmail({
      to: inscription.email,
      subject: `Annulation de votre inscription - ${inscription.formation.titre}`,
      template: 'INSCRIPTION_ANNULEE',
      data: {
        prenom: inscription.prenom,
        nom: inscription.nom,
        formation: inscription.formation.titre,
        date: inscription.formation.date
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Inscription supprimée avec succès'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}