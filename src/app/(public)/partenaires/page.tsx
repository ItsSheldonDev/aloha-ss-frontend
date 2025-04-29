"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { logos } from '@/lib/images';
import { ExternalLink, Building, Handshake, Heart } from 'lucide-react';

interface Partner {
  name: string;
  logo: string;
  description: string;
  link?: string;
}

const partners: Partner[] = [
  {
    name: "THIEU - Graphiste",
    logo: logos.thieu,
    description: "Notre partenaire créatif pour toute notre identité visuelle et notre communication graphique.",
    link: "https://www.thieu.fr"
  },
  {
    name: "Certification Qualiopi",
    logo: logos.qualiopi,
    description: "Notre centre de formation est certifié Qualiopi, garantissant la qualité des processus et des prestations de formation.",
    link: "https://travail-emploi.gouv.fr/formation-professionnelle/acteurs-cadre-et-qualite-de-la-formation-professionnelle/article/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation"
  },
  {
    name: "FFSS",
    logo: logos.ffss,
    description: "La Fédération Française de Sauvetage et de Secourisme, notre fédération de rattachement pour le sauvetage sportif.",
    link: "https://www.ffss.fr"
  },
  {
    name: "École de Sauvetage Sportif",
    logo: logos.ess,
    description: "Label national attribué aux clubs de sauvetage sportif répondant aux critères de qualité de la FFSS.",
    link: "https://www.ffss.fr/public/880-labelisation-des-clubs.php"
  }
];

const PartnerCard = ({ partner, index }: { partner: Partner, index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl
                transform hover:-translate-y-2 transition-all duration-300 h-full relative overflow-hidden
                transition-all duration-700 delay-200 ease-out
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Effet de vague décoratif */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-blue-100/30 opacity-20 transition-transform duration-700 group-hover:scale-150"></div>
      
      <div className="relative z-10">
        <div className="relative h-32 w-full mb-6 transform transition-transform duration-500 hover:scale-105">
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-mk-abel text-blue-700 font-semibold">
            {partner.name}
          </h3>
          <p className="text-gray-600 font-mk-abel leading-relaxed">
            {partner.description}
          </p>
          {partner.link && (
            <a
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700
                      font-mk-abel transition-colors group mt-2"
            >
              <span className="border-b border-blue-300 pb-0.5">En savoir plus</span>
              <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Partenaires() {
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
                Nos Partenaires
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              Découvrez les partenaires qui nous accompagnent et contribuent à notre réussite
            </p>
            
            {/* Badge centré */}
            <div className={`mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-xl transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Handshake className="text-blue-300 w-6 h-6" />
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Ensemble pour la sécurité</div>
                <div className="text-blue-200 text-xs">Merci à nos partenaires</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Introduction */}
        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 text-blue-700 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-mk-abel">Nos collaborations</h2>
              </div>
              
              <p className="text-lg font-mk-abel text-gray-700 leading-relaxed mb-4">
                Chez Aloha Sauvetage Secourisme, nous croyons en la force des partenariats. Nous travaillons 
                avec des organismes de confiance qui partagent nos valeurs d'excellence et d'engagement pour la sécurité.
                Ces collaborations nous permettent de vous offrir des formations et des services de la plus haute qualité.
              </p>
            </div>
          </div>
        </div>

        {/* Grille des partenaires */}
        <div className={`mb-16 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-mk-abel text-blue-800 mb-10 text-center relative flex items-center justify-center gap-3">
            <Handshake className="w-7 h-7 text-blue-600" />
            <span>Ils nous font confiance</span>
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner, index) => (
              <PartnerCard key={index} partner={partner} index={index} />
            ))}
          </div>
        </div>

        {/* Section finale */}
        <div className={`transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl text-white relative overflow-hidden">
            <div className="p-8 relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/20 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-mk-abel mb-4">Devenez notre partenaire</h3>
              <p className="text-blue-100 font-mk-abel max-w-2xl mx-auto mb-8">
                Vous souhaitez vous associer à nos activités et participer à notre mission de sécurité et de sauvetage ?
                Nous sommes toujours ouverts à de nouvelles collaborations.
              </p>
              <a
                href="mailto:contact@aloha-sauvetage.fr"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <span>Contactez-nous</span>
                <ExternalLink className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour les animations et effets */}
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .bg-pattern-waves {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%230e5399' fill-opacity='0.05' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/svg%3E");
        }
        
        /* Vagues CSS pures */
        .waves-bottom {
          position: absolute;
          width: 100%;
          height: 100%;
          bottom: 0;
        }
        
        .waves-bottom .wave {
          position: absolute;
          width: 200%;
          height: 100%;
          background: white;
          opacity: 0.2;
          border-radius: 50% 50% 0 0;
          left: 0;
          bottom: 0;
        }
        
        .waves-bottom .wave:nth-child(1) {
          opacity: 0.2;
          bottom: 0;
          animation: movewave 10s linear infinite;
        }
        
        .waves-bottom .wave:nth-child(2) {
          opacity: 0.15;
          bottom: 5px;
          animation: movewave 15s linear infinite reverse;
        }
        
        .waves-bottom .wave:nth-child(3) {
          opacity: 0.1;
          bottom: 10px;
          animation: movewave 20s linear infinite;
        }
        
        @keyframes movewave {
          0% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-25%) scale(1.5, 0.8); }
          100% { transform: translateX(-50%) scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}