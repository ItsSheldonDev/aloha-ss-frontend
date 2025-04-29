"use client";

import { useState, useEffect } from 'react';
import { Phone, Mail, Shield, AlertTriangle, Users, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Agreement {
  code: string;
  description: string;
  icon: React.ReactNode;
}

interface Poste {
  title: string;
  points: string[];
  icon: React.ReactNode;
}

export default function PosteSecours() {
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

  const agreements: Agreement[] = [
    { 
      code: "A", 
      description: "Sécurité de la pratique des activités aquatiques en milieux naturels et artificiels",
      icon: <Shield className="w-8 h-8 text-blue-400" />
    },
    { 
      code: "B", 
      description: "Actions de soutien et d'accompagnement des populations victimes d'accidents, sinistres et catastrophes",
      icon: <Users className="w-8 h-8 text-blue-400" />
    },
    { 
      code: "C", 
      description: "Encadrement des bénévoles dans le cadre des actions de soutien aux populations",
      icon: <Users className="w-8 h-8 text-blue-400" />
    },
    { 
      code: "D", 
      description: "Dispositifs prévisionnels de secours (PAPS à GE)",
      icon: <AlertTriangle className="w-8 h-8 text-blue-400" />
    },
  ];

  const postes: Poste[] = [
    {
      title: "Les PAPS (Point d'Alerte et de Premiers Secours)",
      points: [
        "Petite manifestation, non dangereuse",
        "Une équipe de 2 secouristes sur place avec matériel d'oxygènothérapie et DSA et de communication.",
      ],
      icon: <Shield className="w-10 h-10 text-blue-500" />
    },
    {
      title: "Les Postes de Secours de Petite Envergure",
      points: [
        "La plupart des manifestations rentrent dans ce dispositif.",
        "Une à deux équipes de secouristes coordonnées par un chef de poste avec tout le matériel nécessaire d'urgence + un poste de secours.",
        "Le poste de secours peut être mobile en fonction des manifestations.",
      ],
      icon: <Users className="w-10 h-10 text-blue-500" />
    },
    {
      title: "Les postes de moyenne et grandes envergures",
      points: [
        "Pour les grandes manifestations",
        "Au minimum 3 équipes de secours coordonnées par un chef de dispositif avec tout le matériel nécessaire d'urgence + un poste de secours.",
      ],
      icon: <FileText className="w-10 h-10 text-blue-500" />
    },
  ];

  const missions = [
    "Assurer une protection adapté et permanente",
    "Réaliser les bilans et gestes de secours nécessaires ainsi qu'une surveillance et une transmission au SAMU",
    "Adopter sa conduite à la situation ou à l'état de la victime (risque viral ou infectieux)",
    "S'organiser en fonction de la situation",
  ];

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
          <div 
            className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h1 className="text-5xl md:text-7xl font-art-brush mb-6 tracking-wide text-white text-shadow-lg">
              <span className="relative">
                Poste de Secours
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              Sécurisez vos événements avec nos dispositifs prévisionnels de secours
            </p>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Introduction */}
        <div 
          className={`max-w-4xl mx-auto mb-20 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet de vague décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="space-y-6 font-mk-abel text-lg text-gray-700 relative z-10">
              <p className="leading-relaxed">
                Un dispositif prévisionnel de secours à personnes (D.P.S.) est l'ensemble des moyens humains et matériels de premiers secours à personnes pré-positionnés lors d'un rassemblement ou d'une manifestation de personnes : Concert, kermesse, réunion, match…
              </p>
              <p className="leading-relaxed">
                Conformément à l'arrêté du 12 novembre 2015 et sous l'égide du Comité Départemental FFSS 56 possédant les agréments A et D, Aloha Sauvetage Secourisme assure la sécurité de vos évènements par l'organisation d'un poste de secours terrestre et/ou aquatique.
              </p>
              <p className="leading-relaxed">
                Si vous souhaitez organiser une manifestation publique, la mise en place d'un dispositif prévisionnel de secours est obligatoire. Aloha Sauvetage Secourisme, association FFSS agréée de sécurité civile, s'engage dans la sécurité de vos manifestations par la mise en place de matériel et d'une équipe de secouriste compétente.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
              <a href="mailto:contact@aloha-sauvetage.fr" 
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                <Mail className="w-5 h-5" />
                <span>contact@aloha-sauvetage.fr</span>
                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
              </a>
              <a href="tel:0641543355" 
                className="group flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-full border border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                <Phone className="w-5 h-5 text-blue-500" />
                <span>06 41 54 33 55</span>
                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>

        {/* Agréments */}
        <div 
          className={`mb-20 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-3xl font-mk-abel text-blue-800 mb-8 text-center relative z-10 flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Les agréments du CD56</span>
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {agreements.map((agreement, index) => (
              <div key={index} 
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl border border-blue-100 transform hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {agreement.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-700 text-xl mb-2">Agrément {agreement.code}</h3>
                    <p className="font-mk-abel text-gray-700">{agreement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Types de postes */}
        <div 
          className={`mb-20 transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-3xl font-mk-abel text-blue-800 mb-8 text-center relative z-10 flex items-center justify-center gap-3">
            <AlertTriangle className="w-8 h-8 text-blue-600" />
            <span>Dispositifs terrestres disponibles</span>
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {postes.map((poste, index) => (
              <div key={index} 
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl border border-blue-100 transform hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="mb-6 bg-blue-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  {poste.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">{poste.title}</h3>
                <ul className="space-y-3">
                  {poste.points.map((point, idx) => (
                    <li key={idx} className="font-mk-abel flex items-start gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Missions */}
        <div 
          className={`transition-all duration-700 delay-400 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl text-white relative overflow-hidden">
            {/* Effet de vague décoratif */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20">
              <div className="absolute bottom-0 left-0 w-[200%] h-full bg-wave-pattern animate-wave"></div>
            </div>
            
            <div className="p-8 md:p-10 relative z-10">
              <h2 className="text-3xl font-mk-abel mb-8 text-center flex items-center justify-center gap-3">
                <FileText className="w-7 h-7" />
                <span>Notre mission lors des postes de secours</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {missions.map((mission, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-start gap-3 hover:bg-white/20 transition-colors">
                    <div className="bg-white/20 rounded-full p-2 flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-mk-abel text-white/90">{mission}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-wave {
          animation: wave 18s linear infinite;
        }
        
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .bg-pattern-waves {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%230e5399' fill-opacity='0.05' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/svg%3E");
        }
        
        .bg-wave-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' class='shape-fill'%3E%3C/path%3E%3C/svg%3E");
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
}