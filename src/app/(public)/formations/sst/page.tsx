"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, CheckSquare, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  filename: string;
  alt: string;
  category: string;
  url: string;
}

export default function SST() {
  const [randomImage, setRandomImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await fetch('/api/gallery?mode=random');
        if (!response.ok) throw new Error('Erreur lors du chargement des images');
        const data = await response.json();
        setRandomImage(data[0]); // On prend la première image aléatoire
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchRandomImage();
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-[#0e5399] mb-4">
            Formation SST
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Sauveteur Secouriste du Travail
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
              Devenir secouriste et auxiliaire de prévention au sein de son entreprise.
            </p>
            <p className="leading-relaxed">
              Dans son entreprise, le sauveteur secouriste du travail intervient dans un
              cadre juridique fixé par le code du travail et le code pénal. « Lors d'un
              accident, l'action du SST s'articule avec celles menées par les autres
              acteurs du secours. Sa connaissance du mécanisme d'apparition de l'accident
              et son aptitude à repérer les situations dangereuses et à les signaler lui
              permettent de se positionner en tant qu'acteur de prévention dans son entreprise. »
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
              Le Code du travail (articles R241-39 , L241-10 et D711-12) rend obligatoire
              la présence d'un membre du personnel ayant reçu l'instruction nécessaire pour
              donner les premiers secours en cas d'urgence, dans chaque atelier où sont
              effectués des travaux dangereux et sur chaque chantier occupant 20 personnes
              au moins pendant plus de 15 jours où sont effectués des travaux dangereux.
            </p>
            <p className="leading-relaxed">
              En dehors du caractère légal, cette formation permet de donner aux personnels
              toutes les compétences de préventions et d'interventions nécessaires en entreprise.
              L'objectif du SST est de diminuer le nombre d'accidents en entreprise et ainsi
              diminuer le nombre de jours d'arrêts de travail.
            </p>
          </div>
        </div>

        {/* Section Informations pratiques et Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image aléatoire */}
          {randomImage && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-[#0e5399] mb-4">
                  Nos formations en images
                </h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={randomImage.url}
                    alt={randomImage.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="absolute bottom-4 left-4 text-white font-mk-abel">
                      {randomImage.alt}
                    </p>
                  </div>
                </div>
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
          )}

          {/* Informations pratiques */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[#0e5399]" />
              <h2 className="text-2xl font-semibold text-[#0e5399]">
                Informations pratiques
              </h2>
            </div>
            <div className="space-y-4 font-mk-abel">
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2 text-sm">
                  Évaluation
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Contrôle continu, participation à au moins un cas concret</li>
                  <li>Fiche d'évaluation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2 text-sm">
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
                <h3 className="font-semibold text-[#0e5399] mb-2 text-sm">
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
              l'organisation des secours de l'entreprise, les informations nécessaires pour
              organiser l'intervention.</span>
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
            href="/inscription?formation=sst"
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
