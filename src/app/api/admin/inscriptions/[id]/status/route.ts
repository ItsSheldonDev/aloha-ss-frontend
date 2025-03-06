import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { statut } = await request.json();
    
    const inscription = await prisma.inscription.update({
      where: { id: params.id },
      data: { statut },
      include: {
        formation: true
      }
    });

    // Mettre à jour les places disponibles si acceptée
    if (statut === 'ACCEPTEE') {
      await prisma.formation.update({
        where: { id: inscription.formationId },
        data: {
          placesDisponibles: {
            decrement: 1
          }
        }
      });

      // Envoyer email de confirmation
      await sendEmail({
        to: inscription.email,
        subject: "Confirmation d'inscription",
        template: "INSCRIPTION",
        data: {
          inscription,
          formation: inscription.formation,
          prenom: inscription.prenom,
          nom: inscription.nom,
          date: inscription.formation.date,
          formation_titre: inscription.formation.titre,
          lieu: inscription.formation.lieu,
          duree: inscription.formation.duree,
          prix: inscription.formation.prix
        }
      });
    } else if (statut === 'REFUSEE') {
      // Envoyer email de refus
      await sendEmail({
        to: inscription.email,
        subject: "Inscription refusée",
        template: "INSCRIPTION_REFUSEE",
        data: {
          inscription,
          formation: inscription.formation,
          prenom: inscription.prenom,
          nom: inscription.nom
        }
      });
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