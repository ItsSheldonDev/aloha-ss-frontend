"use client"

import { Mail, Download, Trophy, ThumbsUp, Users } from 'lucide-react';
import { Spinner } from "@nextui-org/react";
import { useDocuments } from '@/hooks/useDocuments';
import { useEffect, useState } from 'react';

interface Stat {
  periode: string;
  reussite: string;
  satisfaction: string;
  stagiaires: string;
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

const StatCard = ({ icon: Icon, title, value }: { icon: any, title: string, value: string }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
    <Icon className="w-8 h-8 text-[#0e5399] mb-4" />
    <p className="text-gray-600 text-sm font-mk-abel mb-2">{title}</p>
    <p className="text-2xl font-bold text-[#0e5399]">{value}</p>
  </div>
);

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export default function FormationsPro() {
  const { documents, isLoading, error } = useDocuments('FORMATIONS_PRO');
  const [downloadCounts, setDownloadCounts] = useState<{[key: string]: number}>({});
  const [isDownloading, setIsDownloading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const loadDownloadCounts = async () => {
      if (!documents) return;
      
      const counts: {[key: string]: number} = {};
      for (const doc of documents) {
        try {
          const response = await fetch(`/api/documents/${doc.id}/count`);
          if (response.ok) {
            const data = await response.json();
            counts[doc.id] = data.downloads;
          }
        } catch (error) {
          console.error('Erreur lors du chargement des téléchargements:', error);
        }
      }
      setDownloadCounts(counts);
    };

    loadDownloadCounts();
  }, [documents]);

  const handleDownload = async (doc: { id: string }) => {
    if (isDownloading[doc.id]) return;
    
    try {
      setIsDownloading(prev => ({ ...prev, [doc.id]: true }));

      // Incrémenter le compteur
      const response = await fetch(`/api/documents/${doc.id}/count`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setDownloadCounts(prev => ({
          ...prev,
          [doc.id]: data.downloads
        }));
      }

      // Télécharger le fichier
      window.open(`/api/documents/${doc.id}/download`, '_blank');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsDownloading(prev => ({ ...prev, [doc.id]: false }));
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* En-tête et texte d'introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-16">
        <h1 className="text-6xl font-art-brush text-[#0e5399] text-center mb-12">
          Formations Professionnelles
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <p className="text-lg font-mk-abel leading-relaxed">
            Vous trouverez ci-dessous tous les documents utiles à votre parcours de formation professionnelle.
          </p>
          <p className="text-lg font-mk-abel leading-relaxed">
            En cas de question, n'hésitez pas à nous écrire à{' '}
            <a href="mailto:contact@aloha-sauvetage.fr" 
               className="inline-flex items-center gap-2 text-[#0e5399] hover:text-blue-700 font-semibold">
              <Mail className="w-5 h-5" />
              contact@aloha-sauvetage.fr
            </a>
          </p>
          <p className="text-lg font-mk-abel leading-relaxed">
            Pour toutes demandes d'inscriptions à une formation, nous vous invitons à vous rendre sur la page de la formation qui vous intéresse ou à nous contacter via le formulaire à disposition.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-20">
        <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
          Nos résultats
        </h2>
        {stats.map((stat, index) => (
          <div key={index} className="mb-12">
            <h3 className="text-2xl font-mk-abel text-[#0e5399] mb-6 text-center">
              {stat.periode}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Trophy} title="Taux de réussite" value={stat.reussite} />
              <StatCard icon={ThumbsUp} title="Taux de satisfaction" value={stat.satisfaction} />
              <StatCard icon={Users} title="Stagiaires formés" value={stat.stagiaires} />
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-20">
        <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
          Documents utiles
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center text-gray-500 font-mk-abel">
            Aucun document disponible pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => handleDownload(doc)}
                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                  transition-all duration-300 group cursor-pointer ${isDownloading[doc.id] ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Download className={`w-6 h-6 text-[#0e5399] ${isDownloading[doc.id] ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <h3 className="font-mk-abel text-xl text-gray-700 group-hover:text-[#0e5399] transition-colors">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {formatFileSize(doc.size)}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {`${downloadCounts[doc.id] || 0} téléchargements`}
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
  );
}