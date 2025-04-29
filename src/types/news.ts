// src/types/news.ts
export interface News {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author?: string; 
    published: boolean;
  }