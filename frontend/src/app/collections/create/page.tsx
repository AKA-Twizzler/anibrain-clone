'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, useSearch } from '@/lib/api';
import GenreTag from '@/components/ui/GenreTag';

export default function CreateCollectionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    const timer = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timer);
  };

  const { data: searchResults } = useSearch(debouncedSearch, 10);

  const addMedia = (media: any) => {
    if (!selectedMedia.find((m) => m.id === media.id)) {
      setSelectedMedia([...selectedMedia, media]);
    }
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const removeMedia = (mediaId: string) => {
    setSelectedMedia(selectedMedia.filter((m) => m.id !== mediaId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Collection name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const collection = await api.createCollection({
        name: name.trim(),
        description: description.trim(),
        mediaIds: selectedMedia.map((m) => m.id),
        isPublic: true,
      });
      router.push(`/collections/${collection.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create collection');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Create Collection</h1>
      <p className="text-text-muted mb-8">Curate your favorite anime and manga into a collection.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name & Description */}
        <div className="bg-bg-card rounded-2xl border border-border-secondary p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
              Collection Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Collection"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                         text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-text-secondary mb-1.5">
              Description (optional)
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this collection about?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                         text-text-primary placeholder:text-text-muted resize-none
                         focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
        </div>

        {/* Media Search & Selection */}
        <div className="bg-bg-card rounded-2xl border border-border-secondary p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Add Media</h2>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search anime or manga..."
              className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                         text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />

            {/* Search Results Dropdown */}
            {debouncedSearch && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-secondary
                              rounded-xl shadow-xl overflow-hidden z-10 max-h-60 overflow-y-auto">
                {searchResults.anime?.slice(0, 5).map((result: any) => (
                  <button
                    key={result.media.id}
                    type="button"
                    onClick={() => addMedia(result.media)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-secondary transition-colors text-left"
                  >
                    <img
                      src={result.media.coverImage}
                      alt={result.media.title?.romaji}
                      className="w-8 h-11 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {result.media.title?.english || result.media.title?.romaji}
                      </p>
                      <p className="text-xs text-text-muted">Anime</p>
                    </div>
                  </button>
                ))}
                {searchResults.manga?.slice(0, 5).map((result: any) => (
                  <button
                    key={result.media.id}
                    type="button"
                    onClick={() => addMedia(result.media)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-secondary transition-colors text-left"
                  >
                    <img
                      src={result.media.coverImage}
                      alt={result.media.title?.romaji}
                      className="w-8 h-11 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {result.media.title?.english || result.media.title?.romaji}
                      </p>
                      <p className="text-xs text-text-muted">Manga</p>
                    </div>
                  </button>
                ))}
                {(!searchResults.anime?.length && !searchResults.manga?.length) && (
                  <div className="p-4 text-center text-sm text-text-muted">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* Selected Media */}
          {selectedMedia.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-text-muted">{selectedMedia.length} item(s) selected</p>
              <div className="flex flex-wrap gap-2">
                {selectedMedia.map((media) => (
                  <div
                    key={media.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-secondary"
                  >
                    <span className="text-sm text-text-primary truncate max-w-[120px]">
                      {media.title?.english || media.title?.romaji || 'Unknown'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMedia(media.id)}
                      className="text-text-muted hover:text-error transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="px-8 py-3 rounded-xl bg-accent text-white font-medium
                       hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Creating...' : 'Create Collection'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-xl bg-bg-card border border-border-secondary text-text-primary font-medium
                       hover:border-accent/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
