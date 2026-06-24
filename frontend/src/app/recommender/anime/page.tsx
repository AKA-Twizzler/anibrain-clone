'use client';

import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import GenreTag from '@/components/ui/GenreTag';

const popularAnime = [
  'Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto', 'Jujutsu Kaisen',
  'Chainsaw Man', 'Spy x Family', 'Fullmetal Alchemist', 'Death Note', 'Cowboy Bebop',
];

export default function AnimeRecommenderPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    window.location.href = `/search?q=${encodeURIComponent(query)}&type=anime`;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section with Background */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://s4.anilist.co/file/anilistcdn/media/anime/banner/n21.jpg)`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-bg-primary/70 to-bg-primary" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-accent">AI Anime Recommender</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Find Your Next <span className="text-accent">Anime</span>
          </h1>
          <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
            Search for an anime you love and discover similar titles powered by AI.
          </p>

          <SearchBar
            placeholder="Search anime..."
            onSearch={handleSearch}
            large
          />

          {/* Popular Suggestions */}
          <div className="mt-8">
            <p className="text-xs text-text-muted mb-3">Popular searches</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularAnime.map((title) => (
                <button
                  key={title}
                  onClick={() => handleSearch(title)}
                  className="px-3 py-1.5 text-xs rounded-full bg-bg-card/80 border border-border-secondary
                             text-text-secondary hover:text-accent hover:border-accent/50 transition-all
                             backdrop-blur-sm"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
