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

export default function BNSSA() {
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
            Formation BNSSA
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Brevet National de Sécurité et de Sauvetage Aquatique
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
              Le brevet national de sécurité et de sauvetage aquatique (B.N.S.S.A)
              est le diplôme du nageur sauveteur.
            </p>
            <p className="leading-relaxed">
              Le B.N.S.S.A permet de surveiller des plages ou piscines publiques,
              privées, et d'assister les Brevet d'État d'éducateur sportif option
              activités de la natation (B.E.E.S.A.N) dans la surveillance des piscines
              publiques.
            </p>
            <p className="mb-2">À l'issue de la formation, vous serez capable de :</p>
            <ul className="space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="text-[#0e5399] font-bold">•</span>
                <span>Prévenir les usagers des risques de la baignade par une information
                explicite, et des conditions météorologiques permettant ou non la baignade.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#0e5399] font-bold">•</span>
                <span>Surveiller la zone de baignade, en observant particulièrement les
                comportements des individus, et en essayant d'anticiper les dérives afin
                d'intervenir au plus vite. Intervenir rapidement et efficacement dans les
                cas de noyade, sans mettre en danger sa vie ni celle des autres.</span>
              </li>
            </ul>
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
              Le diplôme du BNSSA est le diplôme nécessaire pour toutes surveillances
              de bassins, lacs ou océans. Il permettra d'acquérir les compétences
              minimales de sauvetage aquatique.
            </p>
            <p className="leading-relaxed">
              De plus, il est aussi possible avec ce diplôme de surveiller les
              groupes de jeunes en colonie de vacances.
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
                <p className="text-gray-700">
                  Afin d'être présenté à l'examen du BNSSA, le candidat devra avoir
                  réussi un test de BNSSA blanc et avoir été assidu lors des entraînements.
                </p>
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
              <span>Protéger : reconnaître les dangers persistants sans s'exposer soi-même.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Examiner : rechercher les signes qui indiquent que la vie de la
              victime est menacée.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Faire alerter : transmettre les informations nécessaires pour
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
            href="/inscription?formation=bnssa"
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
