// src/app/admin/dashboard/settings/emails/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { 
  Button, 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  Chip,
  Spinner
} from "@nextui-org/react"
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline"
import { toast } from 'sonner'

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description?: string;
  active: boolean;
  type: 'INSCRIPTION' | 'CONTACT' | 'NOTIFICATION';
  updatedAt: string;
}

const columns = [
  { name: "NOM", uid: "name" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "TYPE", uid: "type" },
  { name: "STATUT", uid: "active" },
  { name: "MODIFIÉ LE", uid: "updatedAt" },
  { name: "ACTIONS", uid: "actions" }
];

const typeLabels = {
  'INSCRIPTION': 'Inscription',
  'CONTACT': 'Contact',
  'NOTIFICATION': 'Notification'
};

export default function EmailsPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isPreviewOpen, 
    onOpen: onPreviewOpen, 
    onClose: onPreviewClose 
  } = useDisclosure();

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    description: '',
    type: 'NOTIFICATION' as EmailTemplate['type'],
    active: true
  });

  // Charger les templates
  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/admin/emails/templates');
      if (!response.ok) throw new Error('Erreur chargement templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/admin/emails/templates', {
        method: selectedTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTemplate ? { id: selectedTemplate.id, ...formData } : formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      onClose();
      loadTemplates();
      toast.success(selectedTemplate ? 'Template mis à jour' : 'Template créé');
      
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/emails/templates?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur suppression');

      loadTemplates();
      toast.success('Template supprimé');
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handlePreview = async (template: EmailTemplate) => {
    try {
      const response = await fetch(`/api/admin/emails/templates/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: template.content })
      });

      if (!response.ok) throw new Error('Erreur preview');

      const data = await response.json();
      setPreviewHtml(data.html);
      onPreviewOpen();
    } catch (error) {
      toast.error("Erreur lors de la génération de l'aperçu");
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      description: template.description || '',
      type: template.type,
      active: template.active
    });
    onOpen();
  };

  const handleNew = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      subject: '',
      content: '',
      description: '',
      type: 'NOTIFICATION',
      active: true
    });
    onOpen();
  };

  const renderCell = (template: EmailTemplate, columnKey: React.Key) => {
    switch(columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{template.name}</p>
            <p className="text-bold text-tiny text-default-500">
              {template.subject}
            </p>
          </div>
        );
      case "type":
        return typeLabels[template.type];
      case "active":
        return (
          <Chip 
            color={template.active ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {template.active ? "Actif" : "Inactif"}
          </Chip>
        );
      case "updatedAt":
        return new Date(template.updatedAt).toLocaleDateString('fr-FR');
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => handlePreview(template)}
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => handleEdit(template)}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="light"
              onPress={() => handleDelete(template.id)}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return template[columnKey as keyof EmailTemplate];
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des templates d'emails</h1>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={handleNew}
        >
          Nouveau template
        </Button>
      </div>

      <Table aria-label="Liste des templates d'emails">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={templates}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal d'édition */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="4xl"
      >
        <ModalContent>
          <ModalHeader>
            {selectedTemplate ? 'Modifier' : 'Nouveau'} template
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nom"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Sujet"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                minRows={2}
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as EmailTemplate['type']})}
                className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-primary"
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Textarea
                label="Contenu HTML"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                minRows={10}
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="active" className="text-sm">
                  Template actif
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              {selectedTemplate ? 'Modifier' : 'Créer'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal d'aperçu */}
      <Modal 
        isOpen={isPreviewOpen} 
        onClose={onPreviewClose}
        size="5xl"
      >
        <ModalContent>
          <ModalHeader>
            Aperçu du template
          </ModalHeader>
          <ModalBody>
            <div 
              className="p-4 border rounded-lg"
              dangerouslySetInnerHTML={{ __html: previewHtml }} 
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onPreviewClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}