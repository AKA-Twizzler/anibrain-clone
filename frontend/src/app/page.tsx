'use client';

import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';
import GenreTag from '@/components/ui/GenreTag';

const featureCards = [
  {
    title: 'Anime',
    description: 'Discover anime recommendations powered by AI. Find your next binge-worthy series based on what you already love.',
    href: '/recommender/anime',
    gradient: 'from-blue-500/20 to-purple-500/20',
    icon: '🎬',
    genres: ['Action', 'Romance', 'Sci-Fi'],
  },
  {
    title: 'Manga',
    description: 'Explore manga recommendations across all genres. From best-sellers to hidden gems, find your next read.',
    href: '/recommender/manga',
    gradient: 'from-green-500/20 to-teal-500/20',
    icon: '📖',
    genres: ['Fantasy', 'Horror', 'Seinen'],
  },
  {
    title: 'Light Novel',
    description: 'Dive into light novel worlds with intelligent recommendations. Discover stories that match your taste.',
    href: '/cross-category/anime-to-light-novel/21',
    gradient: 'from-orange-500/20 to-red-500/20',
    icon: '📚',
    genres: ['Isekai', 'Fantasy', 'Drama'],
  },
  {
    title: 'One Shot',
    description: 'Short and sweet — find one-shot manga recommendations for a complete story in a single sitting.',
    href: '/cross-category/anime-to-one-shot/21',
    gradient: 'from-pink-500/20 to-rose-500/20',
    icon: '⭐',
    genres: ['Comedy', 'Drama', 'Romance'],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-noise">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-accent">AI-Powered Recommendations</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight tracking-tight">
              Discover New{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                Anime &amp; Manga
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              AniBrain uses advanced AI to analyze your taste and recommend anime, manga,
              light novels, and one shots you&apos;ll love. Powered by AniList and MyAnimeList data.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <SearchBar large />
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/random/anime"
                className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium
                           hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/25"
              >
                I&apos;m Feeling Lucky
              </Link>
              <Link
                href="/recommender/anime"
                className="px-5 py-2.5 rounded-xl bg-bg-card border border-border-secondary text-text-primary text-sm font-medium
                           hover:border-accent/50 transition-all duration-200"
              >
                Explore Anime
              </Link>
              <Link
                href="/integrations/anilist"
                className="px-5 py-2.5 rounded-xl bg-bg-card border border-border-secondary text-text-primary text-sm font-medium
                           hover:border-accent/50 transition-all duration-200"
              >
                Sync My List
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featureCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl bg-bg-card border border-border-secondary
                           p-6 card-hover transition-all duration-200"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative">
                  <span className="text-3xl mb-4 block">{card.icon}</span>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    {card.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.genres.map((genre) => (
                      <GenreTag key={genre} genre={genre} size="sm" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10K+', label: 'Anime & Manga' },
            { number: '50K+', label: 'Recommendations' },
            { number: 'AniList', label: 'Integration' },
            { number: 'MAL', label: 'Integration' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{stat.number}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Ready to find your next favorite?
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-8">
            Connect your AniList or MyAnimeList account and get personalized recommendations instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/integrations/anilist"
              className="px-6 py-3 rounded-xl bg-accent text-white font-medium
                         hover:bg-accent-hover transition-all shadow-lg shadow-accent/25"
            >
              Connect AniList
            </Link>
            <Link
              href="/integrations/myanimelist"
              className="px-6 py-3 rounded-xl bg-bg-card border border-border-secondary text-text-primary font-medium
                         hover:border-accent/50 transition-all"
            >
              Connect MyAnimeList
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
