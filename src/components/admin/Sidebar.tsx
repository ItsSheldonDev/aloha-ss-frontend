// src/components/admin/Sidebar.tsx
'use client'

import { 
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  PhotoIcon,
  DocumentTextIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image } from '@nextui-org/react';

const menuItems = [
  { 
    title: 'Dashboard',
    icon: HomeIcon,
    path: '/admin/dashboard/'
  },
  { 
    title: 'Inscriptions',
    icon: UserGroupIcon,
    path: '/admin/dashboard/inscriptions'
  },
  { 
    title: 'Planning',
    icon: CalendarIcon,
    path: '/admin/dashboard/planning'
  },
  { 
    title: 'Galerie',
    icon: PhotoIcon,
    path: '/admin/dashboard/galerie'
  },
  { 
    title: 'News',
    icon: DocumentTextIcon,
    path: '/admin/dashboard/news'
  },
  { 
    title: 'Paramètres',
    icon: Cog6ToothIcon,
    path: '/admin/dashboard/settings'
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-divider">
      <div className="p-6">
        <Link href="/admin">
          <Image
            src="/images/logos/aloha_blue.png"
            alt="Aloha Secourisme"
            className="h-12 w-auto"
          />
        </Link>
      </div>

      <nav className="px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-default-600 transition-colors
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-default-100'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}