// src/app/sauvetage-sportif/cotier/page.tsx

import { Waves, Flag, Users, Timer, Sailboat, Trophy } from 'lucide-react';

interface Epreuve {
  title: string;
  description: string;
  icon?: any;
}

const epreuves: Epreuve[] = [
  {
    title: "Nage",
    description: "Les sauveteurs partent de la plage et doivent nager, contourner les bouées correspondant à l'épreuve et revenir sur la plage pour franchir la ligne d'arrivée.",
    icon: Waves
  },
  {
    title: "Planche de Sauvetage",
    description: "Les sauveteurs partent de la plage, avec leur planche de sauvetage et doivent effectuer un parcours autour de bouées arrimées et terminer leur parcours en courant sur la plage pour passer la ligne d'arrivée.",
    icon: Sailboat
  },
  {
    title: "Sprint",
    description: "Un sauveteur effectue un sprint sur le sable d'une distance de 90 m.",
    icon: Timer
  },
  {
    title: "Surf Ski",
    description: "Le départ se fait dans l'eau et les sauveteurs doivent effectuer un parcours délimité par des bouées avec leur surf ski, avant de revenir vers la plage pour passer la ligne d'arrivée matérialisée par deux drapeaux dans l'eau.",
    icon: Sailboat
  },
  {
    title: "Beach Flags",
    description: "Les sauveteurs sont couchés sur le sable à plat ventre, dos aux bâtons qui sont plantés sur une ligne parallèle à la ligne de départ mais distante de 20m. Il y a un bâton en moins que de participants. Au signal : les compétiteurs se redressent, se retournent et effectuent un sprint pour s'emparer de l'un des bâtons. Celui qui reste sans bâton est éliminé.",
    icon: Flag
  },
  {
    title: "Course Combinee",
    description: "Au cours de cette épreuve reine du sauvetage côtier, les sauveteurs enchaînent les épreuves de nage, planche et surf ski avec une transition en course à pied (l'ordre des épreuves étant tiré au sort). Jusqu'à la catégorie Cadet, les sauveteurs effectueront un Mini Combiné, enchaînement de Nage et Planche.",
    icon: Trophy
  }
];

const relais: Epreuve[] = [
  {
    title: "Sprint Relais",
    description: "4 sauveteurs effectuent un relais sur une distance de 4 fois celle du sprint en se transmettant un témoin. Le passage du relais s'effectue face à face.",
    icon: Users
  },
  {
    title: "Sauvetage Bouee Tube",
    description: "Un sauveteur ramène une victime à l'aide d'une bouée tube. Deux sauveteurs assistants remontent cette victime sur la plage jusqu'à la ligne d'arrivée.",
    icon: Users
  },
  {
    title: "Sauvetage en Planche",
    description: "Un sauveteur doit ramener une victime à l'aide d'une planche de sauvetage. La victime se trouve à une distance d'environ 120m de la plage. Ce relais peut être effectué successivement par deux équipes.",
    icon: Sailboat
  },
  {
    title: "Relais Ocean",
    description: "Épreuve qui demande à 4 sauveteurs de parcourir différentes distances dans la mer en nageant pour l'un, en parcourant la distance en planche de sauvetage pour un autre et en s'aidant d'un surf ski pour le suivant. Le quatrième terminent ce relais par une course sur le sable.",
    icon: Waves
  },
  {
    title: "Relais Planche",
    description: "Parcours de Planche effectué par quatre relayeurs.",
    icon: Sailboat
  },
  {
    title: "Relais Nage",
    description: "Parcours de Nage effectué par quatre relayeurs.",
    icon: Waves
  },
  {
    title: "Double Ski",
    description: "Parcours de surfski biplace.",
    icon: Users
  }
];

const EpreuveCard = ({ epreuve }: { epreuve: Epreuve }) => {
  const Icon = epreuve.icon;
  
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
            {epreuve.title}
          </h3>
          <p className="font-mk-abel text-gray-700 leading-relaxed">
            {epreuve.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Cotier() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Sauvetage Côtier
          </h1>
          <p className="text-xl font-mk-abel max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Les épreuves de côtier se déroulent au bord de mer et permettent aux sportifs 
            de faire de la compétition en situation réelle.
          </p>
        </div>

        {/* Épreuves Individuelles */}
        <section className="mb-20">
          <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-12 text-center">
            Les épreuves en détail
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {epreuves.map((epreuve, index) => (
              <EpreuveCard key={index} epreuve={epreuve} />
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
              <EpreuveCard key={index} epreuve={relai} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}