import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { DocumentCategory } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    
    const where = categoryParam 
      ? { category: categoryParam as DocumentCategory }
      : {}
    
    const documents = await prisma.document.findMany({
      where,
      select: {
        id: true,
        title: true,
        filename: true,
        category: true,
        createdAt: true,
        size: true
      },
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