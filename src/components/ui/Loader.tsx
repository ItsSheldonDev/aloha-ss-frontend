// src/components/ui/Loader.tsx
"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { logos } from '@/lib/images';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[#0e5399] z-[9999] flex items-center justify-center">
      <div className="relative w-48 h-48 animate-pulse">
        <Image
          src={logos.alohawhite}
          alt="Aloha Secourisme"
          fill
          style={{ objectFit: 'contain' }}
          className="animate-loaderpulse"
        />
      </div>
    </div>
  );
}