'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useCollection, api, useSearch } from '@/lib/api';

export default function RemixCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: original, isLoading } = useCollection(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: searchResults } = useSearch(debouncedSearch, 8);

  // Initialize with original collection media
  if (original && selectedMedia.length === 0 && !name) {
    setName(`${original.name} (Remix)`);
    setSelectedMedia(original.mediaIds || []);
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setTimeout(() => setDebouncedSearch(value), 300);
  };

  const toggleMedia = (mediaId: string) => {
    setSelectedMedia((prev) =>
      prev.includes(mediaId)
        ? prev.filter((id) => id !== mediaId)
        : [...prev, mediaId]
    );
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
        mediaIds: selectedMedia,
        isPublic: true,
      });
      router.push(`/collections/${collection.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create remix');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-bg-card rounded-2xl border border-border-secondary p-8 animate-pulse space-y-4">
          <div className="h-8 bg-bg-secondary rounded w-64" />
          <div className="h-24 bg-bg-secondary rounded" />
        </div>
      </div>
    );
  }

  if (!original) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-error text-lg font-medium mb-2">Original collection not found</p>
        <Link href="/" className="mt-4 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Remix Collection</h1>
        <p className="text-text-muted">
          Forking &ldquo;{original.name}&rdquo; — modify and create your own version
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
              required
              className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                         text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                         text-text-primary placeholder:text-text-muted resize-none
                         focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
        </div>

        <div className="bg-bg-card rounded-2xl border border-border-secondary p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Select Media</h2>
          <p className="text-sm text-text-muted mb-4">Toggle items to include in your remix</p>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search to add more..."
            className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                       text-text-primary placeholder:text-text-muted mb-4
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          {/* Original media items */}
          {original.media && original.media.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Original Collection Items
              </p>
              {original.media.map((media: any) => {
                const isSelected = selectedMedia.includes(media.id);
                return (
                  <label
                    key={media.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                      ${isSelected
                        ? 'bg-accent/5 border-accent/30'
                        : 'bg-bg-secondary border-border-secondary hover:border-accent/30'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMedia(media.id)}
                      className="w-4 h-4 rounded accent-accent"
                    />
                    <img
                      src={media.coverImage}
                      alt={media.title?.romaji}
                      className="w-8 h-11 rounded object-cover"
                    />
                    <span className="text-sm text-text-primary">
                      {media.title?.english || media.title?.romaji}
                    </span>
                  </label>
                );
              })}
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
            {saving ? 'Creating Remix...' : 'Create Remix'}
          </button>
          <Link
            href={`/collections/${id}`}
            className="px-8 py-3 rounded-xl bg-bg-card border border-border-secondary text-text-primary font-medium
                       hover:border-accent/50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
