import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { Category } from '@prisma/client'
import { auth } from '@/lib/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'galerie')

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-z0-9.]/gi, '-').toLowerCase()
}

async function validateImage(file: File) {
  const validationErrors = []
  
  if (!file) {
    validationErrors.push('Aucun fichier fourni')
    return validationErrors
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    validationErrors.push(`Type de fichier non autorisé. Types acceptés: ${ALLOWED_TYPES.join(', ')}`)
  }

  if (file.size > MAX_FILE_SIZE) {
    validationErrors.push(`Fichier trop volumineux. Maximum: ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
  }

  return validationErrors
}

export async function POST(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Création du dossier d'upload si nécessaire
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    const formData = await request.formData()
    const file = formData.get('image') as File
    const alt = formData.get('alt') as string
    const categoryValue = formData.get('category') as string

    // Validation des données requises
    if (!file || !alt || !categoryValue) {
      return NextResponse.json({ 
        error: 'Données manquantes',
        details: 'Image, description et catégorie sont requises'
      }, { status: 400 })
    }

    // Validation de la catégorie
    if (!Object.values(Category).includes(categoryValue as Category)) {
      return NextResponse.json({ 
        error: 'Catégorie invalide',
        details: `Catégories valides: ${Object.values(Category).join(', ')}`
      }, { status: 400 })
    }

    // Validation de l'image
    const validationErrors = await validateImage(file)
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation échouée',
        details: validationErrors 
      }, { status: 400 })
    }

    // Préparation et sauvegarde du fichier
    const filename = sanitizeFilename(`${Date.now()}-${file.name}`)
    const filepath = path.join(UPLOAD_DIR, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    try {
      await fs.writeFile(filepath, buffer)
    } catch (error) {
      console.error('Erreur écriture fichier:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de l\'enregistrement du fichier',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }, { status: 500 })
    }

    // Création de l'entrée en base de données
    const image = await prisma.image.create({
      data: { 
        filename,
        alt,
        category: categoryValue as Category
      }
    })

    return NextResponse.json({
      success: true,
      data: image
    })

  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    
    const where = categoryParam 
      ? { category: categoryParam as Category }
      : {}
    
    const images = await prisma.image.findMany({
      where,
      select: {
        id: true,
        filename: true,
        alt: true,
        category: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: images
    })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id, alt, categoryValue } = await request.json()
    
    if (!id || !alt || !categoryValue) {
      return NextResponse.json({ 
        error: 'Données manquantes',
        details: 'ID, description et catégorie sont requis'
      }, { status: 400 })
    }

    if (!Object.values(Category).includes(categoryValue as Category)) {
      return NextResponse.json({ 
        error: 'Catégorie invalide',
        details: `Catégories valides: ${Object.values(Category).join(', ')}`
      }, { status: 400 })
    }

    const image = await prisma.image.update({
      where: { id },
      data: { 
        alt,
        category: categoryValue as Category
      }
    })
    
    return NextResponse.json({
      success: true,
      data: image
    })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 })
    }
    console.error('Erreur serveur:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ 
        error: 'ID manquant',
        details: 'L\'ID de l\'image est requis'
      }, { status: 400 })
    }

    const image = await prisma.image.delete({
      where: { id }
    })

    // Suppression du fichier
    try {
      const filepath = path.join(UPLOAD_DIR, image.filename)
      await fs.unlink(filepath)
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error)
      // On continue même si la suppression du fichier échoue
    }

    return NextResponse.json({
      success: true,
      data: image
    })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 })
    }
    console.error('Erreur serveur:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}