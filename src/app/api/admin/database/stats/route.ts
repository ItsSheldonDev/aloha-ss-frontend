// src/app/api/admin/database/stats/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const [users, formations, inscriptions, settings] = await Promise.all([
      prisma.admin.count(),
      prisma.formation.count(),
      prisma.inscription.count(),
      prisma.setting.findFirst({
        where: { key: 'lastBackup' }
      })
    ])

    return NextResponse.json({
      users,
      formations,
      inscriptions,
      lastBackup: settings?.value || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 