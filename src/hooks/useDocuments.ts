// src/hooks/useDocuments.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchDocuments, 
  getDocumentDownloadUrl,
  DocumentCategory, 
  Document 
} from '@/lib/api';

// Catégories de documents exportées pour être utilisées dans d'autres composants
export const DOCUMENT_CATEGORIES = {
  FORMATIONS_PRO: 'FORMATIONS_PRO',
  FORMATIONS_GRAND_PUBLIC: 'FORMATIONS_GRAND_PUBLIC',
  ADMINISTRATIF: 'ADMINISTRATIF',
  RESSOURCES: 'RESSOURCES',
  CGV: 'CGV',
  MIEUX_NOUS_CONNAITRE: 'MIEUX_NOUS_CONNAITRE',
} as const;

// Les catégories formatées pour l'affichage
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  FORMATIONS_PRO: 'Formations professionnelles',
  FORMATIONS_GRAND_PUBLIC: 'Formations grand public',
  ADMINISTRATIF: 'Documents administratifs',
  RESSOURCES: 'Ressources pédagogiques',
  CGV: 'Conditions générales de vente',
  MIEUX_NOUS_CONNAITRE: 'Mieux nous connaître',
};

export type DocumentCategoryType = keyof typeof DOCUMENT_CATEGORIES;

export function useDocuments(category?: DocumentCategoryType) {
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  // Query pour récupérer les documents
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documents', category],
    queryFn: () => fetchDocuments({ category: category as DocumentCategory }),
    staleTime: 60 * 60 * 1000, // 1 heure
  });

  // Fonction pour télécharger un document
  const downloadDocument = async (documentId: string) => {
    if (isDownloading[documentId]) return;
    
    try {
      setIsDownloading(prev => ({ ...prev, [documentId]: true }));
      
      // Ouvrir le lien de téléchargement dans un nouvel onglet
      window.open(getDocumentDownloadUrl(documentId), '_blank');
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsDownloading(prev => ({ ...prev, [documentId]: false }));
    }
  };

  return {
    documents: data || [],
    isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch,
    downloadDocument,
    isDownloading,
  };
}

// Fonction utilitaire pour formater la taille d'un fichier
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

// Fonction utilitaire pour grouper les documents par catégorie
export function groupDocumentsByCategory(documents: Document[]): Record<DocumentCategory, Document[]> {
  return documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentCategory, Document[]>);
}