// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.aloha-secourisme.fr';

// Interface pour les réponses réussies
interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  executionTimeMs?: number;
}

// Interface pour les réponses d'erreur
interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error?: Record<string, string>;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      const errorResponse = json as ApiErrorResponse;
      throw new Error(errorResponse.message || 'Erreur lors de la requête API');
    }

    // Vérifier si la réponse est déjà un objet ou un tableau
    // Certains endpoints peuvent renvoyer directement les données
    if (!json.data && !json.statusCode) {
      return json as T;
    }

    const successResponse = json as ApiResponse<T>;
    return successResponse.data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

// Types partagés
export type TypeFormation = 'PSC1' | 'SST' | 'PSE1' | 'PSE2' | 'BNSSA' | 'SSA' | 'BSB' | 'GQS' | 'FORMATEUR' | 'RECYCLAGE' | 'PERMIS';
export type StatutFormation = 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
export type StatutInscription = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' | 'ANNULEE';
export type Category = 'Formations' | 'Sauvetage_Sportif' | 'Evenements';
export type DocumentCategory = 'FORMATIONS_PRO' | 'FORMATIONS_GRAND_PUBLIC' | 'ADMINISTRATIF' | 'RESSOURCES' | 'CGV' | 'MIEUX_NOUS_CONNAITRE';

export interface Formation {
  id: string;
  titre: string;
  type: TypeFormation;
  dateDebut: string;
  dateFin: string;
  description: string | null;
  duree: string;
  prix: number | string;
  statut: StatutFormation;
}

export interface GalleryImage {
  id: string;
  filename: string;
  alt: string;
  category: Category;
  createdAt: string;
  updatedAt?: string;
  url: string;
}

export interface CategoryImages {
  category: Category;
  images: GalleryImage[];
}

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  filename: string;
  size: number;
  downloads: number;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author?: string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Settings {
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
  };
  notifications: {
    emailInscription: boolean;
    emailContact: boolean;
  };
}

// Endpoints publics
export async function fetchFormations(params: { type?: string; period?: 'all' | '2024' | '2025' | 'recent' } = {}): Promise<Formation[]> {
  try {
    // Créer un objet URLSearchParams pour les paramètres valides uniquement
    const urlParams = new URLSearchParams();
    
    // N'ajouter le type que s'il existe et n'est pas 'all'
    if (params.type && params.type !== 'all') {
      urlParams.append('type', params.type);
    }
    
    // N'ajouter la période que si elle existe
    if (params.period) {
      urlParams.append('period', params.period);
    }
    
    // Construire l'URL avec les paramètres
    const queryString = urlParams.toString();
    const url = `/api/formations${queryString ? `?${queryString}` : ''}`;
    
    return fetchApi<Formation[]>(url);
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error);
    return [];
  }
}

export async function fetchGalleryImages(params: { category?: Category; mode?: 'all' | 'random' } = {}): Promise<GalleryImage[] | CategoryImages[]> {
  try {
    // Construction de l'URL avec les paramètres
    let url = `/api/gallery`;
    const queryParams = [];
    
    if (params.category) {
      queryParams.push(`category=${encodeURIComponent(params.category)}`);
    }
    
    if (params.mode) {
      queryParams.push(`mode=${encodeURIComponent(params.mode)}`);
    }
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const result = await fetchApi<GalleryImage[] | CategoryImages[]>(url);
    
    // Le backend renvoie maintenant des URLs complètes, donc pas besoin de les transformer
    return result;
  } catch (error) {
    console.error('Erreur lors du chargement des images:', error);
    return [];
  }
}

export async function fetchRandomGalleryImages(): Promise<GalleryImage[]> {
  try {
    return fetchApi<GalleryImage[]>(`/api/gallery?mode=random`);
  } catch (error) {
    console.error('Erreur lors du chargement des images aléatoires:', error);
    return [];
  }
}

export async function fetchGalleryByCategory(): Promise<CategoryImages[]> {
  try {
    return fetchApi<CategoryImages[]>(`/api/gallery?mode=all`);
  } catch (error) {
    console.error('Erreur lors du chargement des images par catégorie:', error);
    return [];
  }
}

export async function fetchDocuments(params: { category?: DocumentCategory } = {}): Promise<Document[]> {
  try {
    const urlParams = new URLSearchParams(params as Record<string, string>).toString();
    return fetchApi<Document[]>(`/api/documents${urlParams ? `?${urlParams}` : ''}`);
  } catch (error) {
    console.error('Erreur lors du chargement des documents:', error);
    return [];
  }
}

export interface NewsResponse {
  news: NewsItem[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export async function fetchNews(params: { page?: number; limit?: number } = {}): Promise<NewsResponse> {
  try {
    const urlParams = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10),
    }).toString();
    return fetchApi<NewsResponse>(`/api/news?${urlParams}`);
  } catch (error) {
    console.error('Erreur lors du chargement des actualités:', error);
    return { news: [], pagination: { total: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10 } };
  }
}

export async function submitSauvetageSportifInscription(data: {
  firstname: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  observation?: string;
  token: string;
}): Promise<{ message: string }> {
  try {
    return fetchApi<{ message: string }>(`/api/inscriptions/sauvetage-sportif`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription au sauvetage sportif:', error);
    throw error;
  }
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  token: string;
}): Promise<{ message: string }> {
  try {
    return fetchApi<{ message: string }>(`/api/inscriptions/contact`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error);
    throw error;
  }
}

export async function submitIncident(data: {
  name: string;
  email: string;
  type: string;
  details: string;
  location: string;
  token: string;
}): Promise<{ message: string }> {
  try {
    return fetchApi<{ message: string }>(`/api/inscriptions/signalement`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi d\'incident:', error);
    throw error;
  }
}

// URL de téléchargement d'un document
export function getDocumentDownloadUrl(documentId: string): string {
  return `${API_URL}/api/documents/${documentId}/download`;
}

// Fonction utilitaire pour formater la date pour l'affichage
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return dateString || ''; // Retourner la date non formatée ou une chaîne vide
  }
}

// Fonction utilitaire pour vérifier si une formation est à venir
export function isFormationUpcoming(formation: Formation): boolean {
  try {
    const formationDate = new Date(formation.dateDebut);
    const now = new Date();
    return formationDate > now;
  } catch (error) {
    console.error('Erreur lors de la vérification de la date de formation:', error);
    return false;
  }
}

// Fonction pour obtenir la santé de l'API
export async function checkApiHealth(): Promise<{
  status: string;
  timestamp: string;
  uptime: number;
  database: { status: string };
  responseTime: string;
  environment: string;
  version: string;
}> {
  try {
    return fetchApi<{
      status: string;
      timestamp: string;
      uptime: number;
      database: { status: string };
      responseTime: string;
      environment: string;
      version: string;
    }>('/api/health');
  } catch (error) {
    console.error('Erreur lors de la vérification de la santé de l\'API:', error);
    throw error;
  }
}