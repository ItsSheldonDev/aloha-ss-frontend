"use client"

import { useState, useEffect } from 'react'
import { 
  Card, 
  CardBody,
  Button,
  Chip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react"
import { 
  FileText, 
  Upload,
  Download,
  Trash2,
  Plus
} from "lucide-react"
import { toast } from 'sonner'

interface Document {
  id: string
  title: string
  filename: string
  category: 'FORMATIONS_PRO' | 'MIEUX_NOUS_CONNAITRE' | 'CGV'
  createdAt: string
  size: number
  downloads: number
}

const categories = [
  { value: 'FORMATIONS_PRO', label: 'Formations professionnelles' },
  { value: 'MIEUX_NOUS_CONNAITRE', label: 'Mieux nous connaître' },
  { value: 'CGV', label: 'CGV' }
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [formData, setFormData] = useState({
    title: '',
    category: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [selectedCategory])

  const loadDocuments = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? '/api/admin/documents' 
        : `/api/admin/documents?category=${selectedCategory}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Erreur chargement')
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des documents")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !formData.title || !formData.category) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 10MB")
      return
    }

    setIsLoading(true)
    const formDataToSend = new FormData()
    formDataToSend.append('file', selectedFile)
    formDataToSend.append('title', formData.title)
    formDataToSend.append('category', formData.category)

    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Erreur upload')

      await loadDocuments()
      onClose()
      setFormData({ title: '', category: '' })
      setSelectedFile(null)
      toast.success('Document ajouté avec succès')
    } catch (error) {
      toast.error("Erreur lors de l'ajout du document")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${id}/download`)
      if (!response.ok) throw new Error('Erreur téléchargement')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = documents.find(d => d.id === id)?.filename || 'document'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()

      // Mettre à jour le compteur localement
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, downloads: doc.downloads + 1 } : doc
      ))
      
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erreur suppression')

      await loadDocuments()
      toast.success('Document supprimé')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-gray-500">
            Gérez les documents de la plateforme
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
        >
          Ajouter un document
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === 'all' ? "solid" : "flat"}
          color={selectedCategory === 'all' ? "primary" : "default"}
          onPress={() => setSelectedCategory('all')}
        >
          Tous
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "solid" : "flat"}
            color={selectedCategory === cat.value ? "primary" : "default"}
            onPress={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Liste des documents */}
      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="w-full">
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-grow">
                <h3 className="font-semibold text-foreground">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Chip size="sm" variant="flat">
                    {categories.find(c => c.value === doc.category)?.label}
                  </Chip>
                  <Chip 
                    size="sm" 
                    variant="dot" 
                    className="gap-1"
                  >
                    <Download className="w-3 h-3" />
                    {doc.downloads}
                  </Chip>
                  <span className="text-small text-default-500">
                    {formatSize(doc.size)}
                  </span>
                  <span className="text-small text-default-500">
                    {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => handleDownload(doc.id)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  color="danger"
                  onPress={() => handleDelete(doc.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}

        {documents.length === 0 && (
          <div className="text-center py-12 bg-default-50 rounded-lg">
            <FileText className="w-12 h-12 text-default-400 mx-auto mb-4" />
            <p className="text-default-600">
              Aucun document trouvé dans cette catégorie
            </p>
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
            <ModalHeader>Ajouter un document</ModalHeader>
            <ModalBody className="gap-4">
              <Input
                label="Titre"
                placeholder="Entrez le titre du document"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                isRequired
              />
              
              <Select 
                label="Catégorie"
                placeholder="Choisissez une catégorie"
                selectedKeys={formData.category ? [formData.category] : []}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                isRequired
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </Select>

              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full flex flex-col items-center gap-2 p-6 border-2 border-dashed 
                           rounded-lg cursor-pointer hover:bg-default-100 transition-colors"
                >
                  <Upload className="w-8 h-8 text-default-400" />
                  <div className="text-center">
                    <p className="text-default-700 font-medium">
                      {selectedFile ? selectedFile.name : 'Choisir un fichier'}
                    </p>
                    {!selectedFile && (
                      <p className="text-default-500 text-sm mt-1">
                        PDF, DOCX, XLSX jusqu'à 10MB
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
              >
                Annuler
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
                isDisabled={!selectedFile || !formData.title || !formData.category}
              >
                Ajouter
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}