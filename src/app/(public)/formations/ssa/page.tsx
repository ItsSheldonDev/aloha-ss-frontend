// src/app/(public)/ssa/page.tsx
"use client";

import { useRandomGallery } from '@/hooks/useGallery';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, CheckSquare, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';

export default function SSA() {
  // Utilisation du hook useRandomGallery pour récupérer une image aléatoire
  const { data: randomImages, isLoading } = useRandomGallery({
    staleTime: 60 * 60 * 1000, // 1 heure, comme dans votre version originale
    enabled: true,            // Activer la requête par défaut
  });

  // Prendre la première image aléatoire si disponible
  const randomImage = randomImages && randomImages.length > 0 ? randomImages[0] : null;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-[#0e5399] mb-4">
            Formation SSA
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Surveillant Sauveteur Aquatique
          </p>
        </div>

        {/* Section Objectifs */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-[#0e5399]" />
            <h2 className="text-2xl font-semibold text-[#0e5399]">
              Objectifs
            </h2>
          </div>
          <div className="space-y-3 text-gray-700 text-sm">
            <p className="leading-relaxed">
              Le SSA est une certification nationale permettant d'attester les compétences
              d'un sauveteur à travailler sur des postes de secours océanique. Il s'agit
              d'une unité d'enseignement non obligatoire mais reconnue et prisée par les employeurs.
            </p>
            <p className="leading-relaxed">
              À l'issue de la formation, l'apprenant doit être capable de s'intégrer à un
              dispositif de surveillance évolutif et de mettre en œuvre des techniques
              opérationnelles de sauvetage coordonnées à l'aide de matériels spécialisés.
            </p>
            <div className="mt-4">
              <p className="font-semibold text-[#0e5399] mb-1">L'option embarcation :</p>
              <p className="text-sm">
                Avec le SSA L option embarcation, vous aurez via un module complémentaire
                toutes les compétences pour aller chercher une victime avec une embarcation
                motorisée en toute sécurité.
              </p>
            </div>
          </div>
        </div>

        {/* Section Utilité */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-[#0e5399]" />
            <h2 className="text-2xl font-semibold text-[#0e5399]">
              À quoi sert cette formation ?
            </h2>
          </div>
          <div className="space-y-3 text-gray-700 text-sm">
            <p className="leading-relaxed">
              La formation SSA permet de connaître toutes les techniques utiles et
              indispensables pour travailler sur plage. En effet, en plus du BNSSA,
              il est très souvent demandé aux secouristes de maîtriser en plus du
              PSE2, les techniques opérationnelles en milieu naturel.
            </p>
            <p className="leading-relaxed">
              Cette formation est donc utile pour tous les sauveteurs souhaitant
              travailler en poste de secours sur plage.
            </p>
          </div>
        </div>

        {/* Section Informations pratiques et Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image aléatoire */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-[#0e5399] mb-4">
                Nos formations en images
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0e5399]"></div>
                </div>
              ) : randomImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={randomImage.url}
                    alt={randomImage.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="absolute bottom-4 left-4 text-white text-sm">
                      {randomImage.alt}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm text-center">
                  Aucune image disponible pour le moment.
                </p>
              )}
              <div className="mt-4 text-center">
                <Link
                  href="/galerie"
                  className="inline-flex items-center gap-2 text-[#0e5399] hover:text-blue-700 text-sm"
                >
                  Voir toute la galerie
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[#0e5399]" />
              <h2 className="text-2xl font-semibold text-[#0e5399]">
                Informations pratiques
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2 text-sm">
                  Durée de formation
                </h3>
                <div className="relative h-12 w-24">
                  <Image
                    src="/images/content/hours/hours28h.png"
                    alt="28 heures de formation"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2 text-sm">
                  Prérequis
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Avoir 18 ans minimum au 1er jour de la formation</li>
                  <li>• Être titulaire et à jour de son BNSSA</li>
                  <li>• Être titulaire et à jour de son PSE2</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section Contenu de la formation */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare className="w-6 h-6 text-[#0e5399]" />
            <h2 className="text-2xl font-semibold text-[#0e5399]">
              Contenu de la formation
            </h2>
          </div>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Situer son rôle et sa mission au sein d'un dispositif évolutif et
              adaptable aux conditions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Effectuer une analyse des risques particuliers présents sur sa zone.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Développer des actions de prévention adaptées aux risques et
              pratiques sur sa zone.</span>
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <span className="text-[#0e5399] font-bold">•</span>
                <span className="font-semibold">Techniques de sauvetage aquatique :</span>
              </div>
              <ul className="pl-6 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Approche du noyé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Prise de la victime au fond</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Remontée à la surface</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Bouton d'inscription */}
        <div className="text-center mt-8">
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0e5399] text-white
                     rounded-full hover:bg-blue-700 transition-all duration-300
                     transform hover:-translate-y-1 shadow-lg hover:shadow-xl
                     text-lg"
          >
            <span>S'inscrire à la formation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}