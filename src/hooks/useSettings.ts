// src/hooks/useSettings.ts
import { useState, useEffect } from 'react';

interface SiteSettings {
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
  };
  notifications: {
    emailInscription: boolean;
    emailContact: boolean;
  };
}

const defaultSettings: SiteSettings = {
  contact: {
    email: 'contact@aloha-sauvetage.fr',
    phone: '06 41 54 33 55',
    address: '1 Boulevard Anne de Bretagne 56400 Auray'
  },
  social: {
    facebook: 'https://facebook.com/AlohaSauvetageSecourisme',
    instagram: 'https://instagram.com/aloha_sauvetage_secourisme'
  },
  notifications: {
    emailInscription: true,
    emailContact: true
  }
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings');
        if (!response.ok) throw new Error('Erreur lors du chargement des paramètres');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        setError('Impossible de charger les paramètres');
        // En cas d'erreur, on garde les paramètres par défaut
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  return { settings, isLoading, error };
}

export type { SiteSettings };