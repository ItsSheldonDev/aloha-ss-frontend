// src/app/poste-de-secours/page.tsx

import { Phone, Mail } from 'lucide-react';

interface Agreement {
  code: string;
  description: string;
}

interface Poste {
  title: string;
  points: string[];
}

export default function PosteSecours() {
  const agreements: Agreement[] = [
    { code: "A", description: "Sécurité de la pratique des activités aquatiques en milieux naturels et artificiels" },
    { code: "B", description: "Actions de soutien et d'accompagnement des populations victimes d'accidents, sinistres et catastrophes" },
    { code: "C", description: "Encadrement des bénévoles dans le cadre des actions de soutien aux populations" },
    { code: "D", description: "Dispositifs prévisionnels de secours (PAPS à GE)" },
  ];

  const postes: Poste[] = [
    {
      title: "Les PAPS (Point d'Alerte et de Premiers Secours)",
      points: [
        "Petite manifestation, non dangereuse",
        "Une équipe de 2 secouristes sur place avec matériel d'oxygènothérapie et DSA et de communication.",
      ],
    },
    {
      title: "Les Postes de Secours de Petite Envergure",
      points: [
        "La plupart des manifestations rentrent dans ce dispositif.",
        "Une à deux équipes de secouristes coordonnées par un chef de poste avec tout le matériel nécessaire d'urgence + un poste de secours.",
        "Le poste de secours peut être mobile en fonction des manifestations.",
      ],
    },
    {
      title: "Les postes de moyenne et grandes envergures",
      points: [
        "Pour les grandes manifestations",
        "Au minimum 3 équipes de secours coordonnées par un chef de dispositif avec tout le matériel nécessaire d'urgence + un poste de secours.",
      ],
    },
  ];

  const missions = [
    "Assurer une protection adapté et permanente",
    "Réaliser les bilans et gestes de secours nécessaires ainsi qu'une surveillance et une transmission au SAMU",
    "Adopter sa conduite à la situation ou à l'état de la victime (risque viral ou infectieux)",
    "S'organiser en fonction de la situation",
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* En-tête et introduction */}
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-6xl font-art-brush text-[#0e5399] text-center mb-12">
          Poste de Secours
        </h1>
        
        <div className="space-y-6 font-mk-abel text-lg bg-white rounded-xl shadow-lg p-8">
          <p className="leading-relaxed">
            Un dispositif prévisionnel de secours à personnes (D.P.S.) est l'ensemble des moyens humains et matériels de premiers secours à personnes pré-positionnés lors d'un rassemblement ou d'une manifestation de personnes : Concert, kermesse, réunion, match…
          </p>
          <p className="leading-relaxed">
            Conformément à l'arrêté du 12 novembre 2015 et sous l'égide du Comité Départemental FFSS 56 possédant les agréments A et D, Aloha Sauvetage Secourisme assure la sécurité de vos évènements par l'organisation d'un poste de secours terrestre et/ou aquatique.
          </p>
          <p className="leading-relaxed">
            Si vous souhaitez organiser une manifestation publique, la mise en place d'un dispositif prévisionnel de secours est obligatoire. Aloha Sauvetage Secourisme, association FFSS agréée de sécurité civile, s'engage dans la sécurité de vos manifestations par la mise en place de matériel et d'une équipe de secouriste compétente.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:contact@aloha-sauvetage.fr" 
               className="flex items-center gap-2 px-6 py-3 bg-[#0e5399] text-white rounded-full
                        hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg
                        transform hover:-translate-y-1">
              <Mail className="w-5 h-5" />
              contact@aloha-sauvetage.fr
            </a>
            <a href="tel:0641543355" 
               className="flex items-center gap-2 px-6 py-3 bg-[#0e5399] text-white rounded-full
                        hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg
                        transform hover:-translate-y-1">
              <Phone className="w-5 h-5" />
              06 41 54 33 55
            </a>
          </div>
        </div>
      </div>

      {/* Agréments */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-8 text-center">
          Les agréments du CD56
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {agreements.map((agreement, index) => (
            <div key={index} 
                 className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl
                          transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#0e5399] text-2xl w-10">{agreement.code}</span>
                <p className="font-mk-abel text-gray-700">{agreement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Types de postes */}
      <div className="max-w-6xl mx-auto mt-20">
        <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-8 text-center">
          Dispositifs terrestres disponibles
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postes.map((poste, index) => (
            <div key={index} 
                 className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl
                          transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-indie-pimp text-xl text-[#0e5399] mb-6">{poste.title}</h3>
              <ul className="space-y-4">
                {poste.points.map((point, idx) => (
                  <li key={idx} className="font-mk-abel flex items-start gap-3 text-gray-700">
                    <span className="text-[#0e5399] font-bold">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Missions */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-8 text-center">
          Notre mission lors des postes de secours
        </h2>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <ul className="space-y-4">
            {missions.map((mission, index) => (
              <li key={index} className="font-mk-abel flex items-start gap-3 text-gray-700">
                <span className="text-[#0e5399] font-bold text-xl">•</span>
                <span className="leading-relaxed">{mission}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}