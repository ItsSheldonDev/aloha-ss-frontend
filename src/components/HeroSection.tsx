"use client"

import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/videos/ocean.mp4" type="video/mp4" />
        </video>
        {/* Overlay plus foncé pour une meilleure lisibilité */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="font-art-brush text-7xl mb-4 tracking-wide animate-fade-in text-white 
                     text-shadow-lg drop-shadow-2xl">
          Aloha Secourisme
        </h1>
        <p className="font-mk-abel text-2xl mb-12 max-w-2xl text-white animate-fade-in-delay
                    drop-shadow-lg font-semibold">
          Formation aux premiers secours et sauvetage sportif à Auray
        </p>
        <a
          href="/formations"
          className="group px-8 py-4 bg-[#0e5399] text-lg text-white 
                   rounded-full hover:bg-blue-700 transition-all duration-300 
                   shadow-xl hover:shadow-2xl animate-fade-in-delay-2
                   border-2 border-white/20 hover:border-white/40
                   transform hover:-translate-y-1 flex items-center gap-2"
        >
          <span>Découvrir nos formations</span>
          <ArrowRight className="w-5 h-5 transform transition-transform duration-300 
                                group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}