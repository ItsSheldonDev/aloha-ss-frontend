import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer toutes les données
    const [admins, formations, inscriptions, settings] = await Promise.all([
      prisma.admin.findMany({
        select: {
          id: true,
          email: true,
          nom: true,
          prenom: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.formation.findMany(),
      prisma.inscription.findMany(),
      prisma.setting.findMany()
    ])

    const backup = {
      metadata: {
        version: "1.0",
        exportDate: new Date().toISOString(),
        exportedBy: session.user.email
      },
      data: {
        admins,
        formations,
        inscriptions,
        settings
      }
    }

    // Mettre à jour la date de dernière sauvegarde
    await prisma.setting.upsert({
      where: { key: 'lastBackup' },
      create: {
        key: 'lastBackup',
        value: new Date().toISOString()
      },
      update: {
        value: new Date().toISOString()
      }
    })

    // Renvoyer le fichier JSON
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=backup-${new Date().toISOString().slice(0,10)}.json`
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    )
  }
}