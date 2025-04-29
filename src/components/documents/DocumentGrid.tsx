// src/components/documents/DocumentGrid.tsx
import { Spinner } from "@nextui-org/react";
import { Document, DocumentCategory } from '@/lib/api';
import DocumentCard from './DocumentCard';
import { DOCUMENT_CATEGORY_LABELS } from '@/hooks/useDocuments';

interface DocumentGridProps {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  onDownload: (documentId: string) => void;
  isDownloading: Record<string, boolean>;
  showCategories?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  cardVariant?: 'default' | 'compact' | 'featured';
  showDescription?: boolean;
  layout?: 'grid' | 'list';
  columnsOnDesktop?: 1 | 2 | 3 | 4;
}

export default function DocumentGrid({
  documents,
  isLoading,
  error,
  onDownload,
  isDownloading,
  showCategories = true,
  emptyMessage = "Aucun document disponible pour le moment",
  errorMessage = "Une erreur est survenue lors du chargement des documents",
  cardVariant = 'default',
  showDescription = true,
  layout = 'grid',
  columnsOnDesktop = 2,
}: DocumentGridProps) {
  // Détermine le nombre de colonnes en fonction de la prop
  const gridCols = columnsOnDesktop === 1 
    ? 'grid-cols-1' 
    : columnsOnDesktop === 3 
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
      : columnsOnDesktop === 4 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
        : 'grid-cols-1 md:grid-cols-2';

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {errorMessage}: {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center text-gray-500 font-mk-abel py-8">
        {emptyMessage}
      </div>
    );
  }

  if (showCategories) {
    // Grouper les documents par catégorie
    const documentsByCategory = documents.reduce((acc, doc) => {
      const category = doc.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(doc);
      return acc;
    }, {} as Record<DocumentCategory, Document[]>);

    return (
      <div className="space-y-10">
        {Object.entries(documentsByCategory).map(([category, docs]) => {
          const typedCategory = category as DocumentCategory;
          return (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-mk-abel text-[#0e5399] font-semibold">
                {DOCUMENT_CATEGORY_LABELS[typedCategory] || category}
              </h3>
              
              {layout === 'grid' ? (
                <div className={`grid gap-4 md:gap-6 ${gridCols}`}>
                  {docs.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onDownload={onDownload}
                      isDownloading={!!isDownloading[doc.id]}
                      showDescription={showDescription}
                      variant={cardVariant}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {docs.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onDownload={onDownload}
                      isDownloading={!!isDownloading[doc.id]}
                      showDescription={showDescription}
                      variant="compact"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Sans catégories, afficher tous les documents
  return (
    layout === 'grid' ? (
      <div className={`grid gap-4 md:gap-6 ${gridCols}`}>
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onDownload={onDownload}
            isDownloading={!!isDownloading[doc.id]}
            showDescription={showDescription}
            variant={cardVariant}
          />
        ))}
      </div>
    ) : (
      <div className="space-y-3">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onDownload={onDownload}
            isDownloading={!!isDownloading[doc.id]}
            showDescription={showDescription}
            variant="compact"
          />
        ))}
      </div>
    )
  );
}