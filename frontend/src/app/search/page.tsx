'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import MediaCard from '@/components/ui/MediaCard';
import { useSearch } from '@/lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState(initialType);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, error, isLoading } = useSearch(debouncedQuery, 20);

  const handleSearch = (q: string) => {
    setQuery(q);
    setDebouncedQuery(q);
    const params = new URLSearchParams();
    params.set('q', q);
    if (activeType !== 'all') params.set('type', activeType);
    router.replace(`/search?${params.toString()}`);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
  };

  const filteredAnime = data?.anime || [];
  const filteredManga = data?.manga || [];
  const totalResults = filteredAnime.length + filteredManga.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Search</h1>
        <SearchBar
          placeholder="Search anime, manga, light novels..."
          onSearch={handleSearch}
        />
      </div>

      {query && (
        <div className="mb-4">
          <p className="text-sm text-text-muted">
            {isLoading ? 'Searching...' : `Found ${totalResults} results for "${query}"`}
          </p>
        </div>
      )}

      {/* Results */}
      {isLoading && (
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

      {error && (
        <div className="text-center py-16">
          <p className="text-error text-lg font-medium mb-2">Search failed</p>
          <p className="text-text-muted text-sm">Please try a different query</p>
        </div>
      )}

      {!isLoading && !error && query && totalResults === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg mb-2">No results found</p>
          <p className="text-text-muted text-sm">Try different search terms</p>
        </div>
      )}

      {!isLoading && !error && totalResults > 0 && (
        <div className="space-y-10">
          {/* Anime Results */}
          {filteredAnime.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                Anime
                <span className="text-sm font-normal text-text-muted">({filteredAnime.length})</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAnime.map((result: any) => (
                  <MediaCard
                    key={result.media.id}
                    media={result.media}
                    similarityScore={result.score}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Manga Results */}
          {filteredManga.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                Manga
                <span className="text-sm font-normal text-text-muted">({filteredManga.length})</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredManga.map((result: any) => (
                  <MediaCard
                    key={result.media.id}
                    media={result.media}
                    similarityScore={result.score}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {!query && !isLoading && (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg">Search for anime, manga, light novels, and more</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-12 bg-bg-secondary rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-bg-card rounded-xl border border-border-secondary overflow-hidden">
              <div className="aspect-[3/4] bg-bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
