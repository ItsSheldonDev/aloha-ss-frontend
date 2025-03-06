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

export default function PSE1() {
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
            Formation PSE1
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Premiers Secours en Équipe de niveau 1
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
              Dans le cadre de la formation des acteurs de la sécurité civile, il
              est institué une unité d'enseignement nommé « PSE1 » permettant de
              tenir la fonction de « SECOURISTE ». Celui-ci sera capable de porter
              secours, sur un plan technique et humain, à une ou plusieurs victimes,
              en agissant seul ou au sein d'une équipe, avec ou sans matériel, dans
              l'attente ou en complément des services publics de secours concernés.
            </p>
            <p className="leading-relaxed font-semibold text-[#0e5399]">
              Cette formation peut totalement être prise en charge par l'association
              en échange de votre engagement. N'hésitez pas !
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
              Cette formation permet d'avoir les compétences minimum de secourisme
              professionnel. Elle est indispensable lorsqu'une personne souhaite
              travailler sur les postes de secours (mission de sécurité civile).
              C'est aussi un pré-requis indispensable pour le passage du BNSSA
              (Brevet National de Sécurité et Sauvetage Aquatique).
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
                  <li>Avoir suivi la totalité de la formation</li>
                  <li>Satisfaire aux modalités certificatives définies dans le RIFC FFSS</li>
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
                  Avoir 16 ans minimum
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
              <span>Évoluer dans le cadre juridique applicable à son action de secours
              et dans le respect des procédures définies par son autorité d'emploi.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Assurer une protection adaptée et permanente.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Réaliser les bilans nécessaires (circonstanciel, vital, complémentaire)
              ainsi qu'une surveillance et une transmission des informations au service adapté.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Adopter sa conduite à la situation ou à l'état de la victime
              (risque viral ou infectieux).</span>
            </li>
            <li className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-[#0e5399] font-bold">•</span>
                <span>Réaliser les gestes de premiers secours face à une personne :</span>
              </div>
              <ul className="pl-8 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Victime en arrêt cardiaque</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Victime de détresse circulatoire, neurologique, respiratoire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Victime d'hémorragie</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Victime d'obstruction partielle ou totale des voies aériennes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Victime de perte de connaissance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Victime de traumatismes de membres ou de la peau (brûlures, plaies)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0e5399] font-bold">-</span>
                  <span>Victime de malaise</span>
                </li>
              </ul>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0e5399] font-bold">•</span>
              <span>Assister des équipiers-secouristes, lors des manœuvres
              d'immobilisation, de relevage ou de brancardages.</span>
            </li>
          </ul>
        </div>

        {/* Bouton d'inscription */}
        <div className="text-center mt-8">
          <Link
            href="/inscription?formation=pse1"
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
