// src/app/sauvetage-sportif/eau-plate/page.tsx

import { Timer, Users, LifeBuoy, PersonStanding, Trophy, HelpingHand } from 'lucide-react';

interface Competition {
  title: string;
  description: string;
  details?: string;
  icon?: any;
}

const competitions: Competition[] = [
  {
    title: "Obstacles",
    description: "Cette épreuve simule le passage d'obstacles par le sauveteur lors de la recherche d'une personne en détresse en un minimum de temps. L'obstacle sera de 2m50 sur 70cm et placé à 12m50 du bord.",
    icon: Timer
  },
  {
    title: "Mannequin avec Palmes",
    description: "Cette épreuve permet au sauveteur d'agir plus vite lors de la recherche de la personne en détresse grâce à un équipement supplémentaire (les palmes qui seront de 65cm sur 30cm maxi).",
    details: "Le sauveteur doit effectuer 50m en nage libre avec ses palmes puis plonger vers le mannequin placé entre 1m80 et 3m de profondeur, le remonter et le remorquer sur 50m.",
    icon: PersonStanding
  },
  {
    title: "Mannequin",
    description: "Cette épreuve se court sur 50 m. Elle symbolise la recherche de la personne en détresse et son remorquage en surface en un minimum de temps.",
    details: "Après avoir parcouru 25m en nage libre, le sauveteur plonge vers le mannequin placé entre 1m80 et 3m de profondeur, le remonte et le remorque sur 25m.",
    icon: PersonStanding
  },
  {
    title: "Course Combinee",
    description: "Cette épreuve met le sauveteur en présence d'une difficulté supplémentaire par la recherche en apnée de la personne en détresse et son remorquage en surface après l'avoir repérée.",
    details: "Après avoir parcouru 50m en nage libre, le sauveteur doit s'immerger sur une distance de 17,50m, remonter le mannequin et le remorquer sur le reste de la distance.",
    icon: Trophy
  },
  {
    title: "Palmes et Bouee",
    description: "Après avoir parcouru 50m en nage libre avec une bouée tube et des palmes et après avoir touché le bord au virage, le sauveteur doit fixer la bouée tube autour d'un mannequin qui est tenu par un co-équipier et doit le tracter pendant les 50 derniers mètres.",
    icon: LifeBuoy
  },
  {
    title: "Super Sauveteur",
    description: "Après avoir parcouru 75m en nage libre, le sauveteur plonge vers un mannequin placé entre 1m80 et 3m de profondeur, le remonte et le remorque jusqu'à la ligne des 100m. Après avoir touché le mur, il lâche le mannequin et, tout en restant dans l'eau, enfile ses palmes et la bouée tube qui se trouvent sur le bord. Il nage alors 50m, touche le mur, fixe la bouée autour du mannequin et le tracte jusqu'à l'arrivée.",
    icon: Trophy
  }
];

const relais: Competition[] = [
  {
    title: "Relais Obstacles",
    description: "4 sauveteurs se relayent sur 50m en passant sous les obstacles placés à 12,50m du bord.",
    icon: Users
  },
  {
    title: "Relais Mannequin",
    description: "Sur une distance de 100m, quatre sauveteurs se relayent pour remorquer en surface le mannequin qui représente une personne en détresse.",
    icon: Users
  },
  {
    title: "Relais Palmes Bouee",
    description: "Chaque sauveteur effectuera 50 m Nage Libre avec palmes et bouée tube. Le premier effectuera un départ plongé alors que les autres relayeurs partiront dans l'eau. La bouée tube sera considérée comme le témoin lors du passage du relais.",
    icon: LifeBuoy
  },
  {
    title: "Relais Bouee",
    description: "Le 1er sauveteur nage sur 50m. Le 2ème sauveteur nage 50m avec palmes. Le 3ème sauveteur nage 50m en remorquant une bouée tube. Et le 4ème sauveteur, tracte sur 50m le 3ème sauveteur à qui il a passé la Bouée tube. Dans la catégorie Benjamin, le 3ème sauveteur ne sera pas tracté. Le 4ème sauveteur effectuera 50m « nage libre » avec palmes et bouée tube.",
    icon: LifeBuoy
  },
  {
    title: "Relais Sauvetage",
    description: "Le 1er sauveteur nage sur 50m en surface. Le 2ème sauveteur parcourt les 50m avec palmes en apnée totale et remonte le mannequin au 3éme sauveteur qui nage sur 50m en remorquant le mannequin. Enfin, le 4ème sauveteur, chaussé de palmes, tracte sur 50m le mannequin.",
    icon: Users
  },
  {
    title: "Lancer de Corde",
    description: "Un sauveteur lance une corde afin de ramener un autre sauveteur vers le bord de la piscine pour simuler le sauvetage d'une victime avec une corde et ce dans un minimum de temps.",
    icon: HelpingHand
  },
  {
    title: "SERC",
    description: "Épreuve de simulation de sauvetage, qui propose à une équipe de quatre sauveteurs de résoudre différentes situations de détresse et ce dans un temps limite.",
    icon: Users
  }
];

const CompetitionCard = ({ competition }: { competition: Competition }) => {
  const Icon = competition.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl 
                    transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-3 rounded-full bg-blue-50 flex-shrink-0">
            <Icon className="w-6 h-6 text-[#0e5399]" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-indie-pimp text-[#0e5399] mb-3">
            {competition.title}
          </h3>
          <div className="space-y-3 font-mk-abel text-gray-700 leading-relaxed">
            <p>{competition.description}</p>
            {competition.details && (
              <p className="text-gray-600 italic">{competition.details}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EauPlate() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Eau Plate
          </h1>
          <p className="text-xl font-mk-abel max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Les épreuves d'eau plate se déroulent en piscine et permettent aux sportifs 
            de faire de la compétition durant toute l'année quelque soit la saison.
          </p>
        </div>

        {/* Courses Individuelles */}
        <section className="mb-20">
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
            Courses Individuelles
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((competition, index) => (
              <CompetitionCard key={index} competition={competition} />
            ))}
          </div>
        </section>

        {/* Relais */}
        <section className="mb-20">
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
            Les Relais
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relais.map((relai, index) => (
              <CompetitionCard key={index} competition={relai} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}