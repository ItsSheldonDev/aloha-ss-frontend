"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  Camera, 
  Activity, 
  Users, 
  Clock, 
  Loader 
} from 'lucide-react';
import { Category } from '@prisma/client';
import { toast } from 'sonner';

// Types
interface GalleryImage {
  id: string;
  filename: string;
  alt: string;
  category: Category;
  url: string;
}

interface CategoryData {
  category: Category;
  images: GalleryImage[];
}

interface CategoryType {
  id: Category | 'all';
  name: string;
  icon: any;
  description: string;
}

const categories: CategoryType[] = [
  { 
    id: 'all', 
    name: "Toutes les photos", 
    icon: Camera, 
    description: "Découvrez l'ensemble de nos activités en images" 
  },
  { 
    id: 'formations', 
    name: "Formations", 
    icon: Users, 
    description: "Retour en images sur nos formations de secourisme" 
  },
  { 
    id: 'activites', 
    name: "Activités", 
    icon: Activity, 
    description: "Notre club en action : entraînements et ateliers" 
  },
  { 
    id: 'evenements', 
    name: "Événements", 
    icon: Clock, 
    description: "Les temps forts de notre association" 
  },
];

export default function Gallery() {
  // States
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType['id']>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [randomImages, setRandomImages] = useState<GalleryImage[]>([]);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effet pour charger les images aléatoires pour le slider
  useEffect(() => {
    const loadRandomImages = async () => {
      try {
        const response = await fetch('/api/gallery?mode=random');
        if (!response.ok) throw new Error('Erreur lors du chargement des images');
        const data = await response.json();
        setRandomImages(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError("Impossible de charger les images du slider");
      }
    };
    loadRandomImages();
  }, []);

  // Effet pour charger les images de la galerie
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        let endpoint = '/api/gallery';
        if (activeCategory !== 'all') {
          endpoint += `?category=${activeCategory}`;
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Erreur lors du chargement des images');
        
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error("Erreur lors du chargement de la galerie");
        setError("Impossible de charger les images");
      } finally {
        setIsLoading(false);
      }
    };
    loadImages();
  }, [activeCategory]);

  // Gestionnaires d'événements pour le slider
  const handlePrevSlide = () => {
    setIsTextVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? randomImages.length - 1 : prev - 1));
      setIsTextVisible(true);
    }, 300);
  };

  const handleNextSlide = () => {
    setIsTextVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === randomImages.length - 1 ? 0 : prev + 1));
      setIsTextVisible(true);
    }, 300);
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 text-[#0e5399] animate-spin mb-4" />
        <p className="text-gray-600 font-mk-abel">Chargement de la galerie...</p>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-red-600 font-mk-abel">
          {error}
        </p>
      </div>
    );
  }

  // Aucune image
  if (images.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 font-mk-abel">
          Aucune image disponible dans cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Slider */}
      {randomImages.length > 0 && (
        <div className="relative h-[500px] w-full mb-16">
          <div className="absolute inset-0">
            <div className="relative h-full w-full">
              {randomImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000
                            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
                </div>
              ))}
            </div>
          </div>

          {/* Boutons navigation slider */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20
                     hover:bg-black/40 transition-all duration-300 z-10
                     transform hover:scale-110"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20
                     hover:bg-black/40 transition-all duration-300 z-10
                     transform hover:scale-110"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>

          {/* Titre et description */}
          <div 
            className={`relative h-full flex flex-col items-center justify-center px-4
                      transition-opacity duration-300 ${isTextVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <h1 className="text-6xl font-art-brush mb-6 animate-fade-up text-white drop-shadow-lg">
              Notre Formation en Images
            </h1>
            <p className="text-xl font-mk-abel max-w-2xl text-center animate-fade-up animation-delay-200 
                        text-white drop-shadow-lg">
              {categories.find(cat => cat.id === activeCategory)?.description}
            </p>
          </div>

          {/* Points de navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {randomImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTextVisible(false);
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setIsTextVisible(true);
                  }, 300);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300
                         ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}
                         hover:bg-white`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filtres de catégories */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const count = category.id === 'all' 
              ? images.length 
              : images.filter(img => img.category === category.id).length;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-mk-abel
                         transition-all duration-300 ${
                           activeCategory === category.id
                             ? 'bg-[#0e5399] text-white shadow-lg scale-105'
                             : 'bg-white text-gray-600 hover:bg-gray-100'
                         }`}
                aria-current={activeCategory === category.id}
              >
                <Icon className="w-5 h-5" />
                {category.name}
                <span className="ml-2 text-sm opacity-75">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grille d'images */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-lg
                       transform hover:-translate-y-1 transition-all duration-300
                       animate-fade-up cursor-pointer bg-white"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedImage(image.url)}
              role="button"
              tabIndex={0}
              aria-label={`Voir ${image.alt}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                           transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100
                                transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t 
                           from-black/60 to-transparent opacity-0 group-hover:opacity-100
                           transition-opacity duration-300">
                <p className="text-white text-sm font-mk-abel">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'image en plein écran */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image en plein écran"
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full
                     transition-all duration-300"
            onClick={() => setSelectedImage(null)}
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl aspect-square">
            <Image
              src={selectedImage}
              alt="Image sélectionnée"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}