"use client"

import { useState } from 'react';
import { MenuItem } from './types';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Accueil", href: "/" },
    { label: "Formations", href: "/formations" },
    {
      label: "Sauvetage Sportif",
      href: "#",
      submenu: [
        { label: "Sauvetage Sportif", href: "/sauvetage-sportif" },
        { label: "Eau Plate", href: "/sauvetage-sportif/eau-plate" },
        { label: "Cotier", href: "/sauvetage-sportif/cotier" },
      ]
    },
    { label: "Poste de secours", href: "/poste-de-secours" },
    { label: "Formations Pro", href: "/formations-pro" },
    { label: "Calendrier", href: "/agenda" },
  ];

  const renderMenuItem = (item: MenuItem) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div className="relative group">
        <Link 
          href={item.href}
          className="flex items-center gap-1 px-3 py-2 font-indie-pimp text-xl text-white hover:text-gray-200 transition-colors"
        >
          {item.label}
          {hasSubmenu && <ChevronDown className="h-4 w-4" />}
        </Link>

        {hasSubmenu && (
          <div className="absolute left-0 mt-1 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="bg-[#0e5399] rounded-lg shadow-lg py-2">
              {item.submenu!.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  href={subItem.href}
                  className="block w-full px-4 py-2 text-sm font-mk-abel text-white hover:bg-blue-800 transition-colors"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0e5399]">
      <div className="w-full px-6">
        <div className="flex items-center h-20">
          {/* Logo */}
          <div className="w-32 relative h-12 ml-4">
            <Link href="/">
              <Image
                src="/images/logos/aloha_white.png"
                alt="Aloha Secourisme"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 128px) 100vw, 128px"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu - Centré avec flex-grow */}
          <div className="hidden md:flex flex-grow items-center justify-center space-x-8">
            {menuItems.map((item, index) => (
              <div key={index}>
                {renderMenuItem(item)}
              </div>
            ))}
          </div>

          {/* Espace vide pour équilibrer le logo */}
          <div className="w-32 mr-4" />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden absolute right-6 p-2 rounded-lg hover:bg-blue-800 transition-colors"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-64 bg-[#0e5399] z-50 transform transition-transform duration-300 ease-in-out md:hidden
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-blue-800">
          <span className="text-white font-mk-abel text-lg">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-blue-800 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="py-4">
          {menuItems.map((item, index) => (
            <div key={index} className="px-4">
              <Link 
                href={item.href}
                className="block py-3 text-white font-indie-pimp hover:bg-blue-800 rounded-lg px-3 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
              {item.submenu && (
                <div className="pl-4 space-y-2 mt-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block py-2 px-3 text-sm text-white font-mk-abel hover:bg-blue-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}