// src/hooks/useNews.ts
import { useState, useEffect } from 'react';
import type { News } from '@/types/news';

interface NewsResponse {
  news: News[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

interface UseNewsProps {
  limit?: number;
  page?: number;
}

export function useNews({ limit = 3, page = 1 }: UseNewsProps = {}) {
  const [news, setNews] = useState<News[]>([]);
  const [pagination, setPagination] = useState<NewsResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/news?limit=${limit}&page=${page}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des actualités');
        }

        const data: NewsResponse = await response.json();
        setNews(data.news);
        setPagination(data.pagination);

      } catch (error) {
        console.error('Error loading news:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [limit, page]);

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    news,
    pagination,
    isLoading,
    error,
    formatDate
  };
}