// src/app/api/admin/profile/password/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hash, compare } from 'bcrypt';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Vérifier l'ancien mot de passe
    const user = await prisma.admin.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const validPassword = await compare(currentPassword, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
    }

    // Hasher et mettre à jour le nouveau mot de passe
    const hashedPassword = await hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}