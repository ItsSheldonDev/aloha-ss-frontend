'use client'

import { useState, useEffect } from 'react';
import { Building, Mail, Phone, Globe, FileText, Shield } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Spinner } from "@nextui-org/react";

interface ContactInfo {
  label: string;
  value: string;
  icon: any;
  href?: string;
  target?: string;
  isLink?: boolean;
}

const ContactCard = ({ info }: { info: ContactInfo }) => {
  const content = (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-blue-100 shadow-md transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-3 rounded-full bg-blue-50">
        <info.icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-mk-abel text-gray-600 mb-1">
          {info.label}
        </h3>
        <p className="font-mk-abel text-gray-800">
          {info.value}
        </p>
      </div>
    </div>
  );

  if (info.isLink) {
    return (
      <a
        href={info.href}
        target={info.target}
        rel={info.target === '_blank' ? "noopener noreferrer" : undefined}
        className="block hover:no-underline"
      >
        {content}
      </a>
    );
  }
  
  return content;
};

export default function MentionsLegales() {
  const { settings, isLoading } = useSettings();
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-white">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const contactInfos: ContactInfo[] = [
    {
      label: "Siège social",
      value: settings.contact.address,
      icon: Building,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.contact.address)}`,
      target: "_blank",
      isLink: true
    },
    {
      label: "Email",
      value: settings.contact.email,
      icon: Mail,
      href: `mailto:${settings.contact.email}`,
      isLink: true
    },
    {
      label: "Téléphone",
      value: settings.contact.phone,
      icon: Phone,
      href: `tel:${settings.contact.phone.replace(/\s/g, '')}`,
      isLink: true
    },
    {
      label: "Hébergeur",
      value: "IONOS SARL – 7, Place de la gare – BP 70109 – 57201 Sarreguemines Cedex",
      icon: Globe,
      href: "https://www.ionos.fr",
      target: "_blank",
      isLink: true
    }
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
          <div className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-art-brush mb-6 tracking-wide text-white text-shadow-lg">
              <span className="relative">
                Mentions Légales
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            
            {/* Badge centré */}
            <div className={`mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-xl transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <FileText className="text-blue-300 w-6 h-6" />
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Informations légales</div>
                <div className="text-blue-200 text-xs">Association Loi de 1901</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Introduction */}
        <div className={`max-w-4xl mx-auto mb-12 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 text-blue-700 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-mk-abel">Aloha Sauvetage Secourisme</h2>
              </div>
              
              <p className="text-lg font-mk-abel text-gray-700 leading-relaxed mb-4">
                Association Loi de 1901, affiliée à la FFSS, association reconnue d'utilité publique.
              </p>
            </div>
          </div>
        </div>

        {/* Informations de contact */}
        <div className={`mb-16 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-mk-abel text-blue-800 mb-8 text-center relative flex items-center justify-center gap-3">
            <Building className="w-7 h-7 text-blue-600" />
            <span>Coordonnées</span>
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {contactInfos.map((info, index) => (
              <ContactCard key={index} info={info} />
            ))}
          </div>
        </div>

        {/* CNIL */}
        <div className={`transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl text-white relative overflow-hidden">
            <div className="p-8 relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/20 rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-white font-mk-abel text-lg mb-2">
                Protection des données
              </p>
              <p className="text-blue-100 font-mk-abel mb-4">
                Numéro de déclaration CNIL : 1858987 v 0
              </p>
              <p className="text-sm text-blue-200/80">
                Conformément à la loi informatique et libertés du 6 janvier 1978, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
              </p>
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
      `}</style>
    </div>
  );
}