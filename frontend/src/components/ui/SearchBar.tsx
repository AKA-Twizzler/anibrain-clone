'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearch } from '@/lib/api';
import Link from 'next/link';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  large?: boolean;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Search anime, manga, light novels...',
  onSearch,
  autoFocus = false,
  large = false,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useSearch(debouncedQuery, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const hasResults = data && (data.anime?.length > 0 || data.manga?.length > 0 || data.characters?.length > 0);

  const inputClasses = large
    ? 'w-full px-6 py-4 text-lg rounded-2xl'
    : 'w-full px-4 py-2.5 text-sm rounded-xl';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`${inputClasses} bg-bg-input border border-border-primary
                         text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                         transition-all duration-200`}
          />
          {/* Search Icon */}
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                       text-text-muted hover:text-accent transition-colors"
          >
            <svg className={large ? 'w-6 h-6' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Autosuggest Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-secondary
                        rounded-xl shadow-xl overflow-hidden z-50">
          {isLoading && (
            <div className="p-4 text-center text-sm text-text-muted">Searching...</div>
          )}

          {!isLoading && hasResults && (
            <div className="max-h-80 overflow-y-auto">
              {/* Anime Results */}
              {data.anime?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider bg-bg-secondary">
                    Anime
                  </div>
                  {data.anime.slice(0, 3).map((result: any) => (
                    <Link
                      key={result.media.id}
                      href={`/recommender/anime/${result.media.anilistId}`}
                      onClick={() => { setQuery(''); setIsOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-secondary transition-colors"
                    >
                      <img
                        src={result.media.coverImage}
                        alt={result.media.title?.romaji}
                        className="w-8 h-11 rounded object-cover bg-bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {result.media.title?.english || result.media.title?.romaji}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {result.media.genres?.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Manga Results */}
              {data.manga?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider bg-bg-secondary">
                    Manga
                  </div>
                  {data.manga.slice(0, 3).map((result: any) => (
                    <Link
                      key={result.media.id}
                      href={`/recommender/manga/${result.media.anilistId}`}
                      onClick={() => { setQuery(''); setIsOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-secondary transition-colors"
                    >
                      <img
                        src={result.media.coverImage}
                        alt={result.media.title?.romaji}
                        className="w-8 h-11 rounded object-cover bg-bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {result.media.title?.english || result.media.title?.romaji}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {result.media.genres?.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* View All */}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => { setQuery(''); setIsOpen(false); }}
                className="block px-4 py-3 text-center text-sm font-medium text-accent
                           hover:bg-bg-secondary border-t border-border-secondary transition-colors"
              >
                View all results
              </Link>
            </div>
          )}

          {!isLoading && query.length >= 2 && !hasResults && (
            <div className="p-4 text-center text-sm text-text-muted">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
