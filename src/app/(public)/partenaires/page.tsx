import Image from 'next/image';
import { logos } from '@/lib/images';
import { ExternalLink } from 'lucide-react';

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

const PartnerCard = ({ partner }: { partner: Partner }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl 
                  transform hover:-translate-y-1 transition-all duration-300">
    <div className="relative h-32 w-full mb-6">
      <Image
        src={partner.logo}
        alt={partner.name}
        fill
        className="object-contain"
      />
    </div>
    <div className="space-y-4">
      <h3 className="text-xl font-mk-abel text-[#0e5399] font-semibold">
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
          className="inline-flex items-center gap-2 text-[#0e5399] hover:text-blue-700 
                   font-mk-abel transition-colors group"
        >
          En savoir plus
          <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </a>
      )}
    </div>
  </div>
);

export default function Partenaires() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Nos Partenaires
          </h1>
          <p className="text-xl font-mk-abel max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Découvrez les partenaires qui nous accompagnent et contribuent à la qualité 
            de nos formations et de nos services.
          </p>
        </div>

        {/* Grille des partenaires */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>

        {/* Note de bas de page */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 font-mk-abel">
            Vous souhaitez devenir partenaire ? 
            <a 
              href="mailto:contact@aloha-sauvetage.fr"
              className="text-[#0e5399] hover:text-blue-700 ml-2"
            >
              Contactez-nous !
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}