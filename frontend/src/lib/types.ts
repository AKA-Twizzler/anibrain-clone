// ============================================================
// AniBrain.ai Type Definitions
// ============================================================

export type MediaType = 'ANIME' | 'MANGA' | 'LIGHT_NOVEL' | 'ONE_SHOT';

export type AnimeFormat = 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL' | 'MUSIC';
export type MangaFormat = 'MANGA' | 'NOVEL' | 'ONE_SHOT';

export type MediaFormat = AnimeFormat | MangaFormat;

export type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

export type Season = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export type CountryOfOrigin = 'JP' | 'CN' | 'KR' | 'US' | 'FR' | 'UK';

export interface Media {
  id: string;
  anilistId: number;
  malId?: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  type: MediaType;
  format: MediaFormat;
  status: MediaStatus;
  description?: string;
  coverImage?: string;
  bannerImage?: string;
  genres: string[];
  tags: string[];
  studios: string[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  episodes?: number;
  chapters?: number;
  volumes?: number;
  duration?: number;
  season?: Season;
  seasonYear?: number;
  startDate?: string;
  endDate?: string;
  countryOfOrigin: CountryOfOrigin;
  isAdult: boolean;
  siteUrl?: string;
  trailer?: {
    id: string;
    site: 'youtube' | 'dailymotion';
  };
  externalLinks: ExternalLink[];
  rankings: Ranking[];
}

export interface ExternalLink {
  id: number;
  site: string;
  url: string;
  type: 'SOCIAL' | 'STREAMING' | 'INFORMATION';
  color?: string;
  icon?: string;
  notes?: string;
}

export interface Ranking {
  id: number;
  rank: number;
  type: 'RATED' | 'POPULAR';
  format: MediaFormat;
  year?: number;
  season?: Season;
  allTime: boolean;
  context: string;
}

export interface Recommendation {
  media: Media;
  similarityScore: number;
}

export interface MediaSearchResult {
  media: Media;
  score?: number;
}

export interface SearchResults {
  anime: MediaSearchResult[];
  manga: MediaSearchResult[];
  characters: any[];
  users: any[];
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  mediaIds: string[];
  media?: Media[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  username?: string;
  isPublic: boolean;
  upvotes: number;
  downvotes: number;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  collections?: Collection[];
  savedMedia?: string[];
}

export interface RandomFilter {
  formats: MediaFormat[];
  genresInclude: string[];
  genresExclude: string[];
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  ratingMax?: number;
  countryOfOrigin?: CountryOfOrigin;
  tagsInclude: string[];
  tagsExclude: string[];
  tagMode: 'AND' | 'OR';
}

export interface IntegrationRequest {
  username: string;
  platform: 'ANILIST' | 'MYANIMELIST';
}

export interface IntegrationResult {
  media: Media[];
  type: MediaType;
  platform: string;
  username: string;
}

export interface CrossCategoryResult {
  sourceMedia: Media;
  recommendations: Recommendation[];
  fromType: MediaType;
  toType: MediaType;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}
