// src/hooks/useFormations.ts
import { useQuery } from '@tanstack/react-query';
import { fetchFormations, TypeFormation, Formation } from '@/lib/api';

interface UseFormationsOptions {
  type?: TypeFormation | string;
  period?: 'all' | '2024' | '2025' | 'recent';
  enabled?: boolean;
}

export function useFormations(options: UseFormationsOptions = {}) {
  const { type, period, enabled = true } = options;
  
  return useQuery({
    queryKey: ['formations', type, period],
    queryFn: () => fetchFormations({ type, period }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}

// Fonction utilitaire pour filtrer les formations à venir
export function getUpcomingFormations(formations: Formation[]): Formation[] {
  const now = new Date();
  return formations
    .filter(formation => new Date(formation.dateDebut) > now)
    .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());
}

// Fonction utilitaire pour grouper les formations par type
export function groupFormationsByType(formations: Formation[]): Record<TypeFormation, Formation[]> {
  return formations.reduce((acc, formation) => {
    if (!acc[formation.type]) {
      acc[formation.type] = [];
    }
    acc[formation.type].push(formation);
    return acc;
  }, {} as Record<TypeFormation, Formation[]>);
}