import { NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function DELETE(
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

    // Supprimer le fichier
    const filepath = path.join(process.cwd(), 'public/uploads/documents', document.filename)
    try {
      await unlink(filepath)
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error)
      // On continue même si le fichier n'existe pas
    }

    // Supprimer l'entrée de la base de données
    await prisma.document.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}