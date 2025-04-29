// src/hooks/useNews.ts
import { useQuery } from '@tanstack/react-query';
import { NewsItem, NewsResponse, fetchNews } from '@/lib/api';

export const useNews = (params: { page?: number; limit?: number } = {}) => {
  return useQuery<NewsResponse, Error>({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};