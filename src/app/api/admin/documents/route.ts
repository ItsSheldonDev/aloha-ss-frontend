import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { DocumentCategory } from '@prisma/client'

// GET - Récupérer tous les documents (admin)
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    
    const where = categoryParam && categoryParam !== 'all' 
      ? { category: categoryParam as DocumentCategory }
      : {}
    
    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(documents)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Ajouter un document (admin)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const category = formData.get('category') as DocumentCategory

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Vérifier la taille du fichier (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux' },
        { status: 400 }
      )
    }

    // Vérifier que la catégorie est valide
    if (!Object.values(DocumentCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Catégorie invalide' },
        { status: 400 }
      )
    }

    // Créer le dossier si nécessaire
    const uploadDir = path.join(process.cwd(), 'public/uploads/documents')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {}

    // Sauvegarder le fichier
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
    const filepath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    // Créer l'entrée dans la base de données
    const document = await prisma.document.create({
      data: {
        title,
        filename,
        category,
        size: file.size,
        downloads: 0
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}