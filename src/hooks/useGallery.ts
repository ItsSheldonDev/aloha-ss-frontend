import { useQuery } from '@tanstack/react-query';
import {
  fetchGalleryImages,
  fetchRandomGalleryImages,
  fetchGalleryByCategory,
  Category,
  GalleryImage,
  CategoryImages
} from '@/lib/api';

interface UseGalleryOptions {
  category?: Category;
  mode?: 'all' | 'random';
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Vérifie si le tableau contient des objets GalleryImage
 */
function isGalleryImageArray(data: any[]): data is GalleryImage[] {
  return data.length > 0 && 'filename' in data[0];
}

/**
 * Vérifie si le tableau contient des objets CategoryImages
 */
function isCategoryImagesArray(data: any[]): data is CategoryImages[] {
  return data.length > 0 && 'images' in data[0];
}

/**
 * Extrait toutes les images d'un tableau CategoryImages
 */
function extractImagesFromCategories(categories: CategoryImages[]): GalleryImage[] {
  const allImages: GalleryImage[] = [];
  categories.forEach(category => {
    allImages.push(...category.images);
  });
  return allImages;
}

/**
 * Hook principal pour récupérer les images de la galerie
 * @param options Options de configuration
 * @returns Résultat de la requête avec les images
 */
export function useGallery(options: UseGalleryOptions = {}) {
  const {
    category,
    mode = 'all',
    enabled = true,
    staleTime = 10 * 60 * 1000 // 10 minutes par défaut
  } = options;
  
  return useQuery({
    queryKey: ['gallery', category, mode],
    queryFn: () => fetchGalleryImages({ category, mode }),
    staleTime,
    enabled,
  });
}

/**
 * Hook spécifique pour récupérer des images aléatoires
 * @param options Options de configuration
 * @returns Résultat de la requête avec les images aléatoires
 */
export function useRandomGallery(options: Omit<UseGalleryOptions, 'mode' | 'category'> = {}) {
  const { enabled = true, staleTime = 10 * 60 * 1000 } = options;
 
  return useQuery({
    queryKey: ['gallery', 'random'],
    queryFn: fetchRandomGalleryImages,
    staleTime,
    enabled,
  });
}

/**
 * Hook pour récupérer les images groupées par catégorie
 * @param options Options de configuration
 * @returns Résultat de la requête avec les images groupées par catégorie
 */
export function useGalleryByCategory(options: Omit<UseGalleryOptions, 'mode' | 'category'> = {}) {
  const { enabled = true, staleTime = 10 * 60 * 1000 } = options;
 
  return useQuery({
    queryKey: ['gallery', 'byCategory'],
    queryFn: fetchGalleryByCategory,
    staleTime,
    enabled,
  });
}

/**
 * Hook pour récupérer les images de la catégorie "Formations"
 * @param options Options de configuration
 * @returns Résultat de la requête avec les images de formations
 */
export function useFormationsGallery(options: Omit<UseGalleryOptions, 'mode' | 'category'> = {}) {
  const { enabled = true, staleTime = 10 * 60 * 1000 } = options;
 
  return useQuery({
    queryKey: ['gallery', 'Formations'],
    queryFn: async () => {
      const result = await fetchGalleryImages({ category: 'Formations' });
      
      // Traiter selon le type retourné
      if (Array.isArray(result)) {
        if (isGalleryImageArray(result)) {
          return result;
        } else if (isCategoryImagesArray(result)) {
          return extractImagesFromCategories(result);
        }
      }
      
      return [] as GalleryImage[];
    },
    staleTime,
    enabled,
  });
}

/**
 * Hook pour récupérer les images de la catégorie "Sauvetage_Sportif"
 * @param options Options de configuration
 * @returns Résultat de la requête avec les images de sauvetage sportif
 */
export function useSauvetageSportifGallery(options: Omit<UseGalleryOptions, 'mode' | 'category'> = {}) {
  const { enabled = true, staleTime = 10 * 60 * 1000 } = options;
 
  return useQuery({
    queryKey: ['gallery', 'Sauvetage_Sportif'],
    queryFn: async () => {
      const result = await fetchGalleryImages({ category: 'Sauvetage_Sportif' });
      
      // Traiter selon le type retourné
      if (Array.isArray(result)) {
        if (isGalleryImageArray(result)) {
          return result;
        } else if (isCategoryImagesArray(result)) {
          return extractImagesFromCategories(result);
        }
      }
      
      return [] as GalleryImage[];
    },
    staleTime,
    enabled,
  });
}

/**
 * Hook pour récupérer les images de la catégorie "Evenements"
 * @param options Options de configuration
 * @returns Résultat de la requête avec les images d'événements
 */
export function useEvenementsGallery(options: Omit<UseGalleryOptions, 'mode' | 'category'> = {}) {
  const { enabled = true, staleTime = 10 * 60 * 1000 } = options;
 
  return useQuery({
    queryKey: ['gallery', 'Evenements'],
    queryFn: async () => {
      const result = await fetchGalleryImages({ category: 'Evenements' });
      
      // Traiter selon le type retourné
      if (Array.isArray(result)) {
        if (isGalleryImageArray(result)) {
          return result;
        } else if (isCategoryImagesArray(result)) {
          return extractImagesFromCategories(result);
        }
      }
      
      return [] as GalleryImage[];
    },
    staleTime,
    enabled,
  });
}

/**
 * Hook générique pour récupérer les images d'une catégorie spécifique
 * @param category Catégorie d'images à récupérer
 * @param options Options de configuration
 * @returns Résultat de la requête avec les images de la catégorie spécifiée
 */
export function useGalleryBySpecificCategory(category: Category, options: Omit<UseGalleryOptions, 'mode' | 'category'> = {}) {
  const { enabled = true, staleTime = 10 * 60 * 1000 } = options;
 
  return useQuery({
    queryKey: ['gallery', category],
    queryFn: async () => {
      const result = await fetchGalleryImages({ category });
      
      // Traiter selon le type retourné
      if (Array.isArray(result)) {
        if (isGalleryImageArray(result)) {
          return result;
        } else if (isCategoryImagesArray(result)) {
          return extractImagesFromCategories(result);
        }
      }
      
      return [] as GalleryImage[];
    },
    staleTime,
    enabled,
  });
}