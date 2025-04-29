"use client"

import { useState, useEffect } from 'react';
import { MenuItem } from './types';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, LifeBuoy, GraduationCap, Calendar, ShoppingBag, Compass, Users, Star } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logos } from '@/lib/images';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  
  const pathname = usePathname();

  // Détecter le défilement pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Menu items organisés par catégories
  const menuItems: MenuItem[] = [
    { label: "ACCUEIL", href: "/" },
    { 
      label: "FORMATIONS", 
      href: "/formations",
      submenu: [
        { label: "Formations Grand Public", href: "/formations" },
        { label: "Formations Pro", href: "/formations-pro" },
        { label: "Calendrier", href: "/agenda" },
      ]
    },
    {
      label: "SAUVETAGE SPORTIF",
      href: "/sauvetage-sportif",
      submenu: [
        { label: "Présentation", href: "/sauvetage-sportif" },
        { label: "Eau Plate", href: "/sauvetage-sportif/eau-plate" },
        { label: "Côtier", href: "/sauvetage-sportif/cotier" },
      ]
    },
    { label: "POSTE DE SECOURS", href: "/poste-de-secours" },
    { 
      label: "BOUTIQUE", 
      href: "https://www.helloasso.com/associations/aloha-sauvetage-secourisme/boutiques/la-boutique-en-ligne-d-aloha-sauvetage-secourisme"
    },
  ];

  // Icônes correspondantes pour chaque élément du menu
  const getIconForItem = (index: number) => {
    const icons = [
      <Compass key="0" className="h-4 w-4" />,
      <GraduationCap key="1" className="h-4 w-4" />,
      <LifeBuoy key="2" className="h-4 w-4" />,
      <Users key="3" className="h-4 w-4" />,
      <ShoppingBag key="4" className="h-4 w-4" />
    ];
    return icons[index] || <Star className="h-4 w-4" />;
  };

  // Vérifier si un lien est actif
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const toggleSubmenu = (index: number) => {
    if (activeSubmenu === index) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(index);
    }
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const active = isActive(item.href);
    const isHovered = hoveredItem === index;
    const icon = getIconForItem(index);

    // Couleurs spécifiques pour chaque élément du menu
    const colors = [
      "hover:text-orange-200", // Accueil
      "hover:text-blue-200",   // Formations
      "hover:text-green-200",  // Sauvetage Sportif
      "hover:text-yellow-200", // Poste de secours
      "hover:text-purple-200", // Boutique
    ];
    
    const hoverColor = colors[index] || "hover:text-blue-200";

    return (
      <div 
        className="relative group"
        onMouseEnter={() => setHoveredItem(index)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Link 
          href={hasSubmenu ? "#" : item.href}
          onClick={hasSubmenu ? (e) => {
            e.preventDefault();
            toggleSubmenu(index);
          } : undefined}
          className={`flex items-center gap-1.5 px-3 py-2 text-white text-sm font-medium rounded-full transition-all duration-200
                      ${hoverColor} ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
          aria-expanded={hasSubmenu ? activeSubmenu === index : undefined}
        >
          <span className={`transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}>
            {icon}
          </span>
          <span className="tracking-wider">{item.label}</span>
          {hasSubmenu && <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeSubmenu === index ? 'rotate-180' : ''}`} />}
        </Link>

        {hasSubmenu && (
          <div 
            className={`absolute left-0 mt-1 w-64 opacity-0 invisible z-50 transform translate-y-1 
                        group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible 
                        transition-all duration-200 ease-out`}
          >
            <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-white/20">
              {/* Entête du sous-menu avec effet vague */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-3 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-semibold text-white">{item.label}</span>
                  </div>
                </div>
                {/* Effet vague */}
                <div className="absolute bottom-0 left-0 right-0 h-6 opacity-20">
                  <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M 0 100 Q 200 150 400 100 Q 600 50 800 100 L 800 200 L 0 200 Z" fill="white" />
                  </svg>
                </div>
              </div>
              {/* Items du sous-menu */}
              <div className="bg-gradient-to-b from-blue-700 to-blue-800 py-2">
                {item.submenu!.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.href}
                    className={`block w-full px-5 py-2.5 text-white hover:bg-white/10 transition-colors
                                ${isActive(subItem.href) ? 'bg-white/10 text-blue-100' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                      <span>{subItem.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 
                    ${scrolled ? 'bg-gradient-to-r from-blue-800 to-blue-700 shadow-md' : 'bg-[#0e5399]'}`}>
      <div className="max-w-screen-2xl mx-auto relative">
        {/* Effet de vague décoratif */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <div className="w-full h-full bg-white/10 animate-wave"></div>
        </div>

        <div className="flex h-16 items-center justify-between">
          {/* Logo - Positionné absolument à gauche avec effet de survol */}
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-28 h-8">
            <Link href="/" className="block h-full w-full group">
              <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/logos/aloha_white.png"
                  alt="Aloha Sauvetage"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="112px"
                  priority
                  className="object-left drop-shadow-md"
                />
              </div>
            </Link>
          </div>

          {/* Menu principal - Centré avec effet créatif */}
          <div className="hidden md:flex items-center justify-center space-x-2 mx-auto">
            {menuItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {renderMenuItem(item, index)}
              </div>
            ))}
          </div>

          {/* Bouton de contact et logo FFSS - À droite */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 hidden md:flex items-center gap-4">
            <Link 
              href="mailto:contact@aloha-sauvetage.fr" 
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              CONTACT
            </Link>
            
            {/* Logo FFSS */}
            <Link 
              href="https://www.ffss.fr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-10 h-10 group"
            >
              <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={logos.ffss}
                  alt="FFSS"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="40px"
                  className="drop-shadow-md brightness-150"
                />
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button avec animation */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/15 transition-colors"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
          >
            <div className="relative w-5 h-5">
              <span className={`absolute top-0 left-0 w-5 h-0.5 bg-white rounded-full transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`absolute top-2 left-0 w-5 h-0.5 bg-white rounded-full transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute top-4 left-0 w-5 h-0.5 bg-white rounded-full transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay avec animation de flou */}
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-blue-900/70 z-40 transition-all duration-300 md:hidden
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel avec design fun */}
      <div 
        className={`fixed right-0 top-0 h-full w-72 bg-gradient-to-b from-blue-700 to-blue-900 z-50 shadow-xl transform 
                    transition-all duration-300 ease-out md:hidden
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Entête avec vague décorative */}
        <div className="relative h-20 border-b border-white/10 flex items-center justify-between px-5">
          <div className="relative w-28 h-8">
            <Image
              src="/images/logos/aloha_white.png"
              alt="Aloha Sauvetage"
              fill
              style={{ objectFit: 'contain' }}
              className="object-left"
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          {/* Vague décorative */}
          <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
            <svg viewBox="0 0 800 50" preserveAspectRatio="none" className="w-full h-full">
              <path d="M 0 0 Q 200 50 400 25 Q 600 0 800 25 L 800 50 L 0 50 Z" fill="rgba(255,255,255,0.05)" />
            </svg>
          </div>
        </div>

        {/* Items du menu mobile avec effet spécial */}
        <div className="py-3 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-2 px-3">
              {!item.submenu ? (
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-all duration-200
                            ${isActive(item.href) ? 'bg-white/10' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-1.5 bg-white/10 rounded-full">
                    {getIconForItem(index)}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <div className="overflow-hidden rounded-lg bg-white/5">
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className={`flex items-center justify-between w-full gap-3 py-3 px-4 text-white hover:bg-white/5 transition-colors
                              ${isActive(item.href) || activeSubmenu === index ? 'bg-white/5' : ''}`}
                    aria-expanded={activeSubmenu === index}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white/10 rounded-full">
                        {getIconForItem(index)}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeSubmenu === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-out 
                                  ${activeSubmenu === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="bg-white/5 px-3 py-2 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={`flex items-center gap-2 py-2.5 pl-10 pr-4 rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors
                                    ${isActive(subItem.href) ? 'bg-white/10 text-white' : ''}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Section contact avec design fun et logo FFSS */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10 backdrop-blur-sm bg-blue-900/60">
          <div className="rounded-lg bg-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <LifeBuoy className="h-4 w-4 text-white" />
                </div>
                <p className="font-semibold text-white">Besoin d'aide ?</p>
              </div>
              
              {/* Logo FFSS mobile */}
              <Link href="https://www.ffss.fr" target="_blank" rel="noopener noreferrer">
                <div className="relative w-8 h-8">
                  <Image
                    src={logos.ffss}
                    alt="FFSS"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="brightness-150"
                  />
                </div>
              </Link>
            </div>
            <div className="space-y-2">
              <a href="tel:0641543355" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <span>06 41 54 33 55</span>
              </a>
              <a href="mailto:contact@aloha-sauvetage.fr" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <span>contact@aloha-sauvetage.fr</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0) translateY(0) scaleY(1); }
          50% { transform: translateX(-25%) translateY(1px) scaleY(1.2); }
          100% { transform: translateX(-50%) translateY(0) scaleY(1); }
        }
        .animate-wave {
          animation: wave 10s linear infinite;
        }
      `}</style>
    </nav>
  );
}