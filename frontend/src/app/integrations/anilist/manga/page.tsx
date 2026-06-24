'use client';

import IntegrationFlow from '@/components/ui/IntegrationFlow';

export default function AniListMangaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          AniList Manga Recommendations
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Get manga-specific recommendations based on your AniList list.
        </p>
      </div>
      <IntegrationFlow platform="ANILIST" />
    </div>
  );
}
