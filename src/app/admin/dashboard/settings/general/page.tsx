// src/app/admin/dashboard/settings/general/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader,
  Input,
  Button,
  Textarea,
  Divider,
  Switch,
  Spinner
} from "@nextui-org/react"
import { MailIcon, PhoneIcon, MapPinIcon, FacebookIcon, InstagramIcon } from "lucide-react"
import { toast } from 'sonner'

interface SiteSettings {
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    facebook: string
    instagram: string
  }
  notifications: {
    emailInscription: boolean
    emailContact: boolean
  }
}

const defaultSettings: SiteSettings = {
  contact: {
    email: '',
    phone: '',
    address: ''
  },
  social: {
    facebook: '',
    instagram: ''
  },
  notifications: {
    emailInscription: true,
    emailContact: true
  }
}

export default function GeneralSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  // Charger les paramètres au chargement de la page
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (!response.ok) throw new Error('Erreur de chargement des paramètres')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      toast.error('Erreur lors du chargement des paramètres')
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) throw new Error('Erreur de sauvegarde')
      
      toast.success('Paramètres enregistrés avec succès')
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement des paramètres')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Parametres generaux</h1>
        <p className="text-gray-500 mt-2">
          Configurez les paramètres généraux de votre site
        </p>
      </div>

      <div className="grid gap-6">
        {/* Informations de contact */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Informations de contact</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Email"
              placeholder="Email de contact"
              value={settings.contact.email}
              onChange={(e) => setSettings({
                ...settings,
                contact: { ...settings.contact, email: e.target.value }
              })}
              startContent={<MailIcon className="w-4 h-4 text-gray-400" />}
            />
            <Input
              label="Téléphone"
              placeholder="Numéro de téléphone"
              value={settings.contact.phone}
              onChange={(e) => setSettings({
                ...settings,
                contact: { ...settings.contact, phone: e.target.value }
              })}
              startContent={<PhoneIcon className="w-4 h-4 text-gray-400" />}
            />
            <Textarea
              label="Adresse"
              placeholder="Adresse complète"
              value={settings.contact.address}
              onChange={(e) => setSettings({
                ...settings,
                contact: { ...settings.contact, address: e.target.value }
              })}
              startContent={<MapPinIcon className="w-4 h-4 text-gray-400 mt-2" />}
            />
          </CardBody>
        </Card>

        {/* Réseaux sociaux */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Réseaux sociaux</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Facebook"
              placeholder="URL de votre page Facebook"
              value={settings.social.facebook}
              onChange={(e) => setSettings({
                ...settings,
                social: { ...settings.social, facebook: e.target.value }
              })}
              startContent={<FacebookIcon className="w-4 h-4 text-gray-400" />}
            />
            <Input
              label="Instagram"
              placeholder="URL de votre compte Instagram"
              value={settings.social.instagram}
              onChange={(e) => setSettings({
                ...settings,
                social: { ...settings.social, instagram: e.target.value }
              })}
              startContent={<InstagramIcon className="w-4 h-4 text-gray-400" />}
            />
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Notifications</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Notifications d'inscription</p>
                <p className="text-sm text-gray-500">Recevoir un email lors d'une nouvelle inscription</p>
              </div>
              <Switch
                checked={settings.notifications.emailInscription}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { 
                    ...settings.notifications, 
                    emailInscription: e.target.checked 
                  }
                })}
              />
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Notifications de contact</p>
                <p className="text-sm text-gray-500">Recevoir un email lors d'une demande de contact</p>
              </div>
              <Switch
                checked={settings.notifications.emailContact}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { 
                    ...settings.notifications, 
                    emailContact: e.target.checked 
                  }
                })}
              />
            </div>
          </CardBody>
        </Card>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <Button
            color="primary"
            size="lg"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  )
}