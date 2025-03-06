// src/lib/gallery.ts
import { GalleryImage } from '@/types/gallery';

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const response = await fetch('/api/gallery');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des images');
    }
    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}