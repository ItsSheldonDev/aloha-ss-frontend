// src/app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

interface SettingsModel {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}

// Fonction utilitaire pour obtenir tous les paramètres
async function getAllSettings(): Promise<{ [key: string]: string }> {
    const settings = await prisma.setting.findMany();  // Changé ici
    return settings.reduce((acc: { [key: string]: string }, setting: SettingsModel) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }

// GET : Récupérer tous les paramètres
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const settings = await getAllSettings();
    
    // Structure les paramètres dans le format attendu par le frontend
    const formattedSettings = {
      contact: {
        email: settings['contact.email'] || '',
        phone: settings['contact.phone'] || '',
        address: settings['contact.address'] || ''
      },
      social: {
        facebook: settings['social.facebook'] || '',
        instagram: settings['social.instagram'] || ''
      },
      notifications: {
        emailInscription: settings['notifications.emailInscription'] === 'true',
        emailContact: settings['notifications.emailContact'] === 'true'
      }
    };

    return NextResponse.json(formattedSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Interface pour les paramètres reçus
interface SettingsData {
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
  };
  notifications: {
    emailInscription: boolean;
    emailContact: boolean;
  };
}

// POST : Mettre à jour les paramètres
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const data: SettingsData = await request.json();
    
    // Aplatir l'objet des paramètres
    const flattenedSettings: { [key: string]: string } = {
      'contact.email': data.contact.email,
      'contact.phone': data.contact.phone,
      'contact.address': data.contact.address,
      'social.facebook': data.social.facebook,
      'social.instagram': data.social.instagram,
      'notifications.emailInscription': data.notifications.emailInscription.toString(),
      'notifications.emailContact': data.notifications.emailContact.toString()
    };

    // Mettre à jour ou créer chaque paramètre
    for (const [key, value] of Object.entries(flattenedSettings)) {
        await prisma.setting.upsert({  // Changé ici
            where: { key },
            create: { key, value },
            update: { value }
          });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}