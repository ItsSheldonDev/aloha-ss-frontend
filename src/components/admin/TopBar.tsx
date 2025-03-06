// src/components/admin/TopBar.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  Navbar, 
  NavbarContent, 
  Input, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar,
  Badge,
  Button
} from '@nextui-org/react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function TopBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState('');
  const [profileData, setProfileData] = useState({
    avatar: '',
    nom: '',
    prenom: '',
  });

  useEffect(() => {
    // Charger les données du profil
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData({
            avatar: data.avatar || '',
            nom: data.nom || '',
            prenom: data.prenom || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    if (session?.user) {
      loadProfile();
    }
  }, [session]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    const searchLower = value.toLowerCase();
    if (searchLower.includes('inscript')) {
      router.push('/admin/dashboard/inscriptions');
    } else if (searchLower.includes('galerie')) {
      router.push('/admin/dashboard/galerie');
    } else if (searchLower.includes('param')) {
      router.push('/admin/dashboard/settings');
    } else if (searchLower.includes('profil')) {
      router.push('/admin/dashboard/settings/profile');
    }
  };

  const handleMenuAction = (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/admin/dashboard/settings/profile');
        break;
      case 'settings':
        router.push('/admin/dashboard/settings');
        break;
      case 'logout':
        signOut({ callbackUrl: '/admin' });
        break;
    }
  };

  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarContent justify="start">
        <Input
          classNames={{
            base: "max-w-xl",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Rechercher une page..."
          size="sm"
          startContent={<MagnifyingGlassIcon className="w-5 h-5 text-default-400" />}
          type="search"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => setSearchValue('')}
          isClearable
        />
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly variant="light" radius="full">
              <Badge content="2" color="danger" shape="circle">
                <BellIcon className="w-6 h-6 text-default-400" />
              </Badge>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Notifications">
            <DropdownItem key="notification-1">
              <div className="flex flex-col gap-1">
                <p className="text-sm">Nouvelle inscription PSC1</p>
                <p className="text-xs text-default-500">Il y a 5 minutes</p>
              </div>
            </DropdownItem>
            <DropdownItem key="notification-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm">Session BNSSA complète</p>
                <p className="text-xs text-default-500">Il y a 1 heure</p>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={`${profileData.prenom} ${profileData.nom}`}
              size="sm"
              src={profileData.avatar || "/images/admin/avatar-placeholder.png"}
              fallback={
                <UserIcon className="w-4 h-4 text-default-400" />
              }
            />
          </DropdownTrigger>
          <DropdownMenu onAction={(key) => handleMenuAction(key as string)}>
            <DropdownItem key="user" className="h-14 gap-2" textValue="User">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{`${profileData.prenom} ${profileData.nom}`}</span>
                <span className="text-xs text-default-500">{session?.user?.email}</span>
              </div>
            </DropdownItem>
            <DropdownItem key="profile" startContent={<UserIcon className="w-4 h-4" />}>
              Mon profil
            </DropdownItem>
            <DropdownItem key="settings" startContent={<Cog6ToothIcon className="w-4 h-4" />}>
              Paramètres
            </DropdownItem>
            <DropdownItem 
              key="logout" 
              color="danger"
              className="text-danger"
              startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
            >
              Déconnexion
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}