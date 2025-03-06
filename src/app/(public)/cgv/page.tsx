"use client";

import { FileText, Download } from "lucide-react";
import { Spinner } from "@nextui-org/react";
import { useDocuments } from "@/hooks/useDocuments";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export default function CGV() {
  const { documents, isLoading, error } = useDocuments("CGV");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
        {error}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Aucun document disponible
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6 drop-shadow-sm">
            Conditions Générales
          </h1>
          <p className="text-lg font-mk-abel text-gray-600 max-w-2xl mx-auto">
            Retrouvez ici l'ensemble de nos documents légaux et conditions générales de vente
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 relative">
          {/* Effet décoratif */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent rounded-3xl -m-6 transform -rotate-1" />

          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e5399]/0 to-[#0e5399]/0 group-hover:from-[#0e5399]/5 group-hover:to-transparent transition-all duration-300" />
              
              <div className="p-8 flex items-start gap-6 relative">
                <div className="p-4 rounded-xl bg-blue-50 flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                  <FileText className="w-8 h-8 text-[#0e5399]" />
                </div>

                <div className="flex-grow">
                  <h2 className="text-xl font-mk-abel text-gray-800 mb-3 group-hover:text-[#0e5399] transition-colors">
                    {doc.title}
                  </h2>

                  {doc.description && (
                    <p className="text-gray-600 font-mk-abel mb-5 leading-relaxed">
                      {doc.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    {/* ✅ Correction de la balise <a> manquante */}
                    <a
                      href={`/api/documents/${doc.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e5399] text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-mk-abel text-sm group-hover:shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </a>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">
                        {formatFileSize(doc.size)}
                      </span>
                      <span>•</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">
                        {doc.downloads} téléchargements
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 font-mk-abel">
              Numéro de déclaration CNIL : 1858987 v 0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
