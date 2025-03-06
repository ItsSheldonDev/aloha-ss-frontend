"use client"

import Image from 'next/image';
import { Users, Building, Award, Download } from 'lucide-react';
import { Spinner } from "@nextui-org/react";
import { useDocuments } from '@/hooks/useDocuments';

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
  { title: "Le pole formation", description: "Formation aux premiers secours et secourisme" },
  { title: "Le pole operationnel", description: "Gestion des postes de secours et interventions" },
  { title: "Le pole sauvetage sportif", description: "Entraînements et compétitions" }
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export default function MieuxNousConnaitre() {
  const { documents, isLoading, error } = useDocuments('MIEUX_NOUS_CONNAITRE');

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Mieux nous connaître
          </h1>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <p className="text-lg font-mk-abel text-gray-700 leading-relaxed mb-6">
            Notre association a été créée le 10 mars 2011 avec pour objet le développement du sauvetage 
            et du secourisme dans le département du Morbihan.
          </p>
          
          <div className="flex items-center gap-4 text-[#0e5399] mb-6">
            <Users className="w-8 h-8" />
            <h2 className="text-2xl font-mk-abel">Notre Bureau</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {administrators.map((admin, index) => (
              <div 
                key={index}
                className="bg-blue-50 p-4 rounded-lg flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#0e5399]" />
                <span className="font-mk-abel">
                  <span className="font-semibold">{admin.name}</span>
                  {admin.role && `, ${admin.role}`}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-6 font-mk-abel text-gray-700 leading-relaxed">
            <p>
              Forte de 10 années d'existence, notre association a su se développer et diversifier 
              ces activités pour maintenant être structurée en trois pôles complémentaires.
            </p>

            <div className="grid gap-6 md:grid-cols-3 my-8">
              {poles.map((pole, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-md
                          hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-indie-pimp text-[#0e5399] mb-3">
                    {pole.title}
                  </h3>
                  <p className="text-gray-600">
                    {pole.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p>
                Elle compte aujourd'hui 400 membres, deux salariés à temps plein et 20 intervenants 
                formateurs ou entraîneurs.
              </p>
              <p>
                Aloha Sauvetage Secourisme est affiliée à la Fédération Française de Sauvetage 
                et Secourisme depuis 2012.
              </p>
              <p>
                Cette association, initiée par son ancien et premier président, Bruno ROUIT, 
                aujourd'hui président d'honneur de l'association, s'est développée à grande 
                vitesse pour avoir en son sein aujourd'hui pas moins de 400 adhérents.
              </p>
            </div>
          </div>
        </div>

        {/* Section Documents */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 text-[#0e5399] mb-6">
            <Download className="w-8 h-8" />
            <h2 className="text-2xl font-mk-abel">Documents à télécharger</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center text-gray-500 font-mk-abel py-8">
              Aucun document disponible pour le moment
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {documents.map((doc) => (
                <a 
                  key={doc.id}
                  href={`/api/documents/${doc.id}/download`}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 
                           hover:border-[#0e5399] hover:bg-blue-50 transition-colors group"
                >
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-[#0e5399]" />
                  <div>
                    <span className="font-mk-abel text-gray-700 group-hover:text-[#0e5399]">
                      {doc.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(doc.size)}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {doc.downloads} téléchargements
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}