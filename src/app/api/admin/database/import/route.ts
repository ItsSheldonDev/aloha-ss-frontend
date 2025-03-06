import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    const fileContent = await file.text()
    const backup = JSON.parse(fileContent)

    // Vérification basique du format
    if (!backup.date || !backup.data) {
      return NextResponse.json(
        { error: 'Format de fichier invalide' },
        { status: 400 }
      )
    }

    // Transaction pour assurer l'intégrité des données
    await prisma.$transaction(async (tx) => {
      // Réinitialiser les données existantes
      await tx.inscription.deleteMany()
      await tx.formation.deleteMany()
      await tx.setting.deleteMany()

      // Restaurer les données (sauf les admins pour la sécurité)
      if (backup.data.formations.length > 0) {
        await tx.formation.createMany({
          data: backup.data.formations.map((f: any) => ({
            ...f,
            date: new Date(f.date),
            createdAt: new Date(f.createdAt),
            updatedAt: new Date(f.updatedAt)
          }))
        })
      }

      if (backup.data.inscriptions.length > 0) {
        await tx.inscription.createMany({
          data: backup.data.inscriptions.map((i: any) => ({
            ...i,
            dateNaissance: new Date(i.dateNaissance),
            createdAt: new Date(i.createdAt),
            updatedAt: new Date(i.updatedAt)
          }))
        })
      }

      if (backup.data.settings.length > 0) {
        await tx.setting.createMany({
          data: backup.data.settings
        })
      }

      // Mettre à jour la date de dernière restauration
      await tx.setting.upsert({
        where: { key: 'lastRestore' },
        create: {
          key: 'lastRestore',
          value: new Date().toISOString()
        },
        update: {
          value: new Date().toISOString()
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'import' },
      { status: 500 }
    )
  }
}