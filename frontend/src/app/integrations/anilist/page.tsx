'use client';

import IntegrationFlow from '@/components/ui/IntegrationFlow';
import Link from 'next/link';
import type { MediaType } from '@/lib/types';

export default function AniListIntegrationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-4">
          <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          AniList Integration
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Enter your AniList username to get personalized anime and manga recommendations
          based on your existing list.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Link
            href="/integrations/anilist/anime"
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Anime only →
          </Link>
          <Link
            href="/integrations/anilist/manga"
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Manga only →
          </Link>
        </div>
      </div>

      <IntegrationFlow platform="ANILIST" />
    </div>
  );
}
