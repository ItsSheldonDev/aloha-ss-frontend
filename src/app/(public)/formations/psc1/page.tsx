// src/app/(public)/formations/psc1/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock, CheckSquare, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import { useRandomGallery } from '@/hooks/useGallery';

export default function PSC1() {
  // Utilisation du hook spécialisé pour récupérer une image aléatoire
  const { data: randomImages = [], isLoading } = useRandomGallery();
  
  // Récupérer la première image du tableau des images aléatoires
  const randomImage = randomImages.length > 0 ? randomImages[0] : null;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-[#0e5399] mb-4">
            Formation PSC1
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Prévention et Secours Civiques de niveau 1
          </p>
        </div>

        {/* Section Objectifs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-[#0e5399]" />
            <h2 className="text-2xl font-semibold text-[#0e5399]">
              Objectifs
            </h2>
          </div>
          <div className="space-y-3 font-mk-abel text-gray-700">
            <p className="leading-relaxed">
              L'unité d'enseignement Prévention et Secours Civiques de niveau 1
              a pour objectif de faire acquérir à toute personne les capacités
              nécessaires pour concourir par son comportement à la sécurité civile.
            </p>
            <p className="leading-relaxed">
              Ainsi, elle doit être capable d'exécuter une action citoyenne
              d'assistance à personne en danger en réalisant les gestes
              élémentaires de secours.
            </p>
          </div>
        </div>

        {/* Section Utilité */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-[#0e5399]" />
            <h2 className="text-2xl font-semibold text-[#0e5399]">
              À quoi sert cette formation ?
            </h2>
          </div>
          <div className="space-y-3 font-mk-abel text-gray-700">
            <p className="leading-relaxed">
              La formation PSC1 permet d'obtenir toutes les compétences nécessaires
              de citoyen pour sauver une victime en urgence ou détresse vitale.
            </p>
            <p className="leading-relaxed">
              Vous alternerez ainsi entre cours vidéo-projeté et mise en situation
              réelle pour vous préparer au mieux à la vie de tous les jours.
            </p>
            <p className="leading-relaxed">
              Cette formation est souvent un pré-requis au passage de différents
              concours de la fonction publique ou du privé.
            </p>
          </div>
        </div>

        {/* Section Informations pratiques et Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
                    alt={randomImage.alt || "Formation PSC1"}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="absolute bottom-4 left-4 text-white font-mk-abel">
                      {randomImage.alt || "Formation PSC1"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 font-mk-abel text-center">
                  Aucune image disponible pour le moment.
                </p>
              )}
              <div className="mt-4 text-center">
                <Link
                  href="/galerie"
                  className="inline-flex items-center gap-2 text-[#0e5399] hover:text-blue-700 font-mk-abel"
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
            <div className="space-y-6 font-mk-abel">
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2">
                  Évaluation
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Contrôle continu, participation à au moins un cas concret</li>
                  <li>Fiche d'évaluation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2">
                  Durée de formation
                </h3>
                <div className="relative h-16 w-32">
                  <Image
                    src="/images/content/hours/hours12h.png"
                    alt="12 heures de formation"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2">
                  Prérequis
                </h3>
                <p className="text-gray-700">
                  Inscription individuelle ou par le biais de l'entreprise dans le
                  cadre du compte épargne temps
                </p>
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
          <ul className="space-y-3 font-mk-abel text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Protéger : reconnaître, sans s'exposer soi-même, les dangers persistants
              qui menacent la victime de l'accident et les autres personnes exposées.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Examiner : rechercher les signes qui indiquent que la vie de la
              victime est menacée.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Faire alerter : transmettre aux moyens et aux personnes prévues dans
              l'organisation des secours, les informations nécessaires.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Secourir : intervenir efficacement sur une victime.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Prévention : prévenir les dangers.</span>
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
                     font-mk-abel text-lg"
          >
            <span>S'inscrire à la formation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}