import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Sauvegarder les admins actuels
    const currentAdmins = await prisma.admin.findMany({
      where: { role: 'SUPER_ADMIN' }
    })

    // Transaction pour réinitialiser la base de données
    await prisma.$transaction(async (tx) => {
      // Supprimer toutes les données
      await tx.inscription.deleteMany()
      await tx.formation.deleteMany()
      await tx.setting.deleteMany()
      await tx.admin.deleteMany()

      // Restaurer uniquement les super admins
      if (currentAdmins.length > 0) {
        await tx.admin.createMany({
          data: currentAdmins
        })
      }

      // Créer un enregistrement pour le reset
      await tx.setting.create({
        data: {
          key: 'lastReset',
          value: new Date().toISOString()
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    )
  }
}