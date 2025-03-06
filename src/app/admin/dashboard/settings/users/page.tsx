'use client'

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody,
  ModalFooter,
  Input, 
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Spinner
} from "@nextui-org/react"
import { 
  PlusIcon,
  PencilSquareIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon 
} from "@heroicons/react/24/outline"
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: string
  email: string
  nom: string
  prenom: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  createdAt: string
}

interface FormData {
  email: string
  password: string
  nom: string
  prenom: string
}

const initialFormData: FormData = {
  email: '',
  password: '',
  nom: '',
  prenom: ''
}

const columns = [
  { name: 'NOM', uid: 'nom' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'ROLE', uid: 'role' },
  { name: 'CRÉÉ LE', uid: 'createdAt' },
  { name: 'ACTIONS', uid: 'actions' }
]

export default function UsersManagement() {
  const { data: session } = useSession()
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      router.push('/admin/dashboard')
    } else {
      loadAdmins()
    }
  }, [session, router])

  const loadAdmins = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Erreur chargement')
      const data = await response.json()
      setAdmins(data)
    } catch (error) {
      toast.error('Erreur lors du chargement des administrateurs')
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = '/api/admin/users'
      const method = selectedAdmin ? 'PUT' : 'POST'
      const body = selectedAdmin 
        ? { ...formData, id: selectedAdmin.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      await loadAdmins()
      handleCloseModal()
      toast.success(selectedAdmin 
        ? 'Administrateur modifié avec succès'
        : 'Administrateur créé avec succès'
      )
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (!response.ok) {
        throw new Error('Impossible de supprimer cet administrateur')
      }

      await loadAdmins()
      toast.success('Administrateur supprimé avec succès')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleCloseModal = () => {
    setSelectedAdmin(null)
    setFormData(initialFormData)
    setShowPassword(false)
    onClose()
  }

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin)
    setFormData({
      email: admin.email,
      password: '',
      nom: admin.nom,
      prenom: admin.prenom
    })
    onOpen()
  }

  const renderCell = (admin: Admin, columnKey: React.Key) => {
    const key = String(columnKey)  // Convertir en string
      
    switch (key) {
      case 'nom':
        return (
          <div>
            <p className="font-medium">{admin.nom} {admin.prenom}</p>
          </div>
        )
      
      case 'role':
        return (
          <Chip 
            color={admin.role === 'SUPER_ADMIN' ? 'danger' : 'primary'}
            variant="flat"
            size="sm"
          >
            {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
          </Chip>
        )
  
      case 'createdAt':
        return (
          <span>
            {new Date(admin.createdAt).toLocaleDateString('fr-FR')}
          </span>
        )
  
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => handleEdit(admin)}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Button>
            {admin.role !== 'SUPER_ADMIN' && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => handleDelete(admin.id)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        )
  
      default:
        return admin[key as keyof Admin]
    }
  }

  if (session?.user?.role !== 'SUPER_ADMIN') {
    return null
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des administrateurs</h1>
        <Button
          color="primary"
          onPress={() => {
            setSelectedAdmin(null)
            setFormData(initialFormData)
            onOpen()
          }}
          startContent={<PlusIcon className="w-4 h-4"/>}
        >
          Nouvel administrateur
        </Button>
      </div>

      <Table 
        aria-label="Liste des administrateurs"
        selectionMode="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          items={admins} 
          emptyContent="Aucun administrateur trouvé"
        >
          {(admin) => (
            <TableRow key={admin.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(admin, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedAdmin ? 'Modifier' : 'Nouvel'} administrateur
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                isRequired
              />
              
              {!selectedAdmin && (
                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  isRequired
                  endContent={
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-4 h-4 text-default-400" />
                      ) : (
                        <EyeIcon className="w-4 h-4 text-default-400" />
                      )}
                    </button>
                  }
                />
              )}
              
              <Input
                label="Nom"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                isRequired
              />
              
              <Input
                label="Prénom"
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button 
                color="danger" 
                variant="light" 
                onPress={handleCloseModal}
              >
                Annuler
              </Button>
              <Button 
                color="primary" 
                type="submit"
                isLoading={isLoading}
              >
                {selectedAdmin ? 'Modifier' : 'Créer'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}