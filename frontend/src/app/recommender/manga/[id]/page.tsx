'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMedia, useRecommendations, api } from '@/lib/api';
import GenreTag from '@/components/ui/GenreTag';
import MediaCard from '@/components/ui/MediaCard';
import { MediaDetailSkeleton } from '@/components/ui/SkeletonLoader';

export default function MangaDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: media, error: mediaError, isLoading: mediaLoading } = useMedia(`Manga/${id}`);
  const { data: recommendations, error: recError, isLoading: recLoading } = useRecommendations(`Manga/${id}`);

  if (mediaLoading) return <MediaDetailSkeleton />;

  if (mediaError || !media) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-error text-lg font-medium mb-2">Failed to load manga</p>
        <p className="text-text-muted text-sm mb-6">{mediaError?.message || 'Manga not found'}</p>
        <Link
          href="/recommender/manga"
          className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
        >
          Back to Recommender
        </Link>
      </div>
    );
  }

  const title = media.title?.english || media.title?.romaji || 'Unknown';
  const bannerUrl = media.bannerImage || api.buildBannerUrl(media.anilistId, 'MANGA');
  const coverUrl = media.coverImage || api.buildImageUrl(media.anilistId, 'MANGA');

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        />
        <div className="absolute inset-0 gradient-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={coverUrl}
              alt={title}
              className="w-48 h-72 object-cover rounded-xl shadow-xl"
            />
          </div>

          <div className="flex-1 pt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{title}</h1>
            {media.title?.native && (
              <p className="text-lg text-text-muted mb-3">{media.title.native}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase bg-accent/10 text-accent border border-accent/20">
                {media.format || 'MANGA'}
              </span>
              {media.chapters && (
                <span className="text-sm text-text-muted">{media.chapters} Chapters</span>
              )}
              {media.volumes && (
                <span className="text-sm text-text-muted">{media.volumes} Volumes</span>
              )}
              {media.averageScore && (
                <span className="text-sm font-semibold text-accent">{media.averageScore}% Score</span>
              )}
              {media.status && (
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-bg-secondary text-text-secondary border border-border-secondary">
                  {media.status}
                </span>
              )}
            </div>

            {media.studios && media.studios.length > 0 && (
              <p className="text-sm text-text-secondary mb-4">
                <span className="text-text-muted">Publisher: </span>
                {media.studios[0]}
              </p>
            )}

            {media.genres && media.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {media.genres.map((genre: string) => (
                  <GenreTag key={genre} genre={genre} />
                ))}
              </div>
            )}

            {media.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Synopsis</h3>
                <p
                  className="text-text-secondary leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{ __html: media.description }}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <button className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
                Save for Later
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-bg-card border border-border-secondary text-text-primary text-sm font-medium hover:border-accent/50 transition-colors">
                View Franchise
              </button>
            </div>

            {media.externalLinks && media.externalLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {media.externalLinks.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               bg-bg-secondary text-text-secondary hover:text-accent hover:bg-accent/5 border border-border-secondary transition-colors"
                  >
                    {link.site}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-primary">More Manga Like This</h2>
          </div>

          {recLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-bg-card rounded-xl border border-border-secondary overflow-hidden">
                  <div className="aspect-[3/4] bg-bg-secondary animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-bg-secondary rounded animate-pulse" />
                    <div className="h-3 bg-bg-secondary rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {recommendations && recommendations.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.map((rec: any, index: number) => (
                <MediaCard
                  key={rec.media?.id || index}
                  media={rec.media}
                  similarityScore={rec.similarityScore}
                />
              ))}
            </div>
          )}

          {recommendations && recommendations.length === 0 && !recLoading && (
            <div className="text-center py-12 bg-bg-card rounded-2xl border border-border-secondary">
              <p className="text-text-muted">No recommendations available for this title yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
