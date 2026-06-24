'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRandomMedia, api } from '@/lib/api';
import FilterSidebar from '@/components/ui/FilterSidebar';
import GenreTag from '@/components/ui/GenreTag';
import type { RandomFilter, MediaType } from '@/lib/types';

export default function RandomAnimePage() {
  const [filters, setFilters] = useState<Partial<RandomFilter>>({});
  const [generateKey, setGenerateKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data: media, error, isLoading } = useRandomMedia('ANIME', filters);

  const handleGenerate = () => {
    setGenerateKey((k) => k + 1);
  };

  const coverUrl = media?.coverImage
    ? media.coverImage
    : media?.anilistId
    ? api.buildImageUrl(media.anilistId, 'ANIME')
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar mediaType="ANIME" filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Random Anime</h1>
              <p className="text-text-muted">Discover something unexpected</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 rounded-xl bg-bg-card border border-border-secondary
                           text-text-secondary text-sm font-medium hover:border-accent/50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm4 6a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm2 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
                </svg>
              </button>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-accent text-white font-semibold
                           hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-lg shadow-accent/25 text-lg"
              >
                {isLoading ? 'Generating...' : '🎲 Generate Random'}
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mb-8">
              <FilterSidebar
                mediaType="ANIME"
                filters={filters}
                onChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* Result */}
          <div className="bg-bg-card rounded-2xl border border-border-secondary overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin mb-4" />
                <p className="text-text-muted">Finding random anime...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center py-24 px-4">
                <p className="text-error text-lg font-medium mb-2">Failed to generate</p>
                <p className="text-text-muted text-sm mb-6">Try adjusting your filters</p>
                <button
                  onClick={handleGenerate}
                  className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {media && !isLoading && (
              <div className="flex flex-col md:flex-row">
                {/* Cover Image */}
                {coverUrl && (
                  <div className="md:w-80 flex-shrink-0">
                    <img
                      src={coverUrl}
                      alt={media.title?.romaji || 'Random anime'}
                      className="w-full h-80 md:h-full object-cover"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-1">
                        {media.title?.english || media.title?.romaji}
                      </h2>
                      {media.title?.native && (
                        <p className="text-sm text-text-muted">{media.title.native}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/recommender/anime/${media.anilistId}`}
                        className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase bg-accent/10 text-accent border border-accent/20">
                      {media.format || 'TV'}
                    </span>
                    {media.episodes && (
                      <span className="px-3 py-1 rounded-lg text-xs bg-bg-secondary text-text-secondary border border-border-secondary">
                        {media.episodes} eps
                      </span>
                    )}
                    {media.averageScore && (
                      <span className="px-3 py-1 rounded-lg text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                        {media.averageScore}%
                      </span>
                    )}
                    {media.status && (
                      <span className="px-3 py-1 rounded-lg text-xs bg-bg-secondary text-text-secondary border border-border-secondary">
                        {media.status}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {media.genres && media.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {media.genres.map((genre: string) => (
                        <GenreTag key={genre} genre={genre} />
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {media.description && (
                    <p
                      className="text-text-secondary text-sm leading-relaxed line-clamp-4"
                      dangerouslySetInnerHTML={{ __html: media.description }}
                    />
                  )}

                  {/* More Info */}
                  <div className="mt-6 pt-4 border-t border-border-secondary">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {media.season && media.seasonYear && (
                        <div>
                          <span className="text-text-muted">Season</span>
                          <p className="text-text-primary font-medium">{media.season} {media.seasonYear}</p>
                        </div>
                      )}
                      {media.studios && media.studios.length > 0 && (
                        <div>
                          <span className="text-text-muted">Studio</span>
                          <p className="text-text-primary font-medium">{media.studios[0]}</p>
                        </div>
                      )}
                      {media.duration && (
                        <div>
                          <span className="text-text-muted">Duration</span>
                          <p className="text-text-primary font-medium">{media.duration} min/ep</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Roulette-like Generate Again */}
          {media && !isLoading && (
            <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-accent to-purple-500 text-white font-bold
                           hover:opacity-90 transition-all duration-200 shadow-lg shadow-accent/25 text-lg
                           transform hover:scale-105 active:scale-95"
              >
                🎲 Generate Another
              </button>
              <p className="text-text-muted text-sm mt-3">Click again to discover more random anime</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
