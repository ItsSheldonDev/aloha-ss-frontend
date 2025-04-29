"use client";

import { useState, useEffect } from 'react';
import { Mail, Download, Trophy, ThumbsUp, Users, ChevronDown, GraduationCap, FileText, AlertCircle } from 'lucide-react';
import { Spinner, Card, CardBody } from "@nextui-org/react";
import { useDocuments } from '@/hooks/useDocuments';
import Image from 'next/image';

interface Stat {
  periode: string;
  reussite: string;
  satisfaction: string;
  stagiaires: string;
}

interface Document {
  id: string;
  title: string;
  size: number;
  downloads?: number;
  description?: string;
}

const stats: Stat[] = [
  {
    periode: "2021-2022",
    reussite: "96.4%",
    satisfaction: "99.1%",
    stagiaires: "590",
  },
  {
    periode: "2020-2021",
    reussite: "93.3%",
    satisfaction: "100%",
    stagiaires: "512",
  },
];

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string }) => (
  <Card className="shadow-lg overflow-visible transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm border border-blue-100">
    <CardBody className="p-6 flex flex-col items-center">
      <div className="p-3 rounded-full bg-blue-50 mb-4">
        <Icon className="w-7 h-7 text-blue-600" />
      </div>
      <p className="text-gray-600 text-sm font-mk-abel mb-2">{title}</p>
      <p className="text-2xl font-bold text-blue-700">{value}</p>
    </CardBody>
  </Card>
);

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export default function FormationsPro() {
  const { documents, isLoading, error, refetch } = useDocuments('FORMATIONS_PRO');
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
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

  const handleDownload = async (doc: Document) => {
    if (isDownloading[doc.id]) return;

    try {
      setIsDownloading((prev) => ({ ...prev, [doc.id]: true }));

      // Télécharger le fichier (l'API incrémente automatiquement le compteur)
      window.open(`https://api.aloha-secourisme.fr/api/documents/${doc.id}/download`, '_blank');

      // Rafraîchir les documents pour mettre à jour le compteur
      await refetch();
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
    } finally {
      setIsDownloading((prev) => ({ ...prev, [doc.id]: false }));
    }
  };

  // Fonction pour afficher l'erreur en toute sécurité
  const renderError = () => {
    if (typeof error === 'string') {
      return error;
    }
    
    // Utilisation de type assertion et vérification supplémentaire
    if (error && typeof error === 'object') {
      const errorObj = error as { message?: unknown };
      if (errorObj.message && typeof errorObj.message === 'string') {
        return errorObj.message;
      }
    }
    
    return 'Erreur inconnue';
  };

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
                Formations Professionnelles
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              Tous les documents utiles à votre parcours de formation
            </p>
            
            {/* Badge centré */}
            <div className={`mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-xl transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <GraduationCap className="text-blue-300 w-6 h-6" />
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Centre de formation certifié</div>
                <div className="text-blue-200 text-xs">Organisme Qualiopi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Introduction */}
        <div className={`max-w-4xl mx-auto mb-20 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet de vague décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="space-y-6 font-mk-abel text-lg text-gray-700 relative z-10">
              <p className="leading-relaxed">
                Vous trouverez ci-dessous tous les documents utiles à votre parcours de formation professionnelle.
              </p>
              <p className="leading-relaxed">
                En cas de question, n'hésitez pas à nous écrire à{' '}
                <a
                  href="mailto:contact@aloha-sauvetage.fr"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
                >
                  <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="border-b border-blue-300 pb-0.5">contact@aloha-sauvetage.fr</span>
                </a>
              </p>
              <p className="leading-relaxed">
                Pour toutes demandes d'inscriptions à une formation, nous vous invitons à vous rendre sur la page de la formation qui vous intéresse ou à nous contacter via le formulaire à disposition.
              </p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className={`transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-mk-abel text-blue-800 mb-12 text-center relative flex items-center justify-center gap-3">
            <FileText className="w-7 h-7 text-blue-600" />
            <span>Documents utiles</span>
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-48 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-8">
              <Spinner size="lg" color="primary" />
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center text-red-600 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              {renderError()}
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 text-center text-gray-600 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="font-mk-abel">Aucun document disponible pour le moment</p>
              <p className="text-sm text-gray-500 mt-2">Veuillez vérifier ultérieurement</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDownload(doc)}
                  className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6 cursor-pointer
                              transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl
                              ${isDownloading[doc.id] ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <Download className={`w-6 h-6 text-blue-600 ${isDownloading[doc.id] ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-mk-abel text-xl text-gray-700 transition-colors">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {formatFileSize(doc.size)}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {`${doc.downloads || 0} téléchargements`}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-500 mt-2">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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