"use client"

import { useState, useEffect } from 'react';
import { ArrowRight, Waves, ShieldCheck, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Effet de parallaxe au défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation de chargement initial
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background avec effet Parallaxe */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.2}px)` }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          poster="/images/ocean-poster.jpg" // Ajoutez une image poster pour un meilleur chargement initial
        >
          <source src="/videos/ocean.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay gradué pour une meilleure lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        
        {/* Effet de vagues en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10 opacity-20 overflow-hidden">
          <div className="wave absolute bottom-0 left-0 w-[200%] h-full"></div>
        </div>
      </div>
      
      {/* Logo flottant */}
      <div className={`absolute top-12 md:top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 md:w-40 md:h-40 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="relative w-full h-full animate-float">
          <Image
            src="/images/logos/aloha_white.png"
            alt="Aloha Sauvetage Secourisme"
            fill
            priority
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        {/* Titre avec animation spéciale */}
        <h1 
          className={`font-art-brush text-5xl md:text-7xl mb-6 tracking-wide text-white transition-all duration-1000 ease-out text-shadow-xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <span className="relative">
            Aloha Sauvetage Secourisme
            <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></span>
          </span>
        </h1>
        
        {/* Sous-titre avec délai d'apparition */}
        <p 
          className={`font-mk-abel text-xl md:text-2xl mb-10 max-w-2xl text-blue-100 transition-all duration-1000 delay-300 ease-out drop-shadow-lg ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          Formation aux premiers secours et sauvetage sportif à Auray
        </p>
        
        {/* Boutons d'action */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="/formations"
            className="group px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 text-lg text-white rounded-full hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-xl hover:shadow-blue-900/30 border border-white/20 hover:border-white/40 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Découvrir nos formations</span>
            <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          
          <a
            href="/sauvetage-sportif"
            className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-lg text-white rounded-full hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-blue-900/30 border border-white/20 hover:border-white/40 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Waves className="w-5 h-5" />
            <span>Sauvetage sportif</span>
            <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
      
      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        .wave {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' class='shape-fill'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' class='shape-fill'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' class='shape-fill'%3E%3C/path%3E%3C/svg%3E");
          background-position: center;
          background-repeat: no-repeat;
          animation: wave 18s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .text-shadow-xl {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}