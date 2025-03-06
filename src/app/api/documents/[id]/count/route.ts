// src/app/api/documents/[id]/count/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type Params = {
  params: { id: string }
}

// Fonction utilitaire pour extraire l'ID du document de l'URL
const getDocumentId = (url: string) => {
  const segments = url.split('/');
  return segments[segments.length - 2];
};

export async function POST(request: Request, { params }: Params) {
  try {
    const documentId = getDocumentId(request.url);

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        downloads: {
          increment: 1
        }
      },
      select: {
        downloads: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      downloads: document.downloads 
    });
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du compteur' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const documentId = getDocumentId(request.url);

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { downloads: true }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ downloads: document.downloads });
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du compteur' },
      { status: 500 }
    );
  }
}