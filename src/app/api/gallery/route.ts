// src/app/api/gallery/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Category } from '@prisma/client'

interface ImageData {
  id: string;
  filename: string;
  alt: string;
  category: Category;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    const mode = searchParams.get('mode')

    let images: ImageData[];

    switch (mode) {
      case 'all':
        const categories = Object.values(Category)
        const imagesByCategory = await Promise.all(
          categories.map(async (category) => {
            const categoryImages = await prisma.image.findMany({
              where: { category },
              select: {
                id: true,
                filename: true,
                alt: true,
                category: true
              },
              orderBy: { createdAt: 'desc' }
            })
            return {
              category,
              images: categoryImages.map(img => ({
                ...img,
                url: `/uploads/galerie/${img.filename}`
              }))
            }
          })
        )
        return NextResponse.json(imagesByCategory)

      case 'random':
        const randomImages = await prisma.$queryRaw<ImageData[]>`
          SELECT id, filename, alt, category 
          FROM "Image" 
          ORDER BY RANDOM() 
          LIMIT 4
        `
        return NextResponse.json(
          randomImages.map(img => ({
            ...img,
            url: `/uploads/galerie/${img.filename}`
          }))
        )

      default:
        const where = categoryParam 
          ? { category: categoryParam as Category }
          : {}

        images = await prisma.image.findMany({
          select: {
            id: true,
            filename: true,
            alt: true,
            category: true
          },
          where: where,
          orderBy: { createdAt: 'desc' }
        })

        const imagesWithUrls = images.map((image) => ({
          ...image,
          url: `/uploads/galerie/${image.filename}`
        }))

        return NextResponse.json(imagesWithUrls)
    }

  } catch (error) {
    console.error('Gallery API Error:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}