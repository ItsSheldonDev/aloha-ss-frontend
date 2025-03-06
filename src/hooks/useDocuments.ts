// src/hooks/useDocuments.ts
import { useState, useEffect } from 'react';
import { DocumentCategory } from '@prisma/client';

interface Document {
 id: string;
 title: string;
 filename: string;
 category: DocumentCategory;
 size: number;
 downloads: number;
 description?: string | null;
 createdAt: string;
}

export const DOCUMENT_CATEGORIES = {
 FORMATIONS_PRO: 'FORMATIONS_PRO',
 MIEUX_NOUS_CONNAITRE: 'MIEUX_NOUS_CONNAITRE',
 CGV: 'CGV'
} as const;

export type DocumentCategoryType = keyof typeof DOCUMENT_CATEGORIES;

export function useDocuments(category?: DocumentCategoryType) {
 const [documents, setDocuments] = useState<Document[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   async function loadDocuments() {
     try {
       // Récupérer d'abord les documents
       const response = await fetch(category 
         ? `/api/documents?category=${category}`
         : '/api/documents'
       );
       
       if (!response.ok) throw new Error('Erreur chargement documents');
       const docs = await response.json();

       // Pour chaque document, récupérer son nombre de téléchargements
       const docsWithDownloads = await Promise.all(
         docs.map(async (doc: Document) => {
           const countResponse = await fetch(`/api/documents/${doc.id}/count`);
           if (countResponse.ok) {
             const { downloads } = await countResponse.json();
             return { ...doc, downloads };
           }
           return doc;
         })
       );

       setDocuments(docsWithDownloads);
     } catch (error) {
       console.error('Erreur:', error);
       setError('Impossible de charger les documents');
     } finally {
       setIsLoading(false);
     }
   }

   loadDocuments();
 }, [category]);

 return { documents, isLoading, error };
}