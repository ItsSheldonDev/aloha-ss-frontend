// src/app/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import { formations, icons } from '@/lib/images';
import { ChevronRight, Award, Users, Clock, Trophy, GraduationCap, LifeBuoy, ShieldAlert, CalendarCheck } from 'lucide-react';
import { Category } from '@prisma/client';
import Script from 'next/script';

interface Statistic {
 number: string;
 label: string;
 icon: any;
}

interface CTACard {
  title: string;
  description: string;
  link: string;
  image: string;
  icon: React.ReactElement;
}

interface GalleryImage {
 id: string;
 filename: string;
 alt: string;
 category: Category;
 url: string;
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
   icon: <GraduationCap className="w-6 h-6 text-[#0e5399]" />
 },
 {
   title: "Sauvetage Sportif", 
   description: "Rejoignez nos équipes de sauvetage sportif et participez aux compétitions",
   link: "/sauvetage-sportif",
   image: icons.picto2,
   icon: <LifeBuoy className="w-6 h-6 text-[#0e5399]" />
 },
 {
   title: "Poste de Secours",
   description: "Faites appel à nous pour sécuriser vos événements",
   link: "/poste-de-secours", 
   image: icons.picto3,
   icon: <ShieldAlert className="w-6 h-6 text-[#0e5399]" />
 },
 {
   title: "Planning & Inscription",
   description: "Consultez les dates et inscrivez-vous à nos formations",
   link: "/planning",
   image: icons.picto4,
   icon: <CalendarCheck className="w-6 h-6 text-[#0e5399]" />
 }
];


async function getRandomGalleryImages(): Promise<GalleryImage[]> {
 try {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery?mode=random`, {
     next: { revalidate: 3600 }
   });
   
   if (!response.ok) {
     throw new Error('Erreur lors de la récupération des images');
   }
   
   return await response.json();
 } catch (error) {
   console.error('Erreur lors de la récupération des images:', error);
   return [];
 }
}

export default function HomePage() {
  const [randomImages, setRandomImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [images] = await Promise.all([
      
          getRandomGalleryImages()
        ]);
        
        setRandomImages(images);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

 return (
   <div className="min-h-screen">
     <HeroSection />

     {/* Section Services */}
     <section className="py-24 bg-white relative overflow-hidden">
       <div className="container mx-auto px-4 relative z-10">
         <div className="max-w-6xl mx-auto">
           {/* En-tête de section */}
           <div className="text-center mb-16 max-w-3xl mx-auto">
             <h2 className="text-5xl font-art-brush text-[#0e5399] mb-6">
               Nos Services
             </h2>
             <p className="text-xl font-mk-abel text-gray-600 leading-relaxed">
               Découvrez l'ensemble de nos prestations en formation, sauvetage et sécurité.
               Des solutions adaptées à vos besoins.
             </p>
           </div>

           {/* Grille de services */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {ctaCards.map((card, index) => (
               <Link
                 key={index}
                 href={card.link}
                 className="group bg-white rounded-2xl shadow-lg overflow-hidden
                          hover:shadow-xl transition-all duration-500
                          transform hover:-translate-y-2"
               >
                 {/* Image et overlay */}
                 <div className="relative h-56 w-full">
                   <Image
                     src={card.image}
                     alt={card.title}
                     fill
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                     priority={index < 2}
                     className="object-cover transition-transform duration-700
                              group-hover:scale-110"
                   />
                   <div className="absolute top-4 right-4 p-3 rounded-xl bg-white/90 shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                     {card.icon}
                   </div>
                 </div>
                 {/* Contenu */}
                 <div className="p-6 bg-white">
                   <h3 className="text-2xl font-mk-abel text-[#0e5399] mb-3
                              group-hover:translate-x-2 transition-transform duration-300">
                     {card.title}
                   </h3>
                   <p className="text-gray-600 font-mk-abel leading-relaxed mb-4">
                     {card.description}
                   </p>
                   <div className="flex items-center text-[#0e5399] font-mk-abel
                              group-hover:gap-3 transition-all duration-300">
                     <span className="font-semibold">En savoir plus</span>
                     <ChevronRight className="w-5 h-5 ml-2 transition-transform
                                            group-hover:translate-x-2" />
                   </div>
                 </div>
               </Link>
             ))}
           </div>
         </div>
       </div>
     </section>

      {/* Section Statistiques */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-art-brush text-[#0e5399] mb-4">
                Aloha Secourisme en chiffres
              </h2>
              <p className="text-xl font-mk-abel text-gray-600">
                Notre expérience et notre impact dans la formation au secourisme
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center group hover:transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="inline-flex p-5 rounded-xl bg-white mb-6">
                    <stat.icon className="w-10 h-10 text-[#0e5399]" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-[#0e5399]">
                      {stat.number}
                    </p>
                    <p className="text-lg text-gray-600 font-mk-abel">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Galerie CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0e5399]/5 z-0" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white to-transparent z-10" />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Contenu textuel */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl font-art-brush text-[#0e5399]">
                    Découvrez Nos Activités en Images
                  </h2>
                  <p className="text-xl font-mk-abel text-gray-600 leading-relaxed">
                    Explorez notre galerie photo pour voir nos formations, événements et activités en action. 
                    Une immersion visuelle dans notre univers du secourisme et du sauvetage.
                  </p>
                </div>

                <Link 
                  href="/galerie"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#0e5399] text-white rounded-xl
                          hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl
                          transform hover:-translate-y-1 font-mk-abel text-lg"
                >
                  <span>Explorer la galerie</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Grille d'images */}
              {randomImages.length > 0 && (
                <div className="relative">
                  <div className="grid grid-cols-2 gap-6">
                    {randomImages.map((image, index) => (
                      <div 
                        key={image.id}
                        className={`relative aspect-square rounded-xl overflow-hidden shadow-lg
                                transform transition-all duration-500 hover:scale-105 hover:z-10
                                ${index % 2 === 0 ? 'hover:rotate-2' : 'hover:-rotate-2'}`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent 
                                    opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white text-sm font-mk-abel">
                              {image.alt}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Éléments décoratifs */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-50 rounded-full -z-10" />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-50 rounded-full -z-10" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section Google Reviews */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-art-brush text-[#0e5399] mb-6">
              Vos Avis
            </h2>
            <p className="text-xl font-mk-abel text-gray-600 leading-relaxed">
              Ce que pensent nos stagiaires de nos formations
            </p>
          </div>
          
          {/* Elfsight Widget */}
          <div className="max-w-6xl mx-auto">
            <Script src="https://static.elfsight.com/platform/platform.js" async />
            <div 
              className="elfsight-app-d158801a-c534-411b-a63b-a19c7133fbf3" 
              data-elfsight-app-lazy 
            />
          </div>
        </div>
      </section>

      {/* Section Presse */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-art-brush text-[#0e5399] mb-4">
              Ils parlent de nous
            </h2>
            <p className="text-xl font-mk-abel text-gray-600 max-w-2xl mx-auto">
              Découvrez les articles de presse qui parlent d'Aloha Sauvetage Secourisme
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="flex justify-center items-center gap-16">
              <Link
                href="https://www.letelegramme.fr/morbihan/auray-56400/a-auray-l-association-aloha-invite-a-une-formation-au-secourisme-4092284.php"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-48 h-20 transform transition-all duration-300 hover:scale-105"
              >
                <Image
                  src="/images/press/telegramme_vecto.svg"
                  alt="Le Télégramme"
                  fill
                  sizes="192px"
                  className="object-contain mix-blend-multiply transition-all duration-300 
                           [filter:grayscale(100%)] group-hover:[filter:grayscale(0%)]"
                  style={{ backgroundColor: 'transparent' }}
                />
              </Link>

              <Link
                href="https://www.ouest-france.fr/bretagne/auray-56400/secourisme-pratique-sportive-et-citoyenne-5607770"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-48 h-20 transform transition-all duration-300 hover:scale-105"
              >
                <Image
                  src="/images/press/ouest-france_vecto.svg"
                  alt="Ouest France"
                  fill
                  sizes="192px"
                  className="object-contain mix-blend-multiply transition-all duration-300 
                           [filter:grayscale(100%)] group-hover:[filter:grayscale(0%)]"
                  style={{ backgroundColor: 'transparent' }}
                />
              </Link>

              <Link
                href="https://actu.fr/bretagne/auray_56007/auray-aloha-sauvetage-secourisme-forme-aux-premiers-secours-et-assure-la-securite-des-evenements_59635465.html"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-48 h-20 transform transition-all duration-300 hover:scale-105"
              >
                <Image
                  src="/images/press/Actu.fr_logo_2020.svg"
                  alt="Actu.fr"
                  fill
                  sizes="100px"
                  className="object-contain mix-blend-multiply transition-all duration-300 
                           [filter:grayscale(100%)] group-hover:[filter:grayscale(0%)]"
                  style={{ backgroundColor: 'transparent' }}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}