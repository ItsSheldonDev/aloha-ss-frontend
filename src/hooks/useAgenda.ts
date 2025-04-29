// src/hooks/useAgenda.ts
import { useState, useEffect } from 'react';

interface AgendaEvent {
  id: string;
  title: string;
  date: string; // ISO date string, par exemple "2025-03-15T10:00:00Z"
  description?: string | null;
  location?: string | null;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function useAgenda() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  const loadAgenda = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = 'https://api.aloha-secourisme.fr/api/formations';
      const response = await fetch(url, {
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement de l\'agenda');
      const result = await response.json();

      // Vérifier si la réponse contient un champ 'data' avec le tableau
      const agendaEvents = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
      // Trier les événements par date
      const sortedEvents = agendaEvents.sort((a: AgendaEvent, b: AgendaEvent) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sortedEvents);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Erreur:', error);
      setError(error.message || 'Impossible de charger l\'agenda');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgenda();
  }, []);

  return { events, isLoading, error, refetch: loadAgenda };
}