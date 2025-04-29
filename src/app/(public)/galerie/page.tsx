"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Camera, Activity, Users, Clock, ZoomIn, X, Filter } from 'lucide-react';
import { Spinner } from "@nextui-org/react";
import { Category, GalleryImage, CategoryImages } from '@/lib/api';
import { 
  useGallery, 
  useRandomGallery, 
  useGalleryBySpecificCategory 
} from '@/hooks/useGallery';

interface CategoryType {
  id: Category | 'all';
  name: string;
  icon: React.ElementType;
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
    id: 'Formations', 
    name: "Formations", 
    icon: Users, 
    description: "Retour en images sur nos formations de secourisme" 
  },
  { 
    id: 'Sauvetage_Sportif', 
    name: "Sauvetage Sportif", 
    icon: Activity, 
    description: "Notre club en action : entraînements et ateliers" 
  },
  { 
    id: 'Evenements', 
    name: "Événements", 
    icon: Clock, 
    description: "Les temps forts de notre association" 
  },
];

export default function Gallery() {
  // États pour la navigation et les filtres
  const [activeCategory, setActiveCategory] = useState<CategoryType['id']>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [fading, setFading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animation de chargement initial
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Récupération des images de la galerie selon la catégorie
  const { 
    data: galleryData, 
    isLoading, 
    error 
  } = activeCategory === 'all'
    ? useGallery({ mode: 'all', staleTime: 10 * 60 * 1000, enabled: true })
    : useGalleryBySpecificCategory(activeCategory as Category, { staleTime: 10 * 60 * 1000, enabled: true });

  // Normalisation des données pour s'assurer que galleryImages est toujours un tableau de GalleryImage[]
  const galleryImages: GalleryImage[] = Array.isArray(galleryData)
    ? galleryData.every(item => 'id' in item && 'url' in item && 'alt' in item)
      ? galleryData as GalleryImage[]
      : (galleryData as CategoryImages[]).flatMap(category => category.images)
    : [];
  
  // Récupération des images aléatoires pour le slider
  const { 
    data: randomImages = [], 
    isLoading: isLoadingRandom 
  } = useRandomGallery({ staleTime: 10 * 60 * 1000, enabled: true });
  
  // Images aléatoires pour le carrousel (limité à 5)
  const sliderImages = randomImages.length > 0 
    ? randomImages.slice(0, Math.min(5, randomImages.length))
    : [];

  // Auto-rotation pour le slider
  useEffect(() => {
    if (sliderImages.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNextSlide();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [sliderImages, currentSlide]);
  
  // Gestionnaires d'événements pour le slider
  const handlePrevSlide = useCallback(() => {
    if (sliderImages.length === 0 || fading) return;
    
    setFading(true);
    setIsTextVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
      setIsTextVisible(true);
      setTimeout(() => setFading(false), 500);
    }, 300);
  }, [sliderImages, fading]);

  const handleNextSlide = useCallback(() => {
    if (sliderImages.length === 0 || fading) return;
    
    setFading(true);
    setIsTextVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
      setIsTextVisible(true);
      setTimeout(() => setFading(false), 500);
    }, 300);
  }, [sliderImages, fading]);

  // Ouvrir la lightbox pour une image
  const openLightbox = useCallback((image: GalleryImage) => {
    setLightboxImage(image);
    document.body.classList.add('overflow-hidden');
  }, []);

  // Fermer la lightbox
  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
    document.body.classList.remove('overflow-hidden');
  }, []);

  // Gestionnaire pour changer de catégorie
  const handleCategoryChange = useCallback((categoryId: CategoryType['id']) => {
    setActiveCategory(categoryId);
  }, []);

  // Vérifier si nous avons des images valides pour le slider
  const hasValidSlider = sliderImages.length > 0;

  // Déterminer le nombre de colonnes en fonction de la catégorie sélectionnée
  const getGridColumns = useCallback(() => {
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
        {/* Overlay gradué */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-blue-700/70" />

        {hasValidSlider ? (
          <>
            {/* Slider en arrière-plan avec effet parallaxe */}
            <div className="absolute inset-0">
              <div className="relative h-full w-full">
                {sliderImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-1000
                              ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div className="relative h-full w-full overflow-hidden">
                      {image.url && (
                        <Image
                          src={image.url}
                          alt={image.alt || "Image de la galerie"}
                          fill
                          className="object-cover transform scale-105 hover:scale-100 transition duration-10000 ease-out"
                          sizes="100vw"
                          priority={index === currentSlide}
                          unoptimized // Désactiver l'optimisation pour éviter les paramètres w et q
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons navigation slider avec design amélioré */}
            <button
              onClick={handlePrevSlide}
              disabled={fading || isLoadingRandom}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm transform hover:scale-110 border border-white/10 disabled:opacity-50"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-8 w-8 text-white drop-shadow-lg" />
            </button>
            <button
              onClick={handleNextSlide}
              disabled={fading || isLoadingRandom}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm transform hover:scale-110 border border-white/10 disabled:opacity-50"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-8 w-8 text-white drop-shadow-lg" />
            </button>

            {/* Points de navigation améliorés */}
            {sliderImages.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (fading) return;
                      setFading(true);
                      setIsTextVisible(false);
                      setTimeout(() => {
                        setCurrentSlide(index);
                        setIsTextVisible(true);
                        setTimeout(() => setFading(false), 500);
                      }, 300);
                    }}
                    className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-3'} hover:bg-white shadow-md`}
                    aria-label={`Image ${index + 1}`}
                    disabled={fading}
                  />
                ))}
              </div>
            )}
          </>
        ) : isLoadingRandom ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner color="white" size="lg" />
          </div>
        ) : null}

        {/* Contenu centré */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <div 
            className={`transition-all duration-1000 ${isTextVisible && isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h1 className="text-5xl md:text-7xl font-art-brush mb-6 tracking-wide text-white text-shadow-lg">
              <span className="relative">
                Aloha en images
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              {categories.find(cat => cat.id === activeCategory)?.description || "Découvrez nos activités en images"}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Grille d'images avec design amélioré */}
        <div id="gallery-grid" className={`transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-48 bg-white/50 backdrop-blur-sm rounded-xl shadow-md">
              <Spinner size="lg" color="primary" />
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200 shadow-md">
              <div className="bg-red-100 rounded-full mx-auto p-3 w-16 h-16 mb-4 flex items-center justify-center">
                <X className="text-red-500 w-8 h-8" />
              </div>
              <p className="text-xl font-semibold text-red-700 mb-2">Une erreur est survenue</p>
              <p className="text-red-600">Impossible de charger les images. Veuillez réessayer plus tard.</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-200 shadow-md">
              <div className="bg-blue-100 rounded-full mx-auto p-3 w-16 h-16 mb-4 flex items-center justify-center">
                <Camera className="text-blue-500 w-8 h-8" />
              </div>
              <p className="text-xl font-semibold text-blue-700 mb-2">Aucune image disponible</p>
              <p className="text-blue-600">{activeCategory !== 'all' 
                ? `Il n'y a pas encore d'images dans la catégorie "${categories.find(c => c.id === activeCategory)?.name}".` 
                : "La galerie ne contient pas encore d'images."}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-blue-100 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl text-blue-700 font-mk-abel flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    <span>
                      {activeCategory === 'all' 
                        ? "Toute notre collection" 
                        : `Photos de ${categories.find(c => c.id === activeCategory)?.name.toLowerCase()}`}
                    </span>
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {galleryImages.length} image{galleryImages.length > 1 ? 's' : ''}
                    </span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <Filter className="w-4 h-4 text-blue-500 mr-1" />
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-mk-abel
                                  shadow-sm transition-all duration-300 text-sm ${
                                    activeCategory === category.id
                                      ? 'bg-blue-600 text-white shadow-md scale-105'
                                      : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-blue-50 border border-blue-100'
                                  }`}
                          aria-current={activeCategory === category.id}
                        >
                          <Icon className="w-4 h-4" />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className={`grid ${getGridColumns()} gap-8`}>
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 bg-white cursor-pointer border border-blue-100/50"
                    onClick={() => openLightbox(image)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Voir l'image ${image.alt}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(image);
                      }
                    }}
                  >
                    {image.url && (
                      <Image
                        src={image.url}
                        alt={image.alt || "Image de la galerie"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        unoptimized // Désactiver l'optimisation pour éviter les paramètres w et q
                      />
                    )}
                    
                    {/* Gradient overlay and zoom button */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 group-hover:to-black/70 transition-all duration-300 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white/30">
                          <ZoomIn className="text-white h-6 w-6" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Image caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-white font-mk-abel truncate">{image.alt || "Image de la galerie"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox amélioré */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white p-3 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="relative w-full max-w-6xl aspect-auto h-[80vh] rounded-xl overflow-hidden animate-fade-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxImage.url && (
              <Image
                src={lightboxImage.url}
                alt={lightboxImage.alt || "Image de la galerie"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                unoptimized // Désactiver l'optimisation pour éviter les paramètres w et q
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-mk-abel text-lg">{lightboxImage.alt || "Image de la galerie"}</p>
              <p className="text-white/70 text-sm mt-1">Catégorie: {lightboxImage.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* CSS pour les animations */}
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}