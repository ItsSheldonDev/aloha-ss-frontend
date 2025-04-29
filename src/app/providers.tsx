// src/app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Crée une instance de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Options par défaut pour les queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000,   // 30 minutes (remplace cacheTime)
      retry: 1,                 // Réessayer une fois en cas d'échec
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>{children}</NextUIProvider>
    </QueryClientProvider>
  );
}