// src/app/(public)/page.tsx
"use client";

import { useRandomGallery } from '@/hooks/useGallery';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import HeroSection from '@/components/ui/HeroSection';
import ReviewsSection from '@/components/ui/ReviewsCarousel';
import { icons } from '@/lib/images';
import { 
  ChevronRight, 
  Award, 
  Users, 
  Clock, 
  Trophy, 
  GraduationCap, 
  LifeBuoy, 
  ShieldAlert, 
  CalendarCheck,
  ArrowRight 
} from 'lucide-react';

interface Statistic {
  number: string;
  label: string;
  icon: React.ElementType;
}

interface CTACard {
  title: string;
  description: string;
  link: string;
  image: string;
  icon: React.ReactElement;
}

const stats: Statistic[] = [
  { number: "1 102+", label: "Stagiaires formés", icon: Users },
  { number: "100%", label: "Taux de réussite", icon: Trophy },
  { number: "14+", label: "Années d'expérience", icon: Clock },
  { number: "5", label: "Certifications", icon: Award },
];

const ctaCards: CTACard[] = [
  {
    title: "Formations",
    description: "Découvrez nos formations en secourisme et obtenez vos diplômes PSC1, SST, PSE1, PSE2",
    link: "/formations",
    image: icons.picto1,
    icon: <GraduationCap className="w-6 h-6 text-[#0e5399]" />,
  },
  {
    title: "Sauvetage Sportif",
    description: "Rejoignez nos équipes de sauvetage sportif et participez aux compétitions",
    link: "/sauvetage-sportif",
    image: icons.picto2,
    icon: <LifeBuoy className="w-6 h-6 text-[#0e5399]" />,
  },
  {
    title: "Poste de Secours",
    description: "Faites appel à nous pour sécuriser vos événements",
    link: "/poste-de-secours",
    image: icons.picto3,
    icon: <ShieldAlert className="w-6 h-6 text-[#0e5399]" />,
  },
  {
    title: "Agenda & Inscription",
    description: "Consultez les dates et inscrivez-vous à nos formations",
    link: "/agenda",
    image: icons.picto4,
    icon: <CalendarCheck className="w-6 h-6 text-[#0e5399]" />,
  },
];

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState<{[key: string]: boolean}>({
    services: false,
    stats: false,
    gallery: false,
    reviews: false,
    press: false
  });
  
  // Référence pour les sections à observer
  const servicesRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const pressRef = useRef<HTMLElement>(null);

  // Animation au défilement
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target.id && entry.isIntersecting) {
          setVisibleSections(prev => ({...prev, [entry.target.id]: true}));
        }
      });
    }, options);

    const sections = [
      servicesRef.current,
      statsRef.current,
      galleryRef.current,
      reviewsRef.current,
      pressRef.current
    ];

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Utilisation de useRandomGallery pour récupérer 4 images aléatoires
  const { data: randomImages = [], isLoading: isGalleryLoading } = useRandomGallery({
    staleTime: 3600 * 1000, // 1 heure, comme dans votre version originale
    enabled: true,
  });

  // Limiter à 4 images
  const displayedImages = randomImages.slice(0, 4);

  // Animation des compteurs
  const CountUp = ({ end, duration = 2000 }: { end: string, duration?: number }) => {
    const [count, setCount] = useState("0");
    
    useEffect(() => {
      // Si la fin est un nombre avec un signe +, on l'extrait
      const endValue = end.includes('+') 
        ? parseInt(end.replace(/\D/g,''))
        : parseInt(end.replace(/\D/g,''));
      
      // Si on ne peut pas convertir en nombre, on affiche la valeur telle quelle
      if (isNaN(endValue)) {
        setCount(end);
        return;
      }
      
      // Animation de comptage
      let startTime: number;
      const endWithSymbol = end.includes('+') ? endValue + '+' : endValue.toString();
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(progress * endValue);
        
        // Ajouter le signe + si nécessaire
        setCount(end.includes('+') ? `${currentCount}+` : `${currentCount}`);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(endWithSymbol);
        }
      };
      
      window.requestAnimationFrame(step);
    }, [end, duration]);
    
    return <>{count}</>;
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Section Services avec effet de vague */}
      <section 
        id="services" 
        ref={servicesRef} 
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* Vague en haut de la section */}
        <div className="absolute top-0 left-0 w-full h-16 overflow-hidden">
          <svg className="absolute -top-12 w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-gray-50"
            ></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className={`text-center mb-16 max-w-3xl mx-auto transform transition-all duration-1000 ease-out ${visibleSections.services ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-5xl font-art-brush text-[#0e5399] mb-6 relative inline-block">
                Nos Services
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></span>
              </h2>
              <p className="text-xl font-mk-abel text-gray-600 leading-relaxed">
                Découvrez l'ensemble de nos prestations en formation, sauvetage et sécurité.
                Des solutions adaptées à vos besoins.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ctaCards.map((card, index) => (
                <Link 
                  key={index} 
                  href={card.link} 
                  aria-label={`En savoir plus sur ${card.title}`} 
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${visibleSections.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{ 
                    transitionDelay: `${index * 150}ms`,
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image 
                      src={card.image} 
                      alt={card.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                      priority={index < 2} 
                      loading={index >= 2 ? "lazy" : undefined} 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="absolute top-4 right-4 p-3 rounded-xl bg-white/90 shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-2xl font-mk-abel text-[#0e5399] mb-3 group-hover:translate-x-2 transition-transform duration-300">{card.title}</h3>
                    <p className="text-gray-600 font-mk-abel leading-relaxed mb-4">{card.description}</p>
                    <div className="flex items-center text-[#0e5399] font-mk-abel group-hover:gap-3 transition-all duration-300">
                      <span className="font-semibold">En savoir plus</span>
                      <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Cercles décoratifs */}
        <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-blue-50/50 -z-10"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-blue-50/50 -z-10"></div>
      </section>
      
      {/* Section Galerie avec effet d'ombre portée */}
      <section 
        id="gallery" 
        ref={galleryRef} 
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0e5399]/5 z-0" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white to-transparent z-10" />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={`space-y-8 transform transition-all duration-1000 ease-out ${visibleSections.gallery ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                <div className="space-y-4">
                  <h2 className="text-5xl font-art-brush text-[#0e5399] relative inline-block">
                    Découvrez Nos Activités en Images
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></span>
                  </h2>
                  <p className="text-xl font-mk-abel text-gray-600 leading-relaxed">
                    Explorez notre galerie photo pour voir nos formations, événements et activités en action.
                    Une immersion visuelle dans notre univers du secourisme et du sauvetage.
                  </p>
                </div>
                <Link 
                  href="/galerie" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-mk-abel text-lg" 
                  aria-label="Explorer la galerie de photos"
                >
                  <span>Explorer la galerie</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              
              {isGalleryLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e5399]"></div>
                </div>
              ) : displayedImages.length > 0 ? (
                <div className={`relative transform transition-all duration-1000 delay-300 ease-out ${visibleSections.gallery ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {displayedImages.map((image, index) => (
                      <div 
                        key={image.id} 
                        className={`relative aspect-square rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-xl ${index % 2 === 0 ? 'hover:rotate-2' : 'hover:-rotate-2'}`}
                        style={{ 
                          transitionDelay: `${index * 150}ms`,
                          animationDelay: `${index * 150}ms` 
                        }}
                      >
                        <Image 
                          src={image.url} 
                          alt={image.alt} 
                          fill 
                          className="object-cover" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                          loading="lazy" 
                          unoptimized // Désactiver l'optimisation pour éviter les paramètres w et q
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white text-sm font-mk-abel">{image.alt}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Cercles décoratifs */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-50 rounded-full -z-10" />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-50 rounded-full -z-10" />
                </div>
              ) : (
                <div className="text-center text-gray-600 font-mk-abel">Aucune image disponible pour le moment.</div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Avis avec le composant Tagembed */}
      <section
        id="reviews"
        ref={reviewsRef}
        className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-8 transform transition-all duration-1000 ease-out ${visibleSections.reviews ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-5xl font-art-brush text-[#0e5399] mb-6 relative inline-block">
              Vos Avis
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></span>
            </h2>
            <p className="text-xl font-mk-abel text-gray-600 leading-relaxed">Ce que pensent nos stagiaires de nos formations</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Utilisation du composant Tagembed */}
            <div className="h-[700px] w-full">
              <ReviewsSection
                widgetId="2158874"
                className="mb-8"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Presse avec effet de zoom au survol */}
      <section 
        id="press" 
        ref={pressRef} 
        className="py-24 bg-gray-50 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transform transition-all duration-1000 ease-out ${visibleSections.press ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-art-brush text-[#0e5399] mb-4 relative inline-block">
              Ils parlent de nous
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></span>
            </h2>
            <p className="text-xl font-mk-abel text-gray-600 max-w-2xl mx-auto">Découvrez les articles de presse qui parlent d'Aloha Sauvetage Secourisme</p>
          </div>
          
          <div className={`relative max-w-5xl mx-auto transform transition-all duration-1000 delay-300 ease-out ${visibleSections.press ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16">
              {[
                {
                  url: "https://www.letelegramme.fr/morbihan/auray-56400/a-auray-l-association-aloha-invite-a-une-formation-au-secourisme-4092284.php",
                  logo: "/images/press/telegramme_vecto.svg",
                  name: "Le Télégramme"
                },
                {
                  url: "https://www.ouest-france.fr/bretagne/auray-56400/secourisme-pratique-sportive-et-citoyenne-5607770",
                  logo: "/images/press/ouest-france_vecto.svg",
                  name: "Ouest France"
                },
                {
                  url: "https://actu.fr/bretagne/auray_56007/auray-aloha-sauvetage-secourisme-forme-aux-premiers-secours-et-assure-la-securite-des-evenements_59635465.html",
                  logo: "/images/press/Actu.fr_logo_2020.svg",
                  name: "Actu.fr"
                }
              ].map((press, index) => (
                <Link 
                  key={index}
                  href={press.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative w-40 h-16 sm:w-48 sm:h-20 transform transition-all duration-300 hover:scale-110" 
                  aria-label={`Article de presse sur Aloha Secourisme dans ${press.name}`}
                  style={{ 
                    transitionDelay: `${index * 150}ms`,
                    animationDelay: `${index * 150}ms` 
                  }}
                >
                  <Image 
                    src={press.logo} 
                    alt={`Logo de ${press.name}`} 
                    fill 
                    sizes="(max-width: 640px) 160px, 192px" 
                    className="object-contain mix-blend-multiply transition-all duration-500 [filter:grayscale(100%)] group-hover:[filter:grayscale(0%)]" 
                    style={{ backgroundColor: 'transparent' }} 
                    loading="lazy" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Vague en bas de la section */}
        <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>
      
      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .waves {
          background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wave' width='100' height='50' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 25C 20 10, 30 10, 50 25 S 70 40, 100 25 L 100 50 L 0 50 Z' fill='%230e5399' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23wave)'/%3E%3C/svg%3E");
          opacity: 0.05;
        }
      `}</style>
    </div>
  );
}

// Déclaration pour TypeScript
declare global {
  interface Window {
    elfsight?: {
      reinitWidgets: (element?: HTMLElement) => void;
    };
  }
}