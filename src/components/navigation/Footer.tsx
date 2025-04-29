// src/components/navigation/Footer.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  Instagram, 
  Facebook, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Heart, 
  FileText, 
  ShieldAlert, 
  Users, 
  ArrowUpCircle 
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from 'react';

export default function Footer() {
  const { settings, isLoading } = useSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Gestion du bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const links = [
    { label: "Mentions légales", href: "/mentions-legales", icon: <FileText size={16} /> },
    { label: "Mieux nous connaître", href: "/mieux-nous-connaitre", icon: <Heart size={16} /> },
    { label: "Conditions Générales de vente", href: "/cgv", icon: <FileText size={16} /> },
    { label: "Incidents et réclamations", href: "/incidents", icon: <ShieldAlert size={16} /> },
    { label: "Nos Partenaires", href: "/partenaires", icon: <Users size={16} /> },
  ];

  if (isLoading) {
    return (
      <footer className="bg-gradient-to-b from-blue-700 to-blue-900 text-white">
        <div className="flex justify-center items-center p-12">
          <Spinner color="white" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative bg-gradient-to-b from-blue-700 to-blue-900 text-white pt-12 pb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Logo et Contact Information */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center md:justify-start mb-8">
              <div className="relative w-40 h-14">
                <Image
                  src="/images/logos/aloha_white.png"
                  alt="Aloha Sauvetage Secourisme"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="drop-shadow-lg"
                />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-white border-b border-blue-400/30 pb-2 mb-4">
              Restons en contact
            </h3>
            
            <div className="space-y-4">
              {settings.contact.phone && (
                <a
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-white/10 rounded-full group-hover:bg-blue-500 transition-colors">
                    <Phone size={16} className="text-white" />
                  </div>
                  <span className="group-hover:text-blue-200 transition-colors">{settings.contact.phone}</span>
                </a>
              )}
              
              {settings.contact.email && (
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-white/10 rounded-full group-hover:bg-blue-500 transition-colors">
                    <Mail size={16} className="text-white" />
                  </div>
                  <span className="group-hover:text-blue-200 transition-colors">{settings.contact.email}</span>
                </a>
              )}
              
              {settings.contact.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.contact.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-white/10 rounded-full group-hover:bg-blue-500 transition-colors">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <span className="group-hover:text-blue-200 transition-colors">{settings.contact.address}</span>
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white border-b border-blue-400/30 pb-2 mb-4">
              Informations utiles
            </h3>
            
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-2 bg-white/10 rounded-full group-hover:bg-blue-500 transition-colors">
                      {link.icon}
                    </div>
                    <span className="group-hover:text-blue-200 transition-colors">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certification et Réseaux Sociaux */}
          <div className="space-y-8">
            {/* Certification */}
            <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <Award size={24} className="text-yellow-300" />
                <h3 className="text-xl font-semibold text-white">Certifié Qualiopi</h3>
              </div>
              <p className="text-sm text-blue-100 mb-2">Centre de formation professionnelle</p>
              <div className="flex justify-center mt-4">
              </div>
            </div>
            
            {/* Réseaux sociaux */}
            <div>
              <h3 className="text-xl font-semibold text-white border-b border-blue-400/30 pb-2 mb-4">
                Suivez-nous
              </h3>
              
              <div className="flex gap-3">
                {settings.social.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg hover:scale-110 transition-transform"
                    aria-label="Suivez-nous sur Instagram"
                  >
                    <Instagram size={20} className="text-white" />
                  </a>
                )}
                
                {settings.social.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg hover:scale-110 transition-transform"
                    aria-label="Suivez-nous sur Facebook"
                  >
                    <Facebook size={20} className="text-white" />
                  </a>
                )}
                
                <a
                  href={`mailto:${settings.contact.email || 'contact@aloha-sauvetage.fr'}`}
                  className="p-3 bg-gradient-to-br from-green-600 to-green-500 rounded-lg hover:scale-110 transition-transform"
                  aria-label="Contactez-nous par email"
                >
                  <Mail size={20} className="text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-blue-400/20 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white">
          <p>© {new Date().getFullYear()} Aloha Sauvetage Secourisme. Tous droits réservés.</p>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <span>Site conçu avec</span>
            <Heart size={14} className="text-red-400 animate-pulse" />
            <span>en Bretagne</span>
          </div>
        </div>
      </div>
      
      {/* Bouton de retour en haut */}
      <button
        onClick={scrollToTop}
        className={`fixed right-5 bottom-5 p-2 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg z-50 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        aria-label="Retour en haut"
      >
        <ArrowUpCircle size={24} className="text-white" />
      </button>
      
      {/* Effet de vagues animées en bas du footer */}
      <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden opacity-10">
        <div className="wave1 absolute bottom-0 left-0 w-full h-full"></div>
        <div className="wave2 absolute bottom-0 left-0 w-full h-full"></div>
      </div>
      
      {/* Styles pour les vagues animées */}
      <style jsx>{`
        @keyframes wave1 {
          0% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-25%) scale(1.02); }
          100% { transform: translateX(-50%) scale(1); }
        }
        
        @keyframes wave2 {
          0% { transform: translateX(0) scale(1); }
          50% { transform: translateX(25%) scale(0.98); }
          100% { transform: translateX(50%) scale(1); }
        }
        
        .wave1, .wave2 {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-31.8z' fill='%23ffffff'/%3E%3C/svg%3E");
          background-position: center;
          background-repeat: repeat-x;
          width: 200%;
          height: 100%;
        }
        
        .wave1 {
          animation: wave1 15s linear infinite;
        }
        
        .wave2 {
          opacity: 0.7;
          animation: wave2 20s linear infinite;
        }
      `}</style>
    </footer>
  );
}