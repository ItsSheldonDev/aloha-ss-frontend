// src/components/formations/FormationCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Formation, TypeFormation, formatDate } from '@/lib/api';

// Mapping des types de formation vers leurs images
const formationTypeImages: Record<TypeFormation, string> = {
  PSC1: "/images/content/formations/PSC1.png",
  SST: "/images/content/formations/SST.png",
  PSE1: "/images/content/formations/PSE1.png",
  PSE2: "/images/content/formations/PSE2.png",
  BNSSA: "/images/content/formations/BNSSA.png",
  SSA: "/images/content/formations/SSA.png",
  BSB: "/images/content/formations/BSB.png",
  GQS: "/images/content/formations/PSC1.png", // Utiliser une image par défaut
  FORMATEUR: "/images/content/formations/PSE2.png", // Utiliser une image par défaut
  RECYCLAGE: "/images/content/formations/PSE1.png", // Utiliser une image par défaut
  PERMIS: "/images/content/formations/BNSSA.png", // Ajout pour le type PERMIS
};

// Mapping des types de formation vers leurs descriptions
const formationTypeDescriptions: Record<TypeFormation, string> = {
  PSC1: "La formation PSC1 permet d'obtenir toutes les compétences nécessaires de citoyen pour sauver une victime en urgence ou détresse vitale.",
  SST: "Devenir secouriste et auxiliaire de prévention au sein de son entreprise.",
  PSE1: "Cette formation permet d'avoir les compétences minimum de secourisme professionnel. Elle est indispensable lorsqu'une personne souhaite travailler sur les postes de secours.",
  PSE2: "La formation PSE2 permet d'obtenir les compétences supplémentaires telles que la maîtrise des immobilisations ou des relevages qu'un secouriste ne connaît pas.",
  BNSSA: "Le diplôme du BNSSA est le diplôme nécessaire pour toutes surveillances de bassins, lacs ou océans.",
  SSA: "La formation SSA permet de connaître toutes les techniques utiles et indispensables pour travailler sur plage.",
  BSB: "La formation de Surveillant de Baignade permet à tous jeunes diplômés de prendre en charge une baignade d'enfants ou d'adolescents lors d'un séjour de colonie de vacances.",
  GQS: "Les Gestes Qui Sauvent permettent d'apprendre les gestes essentiels du secours d'urgence.",
  FORMATEUR: "Formation pour devenir formateur dans le domaine du secourisme.",
  RECYCLAGE: "Recyclage et mise à niveau des compétences en secourisme.",
  PERMIS: "Permis Côtier Citoyen, incluant une formation PSC pour une navigation sécurisée.", // Ajout pour le type PERMIS
};

interface FormationCardProps {
  formation: Formation | {
    title: string;
    image: string;
    description: string;
    link: string;
    type?: TypeFormation;
  };
  variant?: 'default' | 'compact' | 'featured';
  showDate?: boolean;
  showPrice?: boolean;
}

export default function FormationCard({
  formation,
  variant = 'default',
  showDate = false,
  showPrice = false,
}: FormationCardProps) {
  // Détermine si c'est une Formation complète ou juste un objet simple
  const isFullFormation = 'id' in formation && 'dateDebut' in formation;
  
  // Si c'est une Formation complète
  const title = isFullFormation ? formation.titre : formation.title;
  const link = isFullFormation 
    ? `/formations/${formation.type.toLowerCase()}`
    : formation.link;
  const description = isFullFormation 
    ? formationTypeDescriptions[formation.type] || ''
    : formation.description;
  const image = isFullFormation 
    ? formationTypeImages[formation.type] || '/images/content/formations/PSC1.png'
    : formation.image;
  const type = isFullFormation ? formation.type : formation.type;

  // Gestion des dates et prix pour les formations complètes
  const formattedDate = isFullFormation ? formatDate(formation.dateDebut) : '';
  const price = isFullFormation ? formation.prix : '';

  if (variant === 'compact') {
    return (
      <Link href={link} className="block">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 transition-all duration-300 border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
              <Image 
                src={image} 
                alt={title} 
                fill 
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h3 className="font-indie-pimp text-lg text-[#0e5399]">{title}</h3>
              {showDate && isFullFormation && (
                <p className="text-sm text-gray-500">{formattedDate}</p>
              )}
            </div>
            {showPrice && isFullFormation && (
              <div className="ml-auto">
                <p className="font-semibold text-[#0e5399]">{price}</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={link} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
                    transform hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-indie-pimp text-[#0e5399] mb-3
                       group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
          <p className="font-mk-abel text-gray-600 text-base leading-relaxed mb-4">
            {description}
          </p>
          
          {showDate && isFullFormation && (
            <p className="font-mk-abel text-gray-600 mb-2">
              <span className="font-semibold">Date :</span> {formattedDate}
            </p>
          )}
          
          {showPrice && isFullFormation && (
            <p className="font-mk-abel text-gray-700 font-semibold mb-4">
              Prix : {price}
            </p>
          )}
          
          <div className="flex items-center text-[#0e5399] font-mk-abel
                        group-hover:text-blue-700 transition-colors">
            <span>En savoir plus</span>
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}