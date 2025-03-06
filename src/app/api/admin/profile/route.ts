// src/app/api/admin/profile/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Vérifions d'abord que le dossier existe
  const uploadDir = path.join(process.cwd(), 'public/uploads/avatars');
  try {
    await access(uploadDir);
  } catch {
    await mkdir(uploadDir, { recursive: true });
  }
  
  // Créer un nom de fichier sécurisé
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const filepath = path.join(uploadDir, filename);
  
  await writeFile(filepath, buffer);
  return `/uploads/avatars/${filename}`;
}

// GET - Récupérer les infos du profil
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.admin.findUnique({
      where: { id: session.user.id },
      select: {
        nom: true,
        prenom: true,
        email: true,
        avatar: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le profil
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File | null;

    // Si on a un avatar, on ne traite que ça
    if (avatarFile) {
      // Vérifications de sécurité
      if (avatarFile.size > 1024 * 1024) {
        return NextResponse.json(
          { error: "L'image ne doit pas dépasser 1MB" },
          { status: 400 }
        );
      }

      if (!avatarFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: "Le fichier doit être une image" },
          { status: 400 }
        );
      }

      const avatarPath = await saveFile(avatarFile);
      const updatedUser = await prisma.admin.update({
        where: { id: session.user.id },
        data: { avatar: avatarPath }
      });

      return NextResponse.json({
        success: true,
        user: {
          nom: updatedUser.nom,
          prenom: updatedUser.prenom,
          email: updatedUser.email,
          avatar: updatedUser.avatar
        }
      });
    }

    // Sinon on traite la mise à jour des autres infos
    const nom = formData.get('nom') as string;
    const prenom = formData.get('prenom') as string;
    const email = formData.get('email') as string;

    const updatedUser = await prisma.admin.update({
      where: { id: session.user.id },
      data: { nom, prenom, email }
    });

    return NextResponse.json({
      success: true,
      user: {
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}