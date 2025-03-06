// src/app/api/news/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // On récupère les paramètres d'URL potentiels
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const page = Number(searchParams.get('page')) || 1;
    const itemsPerPage = Number(limit) || 10;

    // On calcule le nombre d'éléments à sauter pour la pagination
    const skip = (page - 1) * itemsPerPage;

    // On récupère à la fois les news et le total
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where: {
          published: true // On ne récupère que les news publiées
        },
        orderBy: {
          createdAt: 'desc' // Les plus récentes d'abord
        },
        take: itemsPerPage,
        skip: skip,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: true
        }
      }),
      prisma.news.count({
        where: {
          published: true
        }
      })
    ]);

    // On calcule le nombre total de pages
    const totalPages = Math.ceil(total / itemsPerPage);

    return NextResponse.json({
      news,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        itemsPerPage
      }
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des actualités' },
      { status: 500 }
    );
  }
}