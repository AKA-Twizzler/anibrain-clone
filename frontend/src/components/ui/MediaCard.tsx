'use client';

import Link from 'next/link';
import type { Media, MediaType } from '@/lib/types';
import SimilarityBadge from './SimilarityBadge';
import GenreTag from './GenreTag';

interface MediaCardProps {
  media: Media;
  similarityScore?: number;
  viewMode?: 'single' | 'list';
}

export default function MediaCard({ media, similarityScore, viewMode = 'single' }: MediaCardProps) {
  const title = media.title?.english || media.title?.romaji || 'Unknown';
  const subtitle = media.title?.native || '';
  const mediaType = media.type?.toLowerCase() || 'anime';
  const mediaPath = `/recommender/${mediaType}`;

  const coverImage = media.coverImage || `https://s4.anilist.co/file/anilistcdn/media/${mediaType}/cover/large/bx${media.anilistId || 0}.jpg`;

  if (viewMode === 'list') {
    return (
      <Link
        href={`${mediaPath}/${media.anilistId}`}
        className="flex items-center gap-4 p-3 rounded-xl bg-bg-card border border-border-secondary
                   card-hover hover:bg-bg-secondary transition-all duration-200 group"
      >
        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-bg-secondary">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
            {title}
          </h4>
          <p className="text-xs text-text-muted truncate">{subtitle || media.format}</p>
        </div>
        {similarityScore !== undefined && (
          <SimilarityBadge score={similarityScore} size="sm" />
        )}
      </Link>
    );
  }

  // Single (grid) view mode
  return (
    <Link
      href={`${mediaPath}/${media.anilistId}`}
      className="group block bg-bg-card rounded-xl border border-border-secondary overflow-hidden
                 card-hover transition-all duration-200"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-secondary">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Similarity Badge Overlay */}
        {similarityScore !== undefined && (
          <div className="absolute top-2 right-2">
            <SimilarityBadge score={similarityScore} size="md" />
          </div>
        )}

        {/* Media Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase
                         bg-black/60 text-white backdrop-blur-sm">
            {media.format || media.type}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-text-primary line-clamp-2 group-hover:text-accent transition-colors leading-snug">
          {title}
        </h3>

        {media.studios && media.studios.length > 0 && (
          <p className="text-xs text-text-muted mt-1 truncate">{media.studios[0]}</p>
        )}

        {/* Genre Tags */}
        {media.genres && media.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {media.genres.slice(0, 3).map((genre) => (
              <GenreTag key={genre} genre={genre} size="sm" />
            ))}
          </div>
        )}

        {/* Score & Info */}
        <div className="flex items-center gap-3 mt-3">
          {media.averageScore && (
            <span className="text-xs font-semibold text-accent">
              {media.averageScore}%
            </span>
          )}
          {media.episodes && (
            <span className="text-xs text-text-muted">{media.episodes} eps</span>
          )}
          {media.chapters && (
            <span className="text-xs text-text-muted">{media.chapters} ch</span>
          )}
        </div>
      </div>
    </Link>
  );
}
