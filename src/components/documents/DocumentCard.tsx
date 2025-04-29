// src/components/documents/DocumentCard.tsx
import { Download } from 'lucide-react';
import { Document } from '@/lib/api';
import { formatFileSize } from '@/hooks/useDocuments';

interface DocumentCardProps {
  document: Document;
  onDownload: (documentId: string) => void;
  isDownloading: boolean;
  showDescription?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export default function DocumentCard({
  document,
  onDownload,
  isDownloading,
  showDescription = true,
  variant = 'default'
}: DocumentCardProps) {
  const handleDownload = () => {
    onDownload(document.id);
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 
                 hover:border-[#0e5399] hover:bg-blue-50 transition-colors 
                 group w-full text-left"
      >
        <Download className={`w-5 h-5 text-gray-400 group-hover:text-[#0e5399] ${isDownloading ? 'animate-pulse' : ''}`} />
        <div className="flex-grow truncate">
          <span className="font-mk-abel text-gray-700 group-hover:text-[#0e5399] truncate block">
            {document.title}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{document.downloads || 0} téléchargements</span>
          </div>
        </div>
      </button>
    );
  }
  
  if (variant === 'featured') {
    return (
      <div
        onClick={handleDownload}
        className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100 relative group cursor-pointer ${isDownloading ? 'opacity-75' : ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e5399]/0 to-[#0e5399]/0 group-hover:from-[#0e5399]/5 group-hover:to-transparent transition-all duration-300" />
        
        <div className="p-8 flex items-start gap-6 relative">
          <div className="p-4 rounded-xl bg-blue-50 flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
            <Download className={`w-8 h-8 text-[#0e5399] ${isDownloading ? 'animate-pulse' : ''}`} />
          </div>

          <div className="flex-grow">
            <h2 className="text-xl font-mk-abel text-gray-800 mb-3 group-hover:text-[#0e5399] transition-colors">
              {document.title}
            </h2>

            {showDescription && document.description && (
              <p className="text-gray-600 font-mk-abel mb-5 leading-relaxed">
                {document.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e5399] text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-mk-abel text-sm group-hover:shadow-md">
                <Download className="w-4 h-4" />
                Télécharger
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  {formatFileSize(document.size)}
                </span>
                <span>•</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  {document.downloads} téléchargements
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      onClick={handleDownload}
      className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 
        transition-all duration-300 group cursor-pointer ${isDownloading ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
          <Download className={`w-6 h-6 text-[#0e5399] ${isDownloading ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <h3 className="font-mk-abel text-xl text-gray-700 group-hover:text-[#0e5399] transition-colors">
            {document.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">
              {formatFileSize(document.size)}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              {`${document.downloads || 0} téléchargements`}
            </span>
          </div>
          {showDescription && document.description && (
            <p className="text-sm text-gray-500 mt-2">
              {document.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}