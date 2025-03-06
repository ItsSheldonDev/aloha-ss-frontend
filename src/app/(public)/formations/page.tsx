import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Formation {
  title: string;
  image: string;
  description: string;
  link: string;
}

const formations = {
  premiersSecours: [
    {
      title: "PSC1",
      image: "/images/content/formations/PSC1.png",
      description: "La formation PSC1 permet d'obtenir toutes les compétences nécessaires de citoyen pour sauver une victime en urgence ou détresse vitale.",
      link: "/formations/psc1"
    },
    {
      title: "SST",
      image: "/images/content/formations/SST.png",
      description: "Devenir secouriste et auxiliaire de prévention au sein de son entreprise.",
      link: "/formations/sst"
    }
  ],
  secoursEquipe: [
    {
      title: "PSE1",
      image: "/images/content/formations/PSE1.png",
      description: "Cette formation permet d'avoir les compétences minimum de secourisme professionnel. Elle est indispensable lorsqu'une personne souhaite travailler sur les postes de secours.",
      link: "/formations/pse1"
    },
    {
      title: "PSE2",
      image: "/images/content/formations/PSE2.png",
      description: "La formation PSE2 permet d'obtenir les compétences supplémentaires telles que la maîtrise des immobilisations ou des relevages qu'un secouriste ne connaît pas.",
      link: "/formations/pse2"
    }
  ],
  sauvetageAquatique: [
    {
      title: "BNSSA",
      image: "/images/content/formations/BNSSA.png",
      description: "Le diplôme du BNSSA est le diplôme nécessaire pour toutes surveillances de bassins, lacs ou océans.",
      link: "/formations/bnssa"
    },
    {
      title: "SSA",
      image: "/images/content/formations/SSA.png",
      description: "La formation SSA permet de connaître toutes les techniques utiles et indispensables pour travailler sur plage.",
      link: "/formations/ssa"
    },
    {
      title: "BSB",
      image: "/images/content/formations/BSB.png",
      description: "La formation de Surveillant de Baignade permet à tous jeunes diplômés de prendre en charge une baignade d'enfants ou d'adolescents lors d'un séjour de colonie de vacances.",
      link: "/formations/bsb"
    }
  ]
} as const;

interface FormationCardProps {
  formation: Formation;
}

const FormationCard = ({ formation }: FormationCardProps) => (
  <Link href={formation.link} className="group">
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
                    transform hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={formation.image}
          alt={formation.title}
          fill
          className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-indie-pimp text-[#0e5399] mb-3
                       group-hover:text-blue-700 transition-colors">
          {formation.title}
        </h3>
        <p className="font-mk-abel text-gray-600 text-base leading-relaxed mb-4">
          {formation.description}
        </p>
        <div className="flex items-center text-[#0e5399] font-mk-abel
                        group-hover:text-blue-700 transition-colors">
          <span>En savoir plus</span>
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </div>
  </Link>
);

export default function Formations() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-white">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-[#0e5399] mb-6">
            Nos Formations
          </h1>
          <p className="text-xl font-mk-abel max-w-2xl mx-auto text-gray-700">
            Découvrez nos formations professionnelles en secourisme et sauvetage
          </p>
        </div>

        {/* Premiers Secours */}
        <section className="mb-24">
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
            Premiers Secours
          </h2>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {formations.premiersSecours.map((formation, index) => (
              <FormationCard key={index} formation={formation} />
            ))}
          </div>
        </section>

        {/* Secours en équipe */}
        <section className="mb-24">
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
            Secours en Équipe
          </h2>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {formations.secoursEquipe.map((formation, index) => (
              <FormationCard key={index} formation={formation} />
            ))}
          </div>
        </section>

        {/* Sauvetage Aquatique */}
        <section className="mb-24">
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
            Sauvetage Aquatique
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {formations.sauvetageAquatique.map((formation, index) => (
              <FormationCard key={index} formation={formation} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
