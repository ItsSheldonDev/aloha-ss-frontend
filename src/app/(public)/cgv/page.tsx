"use client";

import { useState, useEffect } from 'react';
import { FileText, Book, Shield } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentGrid from "@/components/documents/DocumentGrid";

export default function CGV() {
  const {
    documents,
    isLoading,
    error,
    downloadDocument,
    isDownloading
  } = useDocuments('CGV');

  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Animation de chargement initial
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Détecter le défilement pour les animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-50 to-white">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 right-0 w-full h-64 overflow-hidden opacity-10 -z-10">
        <div className="w-full h-full bg-pattern-waves"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
        {/* Overlay gradué */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-blue-700/70" />

        {/* Contenu centré */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <div className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-art-brush mb-6 tracking-wide text-white text-shadow-lg">
              <span className="relative">
                Conditions Générales
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              Retrouvez ici l'ensemble de nos documents légaux
            </p>
            
            {/* Badge centré */}
            <div className={`mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-xl transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Shield className="text-blue-300 w-6 h-6" />
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Documents officiels</div>
                <div className="text-blue-200 text-xs">Conditions et mentions légales</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Documents grid avec effet décoratif */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 mb-16">
            {/* Effet décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-mk-abel text-blue-800 mb-8 text-center relative flex items-center justify-center gap-3">
                <Book className="w-7 h-7 text-blue-600" />
                <span>Documents légaux</span>
              </h2>
              
              <DocumentGrid
                documents={documents}
                isLoading={isLoading}
                error={error}
                onDownload={downloadDocument}
                isDownloading={isDownloading}
                showCategories={false}
                cardVariant="featured"
                emptyMessage="Aucun document disponible pour le moment"
                errorMessage="Erreur lors du chargement des documents"
                columnsOnDesktop={1}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl shadow-xl text-white relative overflow-hidden p-8">
            {/* Effet de vague décoratif */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-20">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
                <path 
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                  className="fill-white"
                ></path>
              </svg>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/20 rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-white font-mk-abel text-lg mb-2">
                Respectueux de vos données personnelles
              </p>
              <p className="text-blue-100 font-mk-abel">
                Numéro de déclaration CNIL : 1858987 v 0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-wave {
          animation: wave 18s linear infinite;
        }
        
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .bg-pattern-waves {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%230e5399' fill-opacity='0.05' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}