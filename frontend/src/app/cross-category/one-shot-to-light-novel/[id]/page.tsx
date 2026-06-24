'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCrossCategory, api } from '@/lib/api';
import MediaCard from '@/components/ui/MediaCard';
import { MediaDetailSkeleton } from '@/components/ui/SkeletonLoader';

export default function OneShotToLightNovelPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, error, isLoading } = useCrossCategory('ONE_SHOT', 'LIGHT_NOVEL', id);

  if (isLoading) return <MediaDetailSkeleton />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-error text-lg font-medium mb-2">Failed to load cross-category recommendations</p>
        <p className="text-text-muted text-sm mb-6">{error?.message || 'Data not found'}</p>
        <Link
          href="/recommender/anime"
          className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
        >
          Back to Anime
        </Link>
      </div>
    );
  }

  const { sourceMedia, recommendations } = data;
  const title = sourceMedia.title?.english || sourceMedia.title?.romaji || 'Unknown';
  const coverUrl = sourceMedia.coverImage || api.buildImageUrl(sourceMedia.anilistId, 'ONE_SHOT');

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[280px] md:h-[360px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${sourceMedia.bannerImage || coverUrl})` }}
        />
        <div className="absolute inset-0 gradient-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start mb-12">
          <div className="flex-shrink-0">
            <img
              src={coverUrl}
              alt={title}
              className="w-40 h-56 object-cover rounded-xl shadow-xl"
            />
          </div>
          <div className="flex-1 pt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{title}</h1>
            {sourceMedia.title?.native && (
              <p className="text-lg text-text-muted mb-3">{sourceMedia.title.native}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase bg-accent/10 text-accent border border-accent/20">
                One Shot
              </span>
              {sourceMedia.averageScore && (
                <span className="text-sm font-semibold text-accent">{sourceMedia.averageScore}% Score</span>
              )}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-xs font-semibold text-accent">One Shot to Light Novel</span>
            </div>
          </div>
        </div>

        <div className="pb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Light Novels for {title} Fans</h2>
            <p className="text-text-muted mt-1 text-sm">
              Discover light novel recommendations based on this one shot
            </p>
          </div>

          {recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.map((rec: any, index: number) => (
                <MediaCard
                  key={rec.media?.id || index}
                  media={rec.media}
                  similarityScore={rec.similarityScore}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-bg-card rounded-2xl border border-border-secondary">
              <p className="text-text-muted">No light novel recommendations available for this one shot yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
