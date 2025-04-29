"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Building, Award, Download, Info, Heart, Shield, CalendarDays } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import DocumentGrid from '@/components/documents/DocumentGrid';

interface Administrator {
  name: string;
  role: string;
}

const administrators: Administrator[] = [
  { name: "Noah GARREC", role: "Président" },
  { name: "Yasmina TROTTER", role: "Trésorière" },
  { name: "Marie LAGRANGE", role: "Trésorière adjointe" },
  { name: "Marine LE GALL", role: "Secrétaire" },
  { name: "Emmanuel BELLANTONIO", role: "Membre" },
  { name: "Gilles DANIET", role: "Membre" },
  { name: "Nolwenn DREANO", role: "Membre" },
  { name: "Agathe PRAJOUX", role: "Membre" },
  { name: "Stéphane GALLE", role: "Membre" },
];

const poles = [
  { 
    title: "Le pôle formation", 
    description: "Formation aux premiers secours et secourisme",
    icon: <Award className="w-8 h-8 text-blue-500" />
  },
  { 
    title: "Le pôle opérationnel", 
    description: "Gestion des postes de secours et interventions",
    icon: <Shield className="w-8 h-8 text-blue-500" />
  },
  { 
    title: "Le pôle sauvetage sportif", 
    description: "Entraînements et compétitions",
    icon: <Users className="w-8 h-8 text-blue-500" />
  }
];

export default function MieuxNousConnaitre() {
  const { 
    documents, 
    isLoading, 
    error, 
    downloadDocument,
    isDownloading
  } = useDocuments('MIEUX_NOUS_CONNAITRE');

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
                Mieux nous connaître
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              Découvrez l'histoire et l'organisation d'Aloha Sauvetage Secourisme
            </p>
            
            {/* Badge centré */}
            <div className={`mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-xl transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CalendarDays className="text-blue-300 w-6 h-6" />
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Association créée en 2011</div>
                <div className="text-blue-200 text-xs">Plus de 10 ans d'expérience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Introduction */}
        <div className={`max-w-5xl mx-auto mb-20 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet de vague décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="relative z-10">
              <p className="text-lg font-mk-abel text-gray-700 leading-relaxed mb-8">
                Notre association a été créée le 10 mars 2011 avec pour objet le développement du sauvetage 
                et du secourisme dans le département du Morbihan.
              </p>
              
              <div className="flex items-center gap-4 text-blue-700 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-mk-abel">Notre Bureau</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {administrators.map((admin, index) => (
                  <div 
                    key={index}
                    className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 hover:bg-blue-100 transition-colors transform hover:-translate-y-1 hover:shadow-md duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-mk-abel">
                      <span className="font-semibold">{admin.name}</span>
                      {admin.role && <div className="text-sm text-blue-600">{admin.role}</div>}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-6 font-mk-abel text-gray-700 leading-relaxed">
                <p>
                  Forte de 10 années d'existence, notre association a su se développer et diversifier 
                  ces activités pour maintenant être structurée en trois pôles complémentaires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Les trois pôles */}
        <div className={`max-w-5xl mx-auto mb-20 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-mk-abel text-blue-800 mb-10 text-center relative flex items-center justify-center gap-3">
            <Building className="w-7 h-7 text-blue-600" />
            <span>Nos pôles d'activité</span>
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {poles.map((pole, index) => (
              <div 
                key={index} 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl border border-blue-100 transform hover:-translate-y-2 transition-all duration-300 h-full"
              >
                <div className="p-4 bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {pole.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  {pole.title}
                </h3>
                <p className="text-gray-600 font-mk-abel">
                  {pole.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Histoire et chiffres clés */}
        <div className={`max-w-5xl mx-auto mb-20 transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl text-white relative overflow-hidden">
            <div className="p-8 md:p-10 relative z-10">
              <h2 className="text-2xl font-mk-abel mb-6 flex items-center gap-3 text-white">
                <Info className="w-6 h-6" />
                <span>Notre histoire et nos chiffres</span>
              </h2>
              
              <div className="space-y-4 font-mk-abel text-white">
                <p className="leading-relaxed text-white">
                  Elle compte aujourd'hui 400 membres, deux salariés à temps plein et 20 intervenants 
                  formateurs ou entraîneurs.
                </p>
                <p className="leading-relaxed text-white">
                  Aloha Sauvetage Secourisme est affiliée à la Fédération Française de Sauvetage 
                  et Secourisme depuis 2012.
                </p>
                <p className="leading-relaxed text-white">
                  Cette association, initiée par son ancien et premier président, Bruno ROUIT, 
                  aujourd'hui président d'honneur de l'association, s'est développée à grande 
                  vitesse pour avoir en son sein aujourd'hui pas moins de 400 adhérents.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">400</div>
                  <div className="text-sm text-blue-100">Membres</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">2</div>
                  <div className="text-sm text-blue-100">Salariés</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">20</div>
                  <div className="text-sm text-blue-100">Formateurs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">2011</div>
                  <div className="text-sm text-blue-100">Création</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Documents */}
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-400 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet de vague décoratif */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 text-blue-700 mb-8">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Download className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-mk-abel">Documents à télécharger</h2>
              </div>

              <DocumentGrid
                documents={documents}
                isLoading={isLoading}
                error={error}
                onDownload={downloadDocument}
                isDownloading={isDownloading}
                showCategories={false}
                cardVariant="compact"
                emptyMessage="Aucun document disponible pour le moment"
                errorMessage="Erreur lors du chargement des documents"
                layout="list"
              />
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
        
        .bg-wave-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' class='shape-fill'%3E%3C/path%3E%3C/svg%3E");
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
}