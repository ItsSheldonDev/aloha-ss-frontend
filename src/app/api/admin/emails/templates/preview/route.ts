// src/app/api/admin/emails/templates/preview/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Handlebars from 'handlebars';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Contenu manquant' },
        { status: 400 }
      );
    }

    // Compilation du template avec des données de test
    const template = Handlebars.compile(content);
    const html = template({
      name: "John Doe",
      email: "john@example.com",
      date: new Date().toLocaleDateString('fr-FR'),
      formation: "PSC1",
      // Ajoutez d'autres variables de test selon vos besoins
    });

    return NextResponse.json({ html });
  } catch (error) {
    console.error('Error previewing template:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}