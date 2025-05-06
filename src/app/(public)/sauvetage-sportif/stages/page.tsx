'use client';

import { Download, Users, Clock, Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';

interface DocumentLink {
  title: string;
  fileName: string;
  path: string;
  icon?: any;
}

const documentLinks: DocumentLink[] = [
  {
    title: "Brochure Stage Ados",
    fileName: "Brochure - Stage ados.pdf",
    path: "/docs/Brochure - Stage ados.pdf",
    icon: Users
  },
  {
    title: "Brochure Stage Enfants",
    fileName: "Brochure - Stage enfants.pdf",
    path: "/docs/Brochure - Stage enfants.pdf",
    icon: Users
  },
  {
    title: "Brochure Stage Scolaire",
    fileName: "Brochure - Stage (scolaire, enfants, ados).pdf",
    path: "/docs/Brochure - Stage (scolaire, enfants, ados).pdf",
    icon: Calendar
  }
];

const DocumentCard = ({ document, isLoading, onDownload }: { 
  document: DocumentLink; 
  isLoading?: boolean;
  onDownload: (fileName: string, path: string) => void;
}) => {
  const Icon = document.icon;
  
  return (
    <button 
      onClick={() => onDownload(document.fileName, document.path)}
      disabled={isLoading}
      className="bg-white flex items-center justify-between w-full rounded-xl shadow-lg p-6 hover:shadow-xl 
                transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-3 rounded-full bg-blue-50 flex-shrink-0">
            <Icon className="w-6 h-6 text-[#0e5399]" />
          </div>
        )}
        <span className="text-xl font-indie-pimp text-[#0e5399]">
          {document.title}
        </span>
      </div>
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0e5399]"></div>
      ) : (
        <Download className="w-5 h-5 text-[#0e5399]" />
      )}
    </button>
  );
};

const ImageGalleryPreview = () => {
  const images = [
    {
      src: "/images/other/1.jpeg",
      alt: "Activité de sauvetage et secourisme"
    },
    {
      src: "/images/other/2.jpeg",
      alt: "Stage de sauvetage jeunesse"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {images.map((image, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img 
            src={image.src} 
            alt={image.alt} 
            className="w-full h-64 object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default function Stages() {
  const [isDownloading, setIsDownloading] = useState<{[key: string]: boolean}>({});

  const handleDownload = (fileName: string, path: string) => {
    setIsDownloading({...isDownloading, [fileName]: true});
    
    // Ouverture du fichier dans un nouvel onglet
    window.open(path, '_blank');
    
    // Réinitialisation de l'état après un certain délai
    setTimeout(() => {
      setIsDownloading({...isDownloading, [fileName]: false});
    }, 2000);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Stages Jeunesse
          </h1>
          <p className="text-xl font-mk-abel max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Découvrez nos stages de sauvetage et secourisme pour les enfants et adolescents
          </p>
        </div>

        {/* Contenu principal */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="prose prose-lg max-w-none font-mk-abel text-gray-700 leading-relaxed">
              <p>
                Aloha Sauvetage et Secourisme propose, pour les petits (entre 8 ans et 12 ans) et les grands (entre 13 ans et 17 ans), 
                des activités de découverte du sauvetage et gestes de premiers secours, soit en stage scolaire, soit en stage d'été.
              </p>
              
              <p>
                Ces activités se font sur Penthièvre et nous prêtons les combinaisons et tout le matériel nécessaires à la pratique de l'activité.
              </p>
              
              <div className="flex items-start gap-3 my-6 p-4 bg-blue-50 rounded-lg">
                <MapPin className="w-6 h-6 text-[#0e5399] mt-1 flex-shrink-0" />
                <p className="italic text-[#0e5399]">
                  <strong>Localisation :</strong> Plage de Penthièvre, Saint-Pierre-Quiberon
                </p>
              </div>
              
              <p>
                Durant ces séjours allant d'une demi-journée à 5 jours, voire plus, nous prenons en charge, avec l'équipe d'animation, 
                les enfants et adolescents pour créer, au sein du groupe, de la cohésion et du dépassement de soi via cette activité sportive et fun.
              </p>
              
              <p>
                Vous trouverez, ci-dessous, les liens des deux brochures expliquant les stages que nous réalisons.
              </p>
              
              <p>
                Nous souhaitons partager avec vous l'expérience de nos activités, comme nous le faisons déjà pour les services jeunesses d'Auray, 
                Saint Pierre Quiberon, Bain Sur Oust et d'autres communes depuis plusieurs années.
              </p>
              
              <div className="flex items-start gap-3 my-6 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-[#0e5399] mt-1 flex-shrink-0" />
                <p className="italic text-[#0e5399]">
                  <strong>Durée des stages :</strong> De la demi-journée à 5 jours ou plus, selon vos besoins
                </p>
              </div>
              
              <p className="font-bold text-lg">
                Alors n'hésitez pas à nous contacter par mail à <a href="mailto:contact@aloha-sauvetage.fr" className="text-[#0e5399] hover:underline">contact@aloha-sauvetage.fr</a> afin de construire ensemble un projet d'animation.
              </p>
            </div>
          </div>
          
          {/* Aperçu des images */}
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-6 text-center">
            En images
          </h2>
          <div className="mb-16">
            <ImageGalleryPreview />
          </div>
          
          {/* Documents à télécharger */}
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-6 text-center">
            Documents
          </h2>
          <div className="grid gap-4">
            {documentLinks.map((document, index) => (
              <DocumentCard 
                key={index} 
                document={document} 
                isLoading={isDownloading[document.fileName]}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}