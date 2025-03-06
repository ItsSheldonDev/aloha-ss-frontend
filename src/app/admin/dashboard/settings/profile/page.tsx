"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Avatar,
  Spinner
} from "@nextui-org/react"
import { 
  UserCircle, 
  Mail, 
  Key, 
  UploadCloud
} from 'lucide-react'
import { toast } from 'sonner'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function Profile() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
  })
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Chargement initial des données
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile')
        if (!response.ok) throw new Error('Erreur chargement profil')
        const data = await response.json()
        
        setFormData({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
        })
        if (data.avatar) {
          setPreviewUrl(data.avatar)
        }
      } catch (error) {
        toast.error("Erreur lors du chargement du profil")
      } finally {
        setIsLoadingInitial(false)
      }
    }

    loadProfile()
  }, [])

  // Gérer le changement d'avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 1MB")
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier doit être une image")
      return
    }

    const tempUrl = URL.createObjectURL(file)
    setPreviewUrl(tempUrl)

    const formData = new FormData()
    formData.append('avatar', file)
    
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) throw new Error('Erreur upload')

      const data = await response.json()
      if (data.user?.avatar) {
        setPreviewUrl(data.user.avatar)
      }
      
      await update()
      toast.success('Photo de profil mise à jour')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la photo')
      if (session?.user?.avatar) {
        setPreviewUrl(session.user.avatar)
      }
    }
  }

  // Mettre à jour le profil
  const handleUpdateProfile = async () => {
    setIsLoading(true)
    
    const formDataToSend = new FormData()
    formDataToSend.append('nom', formData.nom)
    formDataToSend.append('prenom', formData.prenom)
    formDataToSend.append('email', formData.email)

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Erreur mise à jour')

      await update()
      toast.success('Profil mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setIsLoading(false)
    }
  }

  // Changer le mot de passe
  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setIsLoadingPassword(true)
    try {
      const response = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur changement mot de passe')
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Mot de passe modifié avec succès')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erreur lors du changement de mot de passe')
      }
    } finally {
      setIsLoadingPassword(false)
    }
  }

  if (isLoadingInitial) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Photo de profil */}
      <Card className="border border-default-200">
        <CardBody className="p-8">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <Avatar
                src={previewUrl || "/images/admin/avatar-placeholder.png"}
                className="w-32 h-32"
                fallback={<UserCircle className="w-16 h-16" />}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/0 
                         group-hover:bg-black/40 transition-all duration-300 
                         rounded-full cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <UploadCloud className="w-10 h-10 text-white" />
              </label>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-default-900 mb-2">Photo de profil</h3>
              <p className="text-default-500 text-sm">
                Choisissez une image au format JPG ou PNG. Taille maximale : 1MB.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Informations personnelles */}
      <Card className="border border-default-200">
        <CardHeader className="px-8 pt-8 pb-0">
          <h3 className="text-xl font-bold text-default-900">
            Informations personnelles
          </h3>
        </CardHeader>
        <CardBody className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Nom"
              labelPlacement="outside"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              startContent={<UserCircle className="w-4 h-4 text-default-400" />}
              classNames={{
                label: "font-medium"
              }}
            />
            <Input
              label="Prénom"
              labelPlacement="outside"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              startContent={<UserCircle className="w-4 h-4 text-default-400" />}
              classNames={{
                label: "font-medium"
              }}
            />
          </div>
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="votre@email.com"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            startContent={<Mail className="w-4 h-4 text-default-400" />}
            classNames={{
              label: "font-medium"
            }}
          />
          <div className="flex justify-end pt-4">
            <Button
              color="primary"
              size="lg"
              onClick={handleUpdateProfile}
              isLoading={isLoading}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Changer le mot de passe */}
      <Card className="border border-default-200">
        <CardHeader className="px-8 pt-8 pb-0">
          <h3 className="text-xl font-bold text-default-900">
            Changer le mot de passe
          </h3>
        </CardHeader>
        <CardBody className="p-8 space-y-8">
          <Input
            label="Mot de passe actuel"
            labelPlacement="outside"
            type="password"
            placeholder="••••••••"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            startContent={<Key className="w-4 h-4 text-default-400" />}
            classNames={{
              label: "font-medium"
            }}
          />
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Nouveau mot de passe"
              labelPlacement="outside"
              type="password"
              placeholder="••••••••"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              startContent={<Key className="w-4 h-4 text-default-400" />}
              classNames={{
                label: "font-medium"
              }}
            />
            <Input
              label="Confirmer le mot de passe"
              labelPlacement="outside"
              type="password"
              placeholder="••••••••"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              startContent={<Key className="w-4 h-4 text-default-400" />}
              classNames={{
                label: "font-medium"
              }}
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button
              color="primary"
              size="lg"
              onClick={handleUpdatePassword}
              isLoading={isLoadingPassword}
            >
              Modifier le mot de passe
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}