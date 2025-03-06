// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const admins = await prisma.admin.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        createdAt: true,
        role: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const data = await request.json();
    const { email, password, nom, prenom } = data;

    // Validation des données
    if (!email || !password || !nom || !prenom) {
      return new NextResponse('Tous les champs sont requis', { status: 400 });
    }

    // Vérification du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse('Format d\'email invalide', { status: 400 });
    }

    // Vérification si l'email existe déjà
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return new NextResponse('Cet email est déjà utilisé', { status: 400 });
    }

    // Vérification de la force du mot de passe
    if (password.length < 8) {
      return new NextResponse('Le mot de passe doit contenir au moins 8 caractères', { status: 400 });
    }

    // Hashage du mot de passe
    const hashedPassword = await hash(password, 10);

    // Création de l'admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role: 'ADMIN' as Role
      }
    });

    // On ne renvoie pas le mot de passe dans la réponse
    const { password: _, ...adminWithoutPassword } = admin;
    return NextResponse.json(adminWithoutPassword);
    
  } catch (error) {
    console.error('Error creating admin:', error);
    return new NextResponse('Une erreur est survenue', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const data = await request.json();
    const { id, email, nom, prenom } = data;

    if (!id || !email || !nom || !prenom) {
      return new NextResponse('Tous les champs sont requis', { status: 400 });
    }

    // Vérification de l'existence de l'admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!existingAdmin) {
      return new NextResponse('Administrateur non trouvé', { status: 404 });
    }

    // Vérification si le nouvel email n'est pas déjà utilisé par un autre admin
    if (email !== existingAdmin.email) {
      const emailExists = await prisma.admin.findUnique({
        where: { email }
      });

      if (emailExists) {
        return new NextResponse('Cet email est déjà utilisé', { status: 400 });
      }
    }

    // Mise à jour de l'admin
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: { email, nom, prenom }
    });

    const { password: _, ...adminWithoutPassword } = updatedAdmin;
    return NextResponse.json(adminWithoutPassword);

  } catch (error) {
    console.error('Error updating admin:', error);
    return new NextResponse('Une erreur est survenue', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return new NextResponse('ID manquant', { status: 400 });
    }

    // Vérification de l'existence de l'admin
    const admin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!admin) {
      return new NextResponse('Administrateur non trouvé', { status: 404 });
    }

    // Empêcher la suppression d'un SUPER_ADMIN
    if (admin.role === 'SUPER_ADMIN') {
      return new NextResponse('Impossible de supprimer un super administrateur', { status: 403 });
    }

    await prisma.admin.delete({
      where: { id }
    });

    return new NextResponse('Administrateur supprimé avec succès', { status: 200 });
    
  } catch (error) {
    console.error('Error deleting admin:', error);
    return new NextResponse('Une erreur est survenue', { status: 500 });
  }
}