'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCollection } from '@/lib/api';
import MediaCard from '@/components/ui/MediaCard';
import VoteButtons from '@/components/ui/VoteButtons';

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: collection, error, isLoading } = useCollection(id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-bg-card rounded-2xl border border-border-secondary p-8 animate-pulse">
          <div className="h-8 bg-bg-secondary rounded w-64 mb-4" />
          <div className="h-4 bg-bg-secondary rounded w-96 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-bg-secondary rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-error text-lg font-medium mb-2">Collection not found</p>
        <p className="text-text-muted text-sm mb-6">This collection may have been removed or is private</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-bg-card rounded-2xl border border-border-secondary p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">{collection.name}</h1>
            {collection.description && (
              <p className="text-text-secondary">{collection.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
              <span>{collection.mediaIds?.length || 0} items</span>
              {collection.username && (
                <span>by {collection.username}</span>
              )}
              <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <VoteButtons upvotes={collection.upvotes || 0} downvotes={collection.downvotes || 0} />
            <Link
              href={`/collections/${id}/remix`}
              className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium
                         hover:bg-accent-hover transition-colors"
            >
              Remix
            </Link>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {collection.media && collection.media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {collection.media.map((media: any) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-bg-card rounded-2xl border border-border-secondary">
          <p className="text-text-muted mb-4">This collection is empty</p>
          <Link
            href="/collections/create"
            className="text-accent hover:text-accent-hover font-medium transition-colors"
          >
            Create a new collection →
          </Link>
        </div>
      )}
    </div>
  );
}
