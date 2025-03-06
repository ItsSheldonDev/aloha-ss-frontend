// src/app/admin/dashboard/settings/page.tsx
"use client"

import { useSession } from 'next-auth/react'
import { Card } from "@nextui-org/react"
import { UserCircle, Settings2, UserCog, Database, FileText, Mail } from "lucide-react"
import { useRouter } from 'next/navigation'

interface SettingCard {
  title: string
  description: string
  icon: any
  href: string
  requireSuperAdmin?: boolean
  size?: 'small' | 'large'
}

const settingsCards: SettingCard[] = [
  {
    title: "Mon profil",
    description: "Gérer vos informations personnelles",
    icon: UserCircle,
    href: "profile",
    size: 'large'
  },
  {
    title: "Paramètres généraux",
    description: "Configuration du site",
    icon: Settings2,
    href: "general",
    size: 'small'
  },
  {
    title: "Documents",
    description: "Gérer les fichiers et documents",
    icon: FileText,
    href: "documents",
    size: 'small'
  },
  {
    title: "Emails",
    description: "Configuration des modèles d'emails",
    icon: Mail,
    href: "emails",
    size: 'small'
  },
  {
    title: "Administrateurs",
    description: "Gérer les comptes admin",
    icon: UserCog,
    href: "users",
    requireSuperAdmin: true,
    size: 'small'
  },
  {
    title: "Base de donnees",
    description: "Sauvegardes et restaurations",
    icon: Database,
    href: "database",
    requireSuperAdmin: true,
    size: 'small'
  }
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  const visibleCards = settingsCards.filter(card =>
    !card.requireSuperAdmin || isSuperAdmin
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Parametres</h1>
        <p className="text-gray-500">
          Configuration de votre espace administrateur
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 auto-rows-[140px]">
        {visibleCards.map((card, index) => (
          <Card 
            key={index}
            isPressable
            onPress={() => router.push(`/admin/dashboard/settings/${card.href}`)}
            className={`group transition-all duration-200 
              ${card.size === 'large' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
              hover:shadow-lg hover:-translate-y-1 bg-white overflow-hidden`}
          >
            <div className="p-5 h-full relative">
              {/* Fond décoratif */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              
              {/* Contenu */}
              <div className="relative h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="font-semibold text-lg">
                    {card.title}
                  </h3>
                  <p className={`text-sm text-gray-500 mt-1 
                    ${card.size === 'large' ? 'line-clamp-2' : 'line-clamp-1'}`}>
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}