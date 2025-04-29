// src/components/ReviewsSection.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface ReviewsSectionProps {
  widgetId: string;
  className?: string;
}

export default function ReviewsSection({
  widgetId = "2158874", // ID de widget Tagembed par défaut
  className = ""
}: ReviewsSectionProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`reviews-container ${className}`}>
      {/* Conteneur du widget Tagembed */}
      <div 
        ref={widgetRef}
        className="tagembed-widget" 
        style={{width: "100%", height: "100%"}} 
        data-widget-id={widgetId} 
        data-tags="false"
        view-url={`https://widget.tagembed.com/${widgetId}`}
      />
      
      {/* Chargement du script Tagembed */}
      <Script
        src="https://widget.tagembed.com/embed.min.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
    </div>
  );
}