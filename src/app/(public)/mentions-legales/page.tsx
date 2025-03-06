// src/app/(public)/mentions-legales/page.tsx
'use client'

import { Building, Mail, Phone, Globe } from 'lucide-react';
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
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50
                   transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-3 rounded-full bg-blue-50">
        <info.icon className="w-6 h-6 text-[#0e5399]" />
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Mentions Légales
          </h1>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Informations de l'association */}
          <div className="space-y-4">
            <h2 className="text-2xl font-mk-abel text-[#0e5399] mb-6">
              Aloha Sauvetage Secourisme
            </h2>
            
            <p className="text-lg font-mk-abel text-gray-700 leading-relaxed">
              Association Loi de 1901, affiliée à la FFSS, association reconnue d'utilité publique.
            </p>
          </div>

          {/* Informations de contact */}
          <div className="grid gap-6 md:grid-cols-2">
            {contactInfos.map((info, index) => (
              <ContactCard key={index} info={info} />
            ))}
          </div>

          {/* CNIL */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 font-mk-abel">
              Numéro de déclaration CNIL : 1858987 v 0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}