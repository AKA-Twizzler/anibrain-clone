'use client';

import { useState } from 'react';
import type { MediaType, MediaFormat, CountryOfOrigin, RandomFilter } from '@/lib/types';

const FORMATS: MediaFormat[] = ['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT'];
const COUNTRIES: CountryOfOrigin[] = ['JP', 'CN', 'KR', 'US', 'FR', 'UK'];
const POPULAR_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance',
  'Sci-Fi', 'SliceOfLife', 'Sports', 'Supernatural', 'Thriller', 'Mystery',
  'Mecha', 'Music', 'Psychological', 'Historical', 'Isekai', 'Magic', 'School',
];

interface FilterSidebarProps {
  mediaType: MediaType;
  filters: Partial<RandomFilter>;
  onChange: (filters: Partial<RandomFilter>) => void;
  onClose?: () => void;
}

export default function FilterSidebar({ mediaType, filters, onChange, onClose }: FilterSidebarProps) {
  const [localExclude, setLocalExclude] = useState<string[]>(filters.genresExclude || []);

  const toggleFormat = (format: MediaFormat) => {
    const current = filters.formats || [];
    const next = current.includes(format)
      ? current.filter((f) => f !== format)
      : [...current, format];
    onChange({ ...filters, formats: next });
  };

  const toggleGenreInclude = (genre: string) => {
    const current = filters.genresInclude || [];
    const next = current.includes(genre)
      ? current.filter((g) => g !== genre)
      : [...current, genre];
    onChange({ ...filters, genresInclude: next });
  };

  const toggleGenreExclude = (genre: string) => {
    const current = localExclude.includes(genre)
      ? localExclude.filter((g) => g !== genre)
      : [...localExclude, genre];
    setLocalExclude(current);
    onChange({ ...filters, genresExclude: current });
  };

  const handleYearChange = (bound: 'min' | 'max', value: string) => {
    const num = value ? parseInt(value) : undefined;
    onChange({ ...filters, [bound === 'min' ? 'yearMin' : 'yearMax']: num });
  };

  const handleRatingChange = (value: string) => {
    const num = value ? parseInt(value) : undefined;
    onChange({ ...filters, ratingMin: num });
  };

  const handleCountryChange = (country: CountryOfOrigin) => {
    onChange({ ...filters, countryOfOrigin: filters.countryOfOrigin === country ? undefined : country });
  };

  const clearAll = () => {
    setLocalExclude([]);
    onChange({});
  };

  return (
    <div className="bg-bg-card border border-border-secondary rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Filters</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className="text-xs text-text-muted hover:text-accent transition-colors"
          >
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-text-muted hover:text-text-primary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Format */}
      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Format</h4>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((format) => (
            <button
              key={format}
              onClick={() => toggleFormat(format)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                ${(filters.formats || []).includes(format)
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg-secondary text-text-secondary border-border-secondary hover:border-accent/50'
                }`}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Release Year */}
      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Release Year
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="From"
            value={filters.yearMin || ''}
            onChange={(e) => handleYearChange('min', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-bg-input border border-border-primary
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          <span className="text-text-muted text-sm">to</span>
          <input
            type="number"
            placeholder="To"
            value={filters.yearMax || ''}
            onChange={(e) => handleYearChange('max', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-bg-input border border-border-primary
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>

      {/* Community Rating */}
      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Minimum Rating
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.ratingMin || 0}
            onChange={(e) => handleRatingChange(e.target.value)}
            className="w-full accent-accent"
          />
          <span className="text-sm font-medium text-text-primary w-8 text-right">
            {filters.ratingMin || 0}
          </span>
        </div>
      </div>

      {/* Country of Origin */}
      {mediaType === 'ANIME' && (
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Country of Origin
          </h4>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((country) => (
              <button
                key={country}
                onClick={() => handleCountryChange(country)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                  ${filters.countryOfOrigin === country
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-secondary text-text-secondary border-border-secondary hover:border-accent/50'
                  }`}
              >
                {country === 'JP' ? 'Japan' : country === 'CN' ? 'China' : country === 'KR' ? 'South Korea' : country === 'US' ? 'USA' : country === 'FR' ? 'France' : 'UK'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Include Genres */}
      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Include Genres
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenreInclude(genre)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-all
                ${(filters.genresInclude || []).includes(genre)
                  ? 'bg-green-500/20 text-green-500 border-green-500/40'
                  : 'bg-bg-secondary text-text-secondary border-border-secondary hover:border-accent/50'
                }`}
            >
              +{genre}
            </button>
          ))}
        </div>
      </div>

      {/* Exclude Genres */}
      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Exclude Genres
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenreExclude(genre)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-all
                {localExclude.includes(genre)
                  ? 'bg-red-500/20 text-red-500 border-red-500/40'
                  : 'bg-bg-secondary text-text-secondary border-border-secondary hover:border-accent/50'
                }`}
              title={`Exclude ${genre}`}
            >
              -{genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
