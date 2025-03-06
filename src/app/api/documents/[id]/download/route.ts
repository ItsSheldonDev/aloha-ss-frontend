// src/app/api/documents/[id]/download/route.ts
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const segments = request.url.split('/');
    const documentId = segments[segments.length - 2];

    // Récupérer d'abord le document
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    // Construire l'URL absolue en utilisant l'URL de la requête
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Incrémenter le compteur via la route count
    await fetch(`${baseUrl}/api/documents/${documentId}/count`, {
      method: 'POST'
    });

    const filepath = path.join(process.cwd(), 'public/uploads/documents', document.filename);
    const fileBuffer = await readFile(filepath);

    const ext = path.extname(document.filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': fileBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}