// src/components/navigation/Footer.tsx
"use client"

import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Spinner } from "@nextui-org/react";

export default function Footer() {
  const { settings, isLoading } = useSettings();

  const links = [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Mieux nous connaitre", href: "/mieux-nous-connaitre" },
    { label: "Conditions Générales de vente", href: "/cgv" },
    { label: "Incidents et réclamations", href: "/incidents" },
    { label: "Nos Partenaires", href: "/partenaires" }
  ];

  if (isLoading) {
    return (
      <footer className="bg-[#0e5399] text-white">
        <div className="flex justify-center items-center p-12">
          <Spinner color="white" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#0e5399] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-art-brush text-2xl text-white">Nous Contacter :</h3>
            <div className="space-y-2 font-mk-abel text-white">
              <p>
                <a 
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="text-white hover:text-[#3485c6] transition-colors"
                >
                  Téléphone : {settings.contact.phone}
                </a>
              </p>
              <p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.contact.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#3485c6] transition-colors"
                >
                  Adresse : {settings.contact.address}
                </a>
              </p>
              <p>
                <a 
                  href={`mailto:${settings.contact.email}`}
                  className="text-white hover:text-[#3485c6] transition-colors"
                >
                  Mail : {settings.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <ul className="space-y-2 font-mk-abel">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-[#3485c6] transition-colors"
                  >
                    - {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certification et Réseaux Sociaux */}
          <div className="space-y-6">
            <div className="font-mk-abel text-center">
              <p className="text-lg mb-2 text-white">Certifié Qualiopi</p>
              <p className="text-sm text-white">Centre de formation professionnelle</p>
            </div>
            
            <div className="flex justify-center space-x-4">
              {settings.social.instagram && (
                <a 
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#3485c6] transition-colors"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <Instagram size={24} />
                </a>
              )}
              {settings.social.facebook && (
                <a 
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#3485c6] transition-colors"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <Facebook size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}