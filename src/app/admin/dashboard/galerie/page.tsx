'use client'

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Spinner
} from "@nextui-org/react";
import { 
  PlusIcon, 
  FolderIcon,
  TrashIcon,
  PencilIcon 
} from "@heroicons/react/24/outline";
import { Category } from '@prisma/client';
import Image from 'next/image';
import { toast } from 'sonner';

interface GalleryImage {
  id: string;
  filename: string;
  alt: string;
  category: Category;
  url: string;
}

export default function GestionGalerie() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isEditOpen, 
    onOpen: onEditOpen, 
    onClose: onEditClose 
  } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [category, setCategory] = useState<Category>('formations');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { key: 'all', label: 'Toutes les images' },
    { key: 'formations', label: 'Formations' },
    { key: 'activites', label: 'Activités' },
    { key: 'evenements', label: 'Événements' }
  ];

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const loadImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await fetch(
        `/api/admin/gallery${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des images');
      }

      const data = await response.json();
      const imagesWithUrls = data.data ? data.data.map((image: GalleryImage) => ({
        ...image,
        url: `/uploads/galerie/${image.filename}`
      })) : [];
      
      setImages(imagesWithUrls);
    } catch (error) {
      toast.error("Erreur lors du chargement des images");
      console.error('Erreur:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !alt) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('alt', alt);
    formData.append('category', category);

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      await loadImages();
      onClose();
      setFile(null);
      setAlt('');
      toast.success('Image ajoutée avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedImage.id,
          alt,
          categoryValue: category
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification');
      }

      await loadImages();
      onEditClose();
      setSelectedImage(null);
      toast.success('Image modifiée avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      await loadImages();
      toast.success('Image supprimée avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  if (isLoadingImages) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion de la Galerie</h1>
        <Button 
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={onOpen}
        >
          Ajouter des images
        </Button>
      </div>

      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "solid" : "light"}
            color={selectedCategory === category.key ? "primary" : "default"}
            startContent={<FolderIcon className="w-4 h-4" />}
            onPress={() => setSelectedCategory(category.key)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-default-100 rounded-lg">
          <p className="text-default-600">Aucune image dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group">
              <CardBody className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                               transition-opacity flex items-center justify-center gap-2">
                    <Button
                      isIconOnly
                      variant="flat"
                      className="text-white"
                      onPress={() => {
                        setSelectedImage(image);
                        setAlt(image.alt);
                        setCategory(image.category);
                        onEditOpen();
                      }}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="flat"
                      color="danger"
                      className="text-white"
                      onPress={() => handleDelete(image.id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Ajouter une image</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Input
              label="Description"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
            <Select
              label="Catégorie"
              selectedKeys={[category]}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {categories.slice(1).map((cat) => (
                <SelectItem key={cat.key} value={cat.key}>
                  {cat.label}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button 
              color="primary" 
              onPress={handleUpload} 
              isLoading={isSubmitting}
              isDisabled={!file || !alt}
            >
              Ajouter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalContent>
          <ModalHeader>Modifier l'image</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              label="Description"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
            <Select
              label="Catégorie"
              selectedKeys={[category]}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {categories.slice(1).map((cat) => (
                <SelectItem key={cat.key} value={cat.key}>
                  {cat.label}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onEditClose}>
              Annuler
            </Button>
            <Button 
              color="primary" 
              onPress={handleEdit} 
              isLoading={isSubmitting}
              isDisabled={!alt}
            >
              Modifier
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}