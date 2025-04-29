"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Shield, Waves } from 'lucide-react';

interface Formation {
  title: string;
  image: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
  level?: string;
}

// Définir les formations sans 'as const' pour éviter le problème de readOnly
const formationsData = {
  premiersSecours: [
    {
      title: "PSC1",
      image: "/images/content/formations/PSC1.png",
      description: "La formation PSC1 permet d'obtenir toutes les compétences nécessaires de citoyen pour sauver une victime en urgence ou détresse vitale.",
      link: "/formations/psc1",
      icon: <BookOpen size={20} />,
      level: "Initiation"
    },
    {
      title: "SST",
      image: "/images/content/formations/SST.png",
      description: "Devenir secouriste et auxiliaire de prévention au sein de son entreprise.",
      link: "/formations/sst",
      icon: <Shield size={20} />,
      level: "Intermédiaire"
    }
  ],
  secoursEquipe: [
    {
      title: "PSE1",
      image: "/images/content/formations/PSE1.png",
      description: "Cette formation permet d'avoir les compétences minimum de secourisme professionnel. Elle est indispensable lorsqu'une personne souhaite travailler sur les postes de secours.",
      link: "/formations/pse1",
      icon: <Users size={20} />,
      level: "Avancé"
    },
    {
      title: "PSE2",
      image: "/images/content/formations/PSE2.png",
      description: "La formation PSE2 permet d'obtenir les compétences supplémentaires telles que la maîtrise des immobilisations ou des relevages qu'un secouriste ne connaît pas.",
      link: "/formations/pse2",
      icon: <Users size={20} />,
      level: "Avancé"
    }
  ],
  sauvetageAquatique: [
    {
      title: "BNSSA",
      image: "/images/content/formations/BNSSA.png",
      description: "Le diplôme du BNSSA est le diplôme nécessaire pour toutes surveillances de bassins, lacs ou océans.",
      link: "/formations/bnssa",
      icon: <Waves size={20} />,
      level: "Expert"
    },
    {
      title: "SSA",
      image: "/images/content/formations/SSA.png",
      description: "La formation SSA permet de connaître toutes les techniques utiles et indispensables pour travailler sur plage.",
      link: "/formations/ssa",
      icon: <Waves size={20} />,
      level: "Expert"
    },
    {
      title: "BSB",
      image: "/images/content/formations/BSB.png",
      description: "La formation de Surveillant de Baignade permet à tous jeunes diplômés de prendre en charge une baignade d'enfants ou d'adolescents lors d'un séjour de colonie de vacances.",
      link: "/formations/bsb",
      icon: <Waves size={20} />,
      level: "Intermédiaire"
    }
  ]
};

interface FormationCardProps {
  formation: Formation;
  index: number;
  isVisible: boolean;
}

const FormationCard = ({ formation, index, isVisible }: FormationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`transition-all duration-700 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={formation.link} className="group block h-full">
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
                      transform hover:-translate-y-2 transition-all duration-300 h-full
                      border border-gray-100 relative">
          {/* Badge du niveau */}
          {formation.level && (
            <div className="absolute top-4 left-4 z-10">
              <div className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium shadow-md">
                {formation.level}
              </div>
            </div>
          )}
          
          <div className="relative h-48 w-full overflow-hidden bg-blue-50/50">
            {/* Effet de survol */}
            <div className={`absolute inset-0 bg-gradient-to-b from-blue-500/0 to-blue-900/70 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10
                           flex items-end justify-center pb-4`}>
              <span className="text-white font-medium px-4 py-2 rounded-full bg-blue-500/80 backdrop-blur-sm
                             flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                En savoir plus <ArrowRight size={16} />
              </span>
            </div>
            
            {/* Image de la formation */}
            <Image
              src={formation.image}
              alt={formation.title}
              fill
              className="object-contain p-4 transform group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              {formation.icon && (
                <span className="text-blue-600 p-1.5 bg-blue-100 rounded-full">
                  {formation.icon}
                </span>
              )}
              <h3 className="text-2xl font-indie-pimp text-[#0e5399]
                           group-hover:text-blue-700 transition-colors">
                {formation.title}
              </h3>
            </div>
            
            <p className="font-mk-abel text-gray-600 text-base leading-relaxed mb-4">
              {formation.description}
            </p>
            
            <div className="flex items-center text-[#0e5399] font-mk-abel font-medium
                          group-hover:text-blue-700 transition-colors">
              <span>Découvrir la formation</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

interface SectionProps {
  title: string;
  description?: string;
  formations: Formation[]; // Type mutable requis
  columns?: number;
  colorClass?: string;
  iconClass?: React.ReactNode;
}

const FormationSection = ({ title, description, formations, columns = 2, colorClass = "from-blue-500 to-blue-600", iconClass }: SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="mb-24">
      <div className={`text-center mb-12 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <div className={`h-1 w-12 bg-gradient-to-r ${colorClass} rounded-full`}></div>
          <h2 className="text-4xl font-mk-abel text-[#0e5399] flex items-center gap-2">
            {iconClass}
            {title}
          </h2>
          <div className={`h-1 w-12 bg-gradient-to-r ${colorClass} rounded-full`}></div>
        </div>
        
        {description && (
          <p className="text-lg font-mk-abel text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
      
      <div className={`grid gap-8 ${
        columns === 3 
          ? 'md:grid-cols-2 lg:grid-cols-3 max-w-5xl' 
          : 'md:grid-cols-2 max-w-4xl'
      } mx-auto`}>
        {formations.map((formation, index) => (
          <FormationCard 
            key={index} 
            formation={formation} 
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
};

export default function Formations() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    setIsHeaderVisible(true);
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-200/20 -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-200/10 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* En-tête animé */}
        <div 
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ease-out transform ${
            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h1 className="text-5xl sm:text-6xl font-art-brush text-[#0e5399] mb-6 relative inline-block">
            Nos Formations
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></span>
          </h1>
          <p className="text-xl font-mk-abel max-w-2xl mx-auto text-gray-700 mb-8">
            Découvrez nos formations professionnelles en secourisme et sauvetage, adaptées à tous les niveaux
          </p>
          
          {/* Options de recherche/filtrage */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="#premiers-secours" className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-medium transition-colors">
              Premiers Secours
            </a>
            <a href="#secours-equipe" className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-medium transition-colors">
              Secours en Équipe
            </a>
            <a href="#sauvetage-aquatique" className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-medium transition-colors">
              Sauvetage Aquatique
            </a>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              Toutes nos formations sont dispensées par des formateurs professionnels expérimentés. 
              Nous proposons des sessions régulières tout au long de l'année.
            </p>
          </div>
        </div>

        {/* Premiers Secours */}
        <div id="premiers-secours">
          <FormationSection 
            title="Premiers Secours" 
            description="Formez-vous aux gestes qui sauvent et devenez un maillon essentiel de la chaîne des secours"
            formations={[...formationsData.premiersSecours]} // Création d'une copie mutable du tableau
            colorClass="from-green-400 to-green-600"
            iconClass={<BookOpen size={24} className="text-green-500" />}
          />
        </div>

        {/* Secours en équipe */}
        <div id="secours-equipe">
          <FormationSection 
            title="Secours en Équipe" 
            description="Approfondissez vos compétences et apprenez à travailler en équipe pour des interventions efficaces"
            formations={[...formationsData.secoursEquipe]} // Création d'une copie mutable du tableau
            colorClass="from-red-400 to-red-600"
            iconClass={<Users size={24} className="text-red-500" />}
          />
        </div>

        {/* Sauvetage Aquatique */}
        <div id="sauvetage-aquatique">
          <FormationSection 
            title="Sauvetage Aquatique" 
            description="Spécialisez-vous dans le sauvetage en milieu aquatique et assurez la sécurité des baigneurs"
            formations={[...formationsData.sauvetageAquatique]} // Création d'une copie mutable du tableau
            columns={3}
            colorClass="from-blue-400 to-blue-600"
            iconClass={<Waves size={24} className="text-blue-500" />}
          />
        </div>
        
        {/* Section contact/CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="wave absolute inset-0"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-art-brush mb-4 text-white">Besoin d'informations complémentaires ?</h2>
            <p className="font-mk-abel mb-6 max-w-xl mx-auto text-white font-medium">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              concernant nos formations en secourisme et sauvetage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-white text-blue-700 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Nous contacter
              </Link>
              <Link href="/agenda" className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium border border-white/20 hover:bg-blue-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Consulter le calendrier
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles pour les vagues */}
      <style jsx>{`
        .wave {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23FFFFFF' fill-opacity='1' d='M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,149.3C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
          background-size: cover;
          background-position: center;
          animation: wave 15s ease-in-out infinite alternate;
          height: 100%;
          width: 200%;
        }
        
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}