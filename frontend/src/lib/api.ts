import useSWR from 'swr';
import type {
  Media,
  Recommendation,
  SearchResults,
  Collection,
  User,
  RandomFilter,
  IntegrationResult,
  CrossCategoryResult,
  AuthResponse,
  MediaType,
  MediaFormat,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private get token(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('anibrain-token');
    }
    return null;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Media endpoints
  async getMedia(id: string): Promise<Media> {
    return this.request<Media>(`/media/${id}`);
  }

  async getRecommendations(id: string, limit = 20): Promise<Recommendation[]> {
    return this.request<Recommendation[]>(`/media/${id}/recommendations?limit=${limit}`);
  }

  async searchAll(query: string, limit = 10): Promise<SearchResults> {
    return this.request<SearchResults>(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async searchMedia(
    type: MediaType,
    query: string,
    limit = 20
  ): Promise<{ media: Media[] }> {
    return this.request<{ media: Media[] }>(
      `/search/${type.toLowerCase()}?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  async getRandomMedia(
    type: MediaType,
    filters?: Partial<RandomFilter>
  ): Promise<Media> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.formats?.length) params.set('formats', filters.formats.join(','));
      if (filters.genresInclude?.length) params.set('genresInclude', filters.genresInclude.join(','));
      if (filters.genresExclude?.length) params.set('genresExclude', filters.genresExclude.join(','));
      if (filters.yearMin) params.set('yearMin', String(filters.yearMin));
      if (filters.yearMax) params.set('yearMax', String(filters.yearMax));
      if (filters.ratingMin) params.set('ratingMin', String(filters.ratingMin));
      if (filters.countryOfOrigin) params.set('countryOfOrigin', filters.countryOfOrigin);
    }
    const qs = params.toString();
    return this.request<Media>(`/random/${type.toLowerCase()}${qs ? `?${qs}` : ''}`);
  }

  // Integration endpoints
  async getIntegrationRecommendations(
    platform: 'ANILIST' | 'MYANIMELIST',
    username: string,
    type?: MediaType
  ): Promise<IntegrationResult> {
    let endpoint = `/integrations/${platform.toLowerCase()}/${encodeURIComponent(username)}`;
    if (type) endpoint += `?type=${type.toLowerCase()}`;
    return this.request<IntegrationResult>(endpoint);
  }

  // Cross-category endpoints
  async getCrossCategory(
    fromType: MediaType,
    toType: MediaType,
    id: string
  ): Promise<CrossCategoryResult> {
    const from = fromType.toLowerCase().replace(/_/g, '-');
    const to = toType.toLowerCase().replace(/_/g, '-');
    return this.request<CrossCategoryResult>(`/cross-category/${from}-to-${to}/${id}`);
  }

  // Collection endpoints
  async getCollections(): Promise<Collection[]> {
    return this.request<Collection[]>('/collections');
  }

  async getCollection(id: string): Promise<Collection> {
    return this.request<Collection>(`/collections/${id}`);
  }

  async createCollection(data: Partial<Collection>): Promise<Collection> {
    return this.request<Collection>('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCollection(id: string, data: Partial<Collection>): Promise<Collection> {
    return this.request<Collection>(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCollection(id: string): Promise<void> {
    return this.request<void>(`/collections/${id}`, { method: 'DELETE' });
  }

  async voteCollection(id: string, vote: 'up' | 'down'): Promise<Collection> {
    return this.request<Collection>(`/collections/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(username: string): Promise<User> {
    return this.request<User>(`/users/${username}`);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // User media actions
  async saveMedia(mediaId: string): Promise<void> {
    return this.request<void>('/users/me/saved', {
      method: 'POST',
      body: JSON.stringify({ mediaId }),
    });
  }

  async unsaveMedia(mediaId: string): Promise<void> {
    return this.request<void>(`/users/me/saved/${mediaId}`, {
      method: 'DELETE',
    });
  }

  async getSavedMedia(): Promise<string[]> {
    return this.request<string[]>('/users/me/saved');
  }

  // Utility
  buildImageUrl(anilistId: number, type: MediaType): string {
    const mediaType = type === 'ANIME' ? 'anime' : 'manga';
    return `https://s4.anilist.co/file/anilistcdn/media/${mediaType}/cover/large/bx${anilistId}.jpg`;
  }

  buildBannerUrl(anilistId: number, type: MediaType): string {
    const mediaType = type === 'ANIME' ? 'anime' : 'manga';
    return `https://s4.anilist.co/file/anilistcdn/media/${mediaType}/banner/n${anilistId}.jpg`;
  }
}

export const api = new ApiClient(API_URL);

// ============================================================
// SWR Hooks
// ============================================================

const swrFetcher = (url: string) => {
  const endpoint = url.replace(API_URL, '');
  return api.request<any>(endpoint);
};

export function useMedia(id: string | undefined) {
  return useSWR(id ? `${API_URL}/media/${id}` : null, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useRecommendations(id: string | undefined, limit = 20) {
  return useSWR(
    id ? `${API_URL}/media/${id}/recommendations?limit=${limit}` : null,
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

export function useSearch(query: string, limit = 10) {
  return useSWR(
    query ? `${API_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}` : null,
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}

export function useRandomMedia(type: MediaType, filters?: Partial<RandomFilter>) {
  const params = new URLSearchParams();
  if (filters?.formats?.length) params.set('formats', filters.formats.join(','));
  if (filters?.genresInclude?.length) params.set('genresInclude', filters.genresInclude.join(','));
  if (filters?.genresExclude?.length) params.set('genresExclude', filters.genresExclude.join(','));
  if (filters?.yearMin) params.set('yearMin', String(filters.yearMin));
  if (filters?.yearMax) params.set('yearMax', String(filters.yearMax));
  if (filters?.ratingMin) params.set('ratingMin', String(filters.ratingMin));
  if (filters?.countryOfOrigin) params.set('countryOfOrigin', filters.countryOfOrigin);

  const key = `${API_URL}/random/${type.toLowerCase()}?${params.toString()}`;
  return useSWR(key, swrFetcher, { revalidateOnFocus: false });
}

export function useIntegrationResults(
  platform: 'ANILIST' | 'MYANIMELIST',
  username: string | undefined,
  type?: MediaType
) {
  let endpoint = `${API_URL}/integrations/${platform.toLowerCase()}/${username}`;
  if (type) endpoint += `?type=${type.toLowerCase()}`;
  return useSWR(username ? endpoint : null, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });
}

export function useCrossCategory(
  fromType: MediaType,
  toType: MediaType,
  id: string | undefined
) {
  const from = fromType.toLowerCase().replace(/_/g, '-');
  const to = toType.toLowerCase().replace(/_/g, '-');
  return useSWR(
    id ? `${API_URL}/cross-category/${from}-to-${to}/${id}` : null,
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

export function useCollection(id: string | undefined) {
  return useSWR(id ? `${API_URL}/collections/${id}` : null, swrFetcher, {
    revalidateOnFocus: false,
  });
}

export function useCollections() {
  return useSWR(`${API_URL}/collections`, swrFetcher, {
    revalidateOnFocus: false,
  });
}

export function useProfile(username: string | undefined) {
  return useSWR(username ? `${API_URL}/users/${username}` : null, swrFetcher, {
    revalidateOnFocus: false,
  });
}
