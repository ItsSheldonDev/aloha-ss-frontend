// src/hooks/useSettings.ts
import { useQuery } from '@tanstack/react-query';
import { Settings } from '@/lib/api';

// Fonction pour récupérer les paramètres depuis l'API
async function fetchSettings(): Promise<Settings> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.aloha-secourisme.fr'}/api/settings`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des paramètres');
    }
    
    const data = await response.json();
    
    // Si la réponse contient un champ 'data', l'utiliser
    if (data.data) {
      return data.data;
    }
    
    // Sinon, utiliser la réponse elle-même
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
    
    // Retourner des paramètres par défaut en cas d'erreur
    return {
      contact: {
        email: 'contact@aloha-sauvetage.fr',
        phone: '06 41 54 33 55',
        address: '1 Boulevard Anne de Bretagne, 56400 Auray'
      },
      social: {
        facebook: 'https://www.facebook.com/alohasauvetage',
        instagram: 'https://www.instagram.com/alohasauvetage'
      },
      notifications: {
        emailInscription: true,
        emailContact: true
      }
    };
  }
}

export function useSettings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 60 * 60 * 1000, // 1 heure - Les paramètres changent rarement
    retry: 2,
  });

  return {
    settings: data || {
      contact: {
        email: 'contact@aloha-sauvetage.fr',
        phone: '06 41 54 33 55',
        address: '1 Boulevard Anne de Bretagne, 56400 Auray'
      },
      social: {
        facebook: 'https://www.facebook.com/alohasauvetage',
        instagram: 'https://www.instagram.com/alohasauvetage'
      },
      notifications: {
        emailInscription: true,
        emailContact: true
      }
    },
    isLoading,
    error,
  };
}