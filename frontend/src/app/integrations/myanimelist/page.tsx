'use client';

import IntegrationFlow from '@/components/ui/IntegrationFlow';
import Link from 'next/link';

export default function MyAnimeListIntegrationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 mb-4">
          <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          MyAnimeList Integration
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Enter your MyAnimeList username to get personalized anime and manga recommendations
          based on your existing list.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Link
            href="/integrations/myanimelist/anime"
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Anime only →
          </Link>
          <Link
            href="/integrations/myanimelist/manga"
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Manga only →
          </Link>
        </div>
      </div>

      <IntegrationFlow platform="MYANIMELIST" />
    </div>
  );
}
