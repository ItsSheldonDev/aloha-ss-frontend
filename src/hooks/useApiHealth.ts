// src/hooks/useApiHealth.ts
import { useQuery } from '@tanstack/react-query';
import { checkApiHealth } from '@/lib/api';

export function useApiHealth() {
  return useQuery({
    queryKey: ['apiHealth'],
    queryFn: checkApiHealth,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  });
}