import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    const filepath = path.join(process.cwd(), 'public/uploads/documents', document.filename)
    const fileBuffer = await readFile(filepath)

    // Incrémenter le compteur de téléchargements
    await prisma.document.update({
      where: { id: params.id },
      data: {
        downloads: {
          increment: 1
        }
      }
    })

    // Déterminer le type MIME
    const ext = path.extname(document.filename).toLowerCase()
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': fileBuffer.length.toString()
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}