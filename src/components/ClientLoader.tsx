// src/components/ClientLoader.tsx
"use client";

import { useState, useEffect } from 'react';
import Loader from '@/components/ui/Loader';

export default function ClientLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement initial (à remplacer par une logique réelle si nécessaire)
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loader /> : null;
}