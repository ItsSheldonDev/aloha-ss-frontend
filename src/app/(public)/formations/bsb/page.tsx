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

export default function BSB() {
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
            Formation BSB
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Brevet de Surveillant de Baignade
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
              Le Brevet de Surveillant de Baignade (BSB) est une qualification permettant
              à un animateur d'attester des compétences dans la surveillance, le sauvetage
              et le secourisme lors de l'encadrement de la baignade d'un groupe d'enfants.
            </p>
            <p className="leading-relaxed">
              Ce Brevet est obligatoire lors d'une baignade dans un lieu non surveillé,
              et sur la majorité des plages de la côte atlantique.
            </p>
            <p className="leading-relaxed">
              Aloha vous propose cette formation en pension complète sur la côte océanique
              afin de vous transmettre des compétences au plus près des réalités tout en
              vivant une expérience de vie en collectivité, formatrice à votre futur
              emploi d'animateur.
            </p>
            <p className="leading-relaxed">
              Dans le cadre d'une baignade organisée en Accueil Collectif de Mineurs (ACM),
              le surveillant de Baignade sera capable de prévenir les dangers, de surveiller
              un milieu aquatique clos, d'assurer sa propre sécurité, celle des animateurs
              et des enfants et de mettre en œuvre la conduite appropriée face à une
              situation d'accident et/ou à une détresse physique.
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
              La formation de Surveillant de Baignade permet à tous jeunes diplômés
              de prendre en charge une baignade d'enfants ou d'adolescents lors d'un
              séjour de colonie de vacances.
            </p>
            <p className="leading-relaxed">
              Cette formation est très recherchée par les organismes de vacances.
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
            <div className="space-y-6 font-mk-abel">
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2">
                  Évaluation
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Évaluation en cours de formation (livret de compétences en annexe)</li>
                  <li>Évaluation certificatives en fin de formation (4 épreuves détaillées en annexe)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#0e5399] mb-2">
                  Durée de formation
                </h3>
                <div className="relative h-16 w-32">
                  <Image
                    src="/images/content/hours/hours35h.png"
                    alt="35 heures de formation"
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
                  Être âgé d'au moins 17 ans le jour du début de la formation
                  (le diplôme ne sera délivré qu'à 18 ans). Fournir un certificat
                  médical de non contre-indication à la pratique de la natation et
                  du sauvetage datant de moins de trois mois. PSC1 (Brevet de Secourisme)
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
              <span>Connaissance de la réglementation des baignades</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>L'organisation et la surveillance de la baignade d'un groupe d'enfants</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Reconnaître un nageur en difficulté et lui porter assistance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Mettre en œuvre les gestes de premiers secours adaptés</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Proposer des animations autour de l'eau avec l'équipe d'encadrement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Premières approches de l'eau et de l'océan, découvrir le milieu aquatique</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Sensibilisation au milieu aquatique et à son respect</span>
            </li>
          </ul>
        </div>

        {/* Bouton d'inscription */}
        <div className="text-center mt-8">
          <Link
            href="/inscription?formation=bsb"
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
