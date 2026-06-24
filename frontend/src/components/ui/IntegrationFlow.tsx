'use client';

import { useState } from 'react';
import { useIntegrationResults } from '@/lib/api';
import MediaCard from './MediaCard';
import type { MediaType } from '@/lib/types';

interface IntegrationFlowProps {
  platform: 'ANILIST' | 'MYANIMELIST';
  onNavigate?: (type: MediaType) => void;
}

export default function IntegrationFlow({ platform, onNavigate }: IntegrationFlowProps) {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [activeType, setActiveType] = useState<MediaType | undefined>(undefined);

  const { data, error, isLoading } = useIntegrationResults(platform, submittedUsername || undefined, activeType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSubmittedUsername(username.trim());
    }
  };

  const handleTypeFilter = (type: MediaType) => {
    setActiveType(activeType === type ? undefined : type);
  };

  const platformName = platform === 'ANILIST' ? 'AniList' : 'MyAnimeList';
  const platformColor = platform === 'ANILIST' ? 'text-blue-400' : 'text-orange-400';
  const platformBg = platform === 'ANILIST' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-orange-500/10 border-orange-500/30';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step 1: Enter Username */}
      <div className="bg-bg-card border border-border-secondary rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-bold text-lg">1</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Enter your {platformName} username</h2>
            <p className="text-sm text-text-muted">We&apos;ll fetch your list and find recommendations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={`${platformName} username...`}
            className="flex-1 px-4 py-3 text-sm rounded-xl bg-bg-input border border-border-primary
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                       transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-medium
                       hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            {isLoading ? 'Fetching...' : 'Fetch'}
          </button>
        </form>
      </div>

      {/* After username submitted */}
      {submittedUsername && (
        <>
          {/* Step 2: Results */}
          <div className="bg-bg-card border border-border-secondary rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-lg">2</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Recommendations for{' '}
                  <span className={platformColor}>{submittedUsername}</span>
                </h2>
                <p className="text-sm text-text-muted">
                  Based on your {platformName} list
                </p>
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => handleTypeFilter('ANIME')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                  ${activeType === 'ANIME' || !activeType
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-secondary text-text-secondary border-border-secondary hover:border-accent/50'
                  }`}
              >
                Anime
              </button>
              <button
                onClick={() => handleTypeFilter('MANGA')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                  ${activeType === 'MANGA'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-secondary text-text-secondary border-border-secondary hover:border-accent/50'
                  }`}
              >
                Manga
              </button>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-error mb-2">Failed to load recommendations</p>
                <p className="text-sm text-text-muted">
                  Make sure the username exists and is public on {platformName}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-bg-secondary rounded-xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            )}

            {/* Results */}
            {data && !isLoading && (
              <>
                {data.media && data.media.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.media.map((media: any) => (
                      <MediaCard key={media.id} media={media} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-text-muted">No recommendations found</p>
                    <p className="text-sm text-text-muted mt-1">
                      Try adding more anime/manga to your list
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
