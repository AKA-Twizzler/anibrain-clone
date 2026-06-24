'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProfile } from '@/lib/api';
import { ProfileHeaderSkeleton } from '@/components/ui/SkeletonLoader';
import { useState } from 'react';

type Tab = 'about' | 'created' | 'saved';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { data: user, error, isLoading } = useProfile(username);
  const [activeTab, setActiveTab] = useState<Tab>('about');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProfileHeaderSkeleton />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-error text-lg font-medium mb-2">User not found</p>
        <p className="text-text-muted text-sm mb-6">The user &ldquo;{username}&rdquo; does not exist</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'created', label: 'Created' },
    { key: 'saved', label: 'Saved' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="bg-bg-card rounded-2xl border border-border-secondary p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-accent">
              {(user.username || 'U')[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">{user.username}</h1>
            <p className="text-text-muted text-sm">
              Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
            </p>
            {user.bio && (
              <p className="text-text-secondary mt-3 max-w-lg">{user.bio}</p>
            )}
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium
                           hover:bg-accent-hover transition-colors self-center md:self-start">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-card rounded-xl border border-border-secondary p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-bg-card rounded-2xl border border-border-secondary p-6 md:p-8">
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Bio</h3>
              <p className="text-text-secondary">
                {user.bio || 'No bio yet.'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-bg-secondary">
                  <div className="text-2xl font-bold text-accent">{user.collections?.length || 0}</div>
                  <div className="text-xs text-text-muted mt-1">Collections</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-bg-secondary">
                  <div className="text-2xl font-bold text-accent">{user.savedMedia?.length || 0}</div>
                  <div className="text-xs text-text-muted mt-1">Saved</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-bg-secondary">
                  <div className="text-2xl font-bold text-accent">-</div>
                  <div className="text-xs text-text-muted mt-1">Reviews</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'created' && (
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Collections</h3>
            {user.collections && user.collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.collections.map((collection: any) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.id}`}
                    className="p-4 rounded-xl bg-bg-secondary border border-border-secondary
                               hover:border-accent/50 transition-all card-hover"
                  >
                    <h4 className="font-medium text-text-primary mb-1">{collection.name}</h4>
                    {collection.description && (
                      <p className="text-sm text-text-muted line-clamp-2">{collection.description}</p>
                    )}
                    <p className="text-xs text-text-muted mt-2">
                      {collection.mediaIds?.length || 0} items
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted">No collections yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Saved Media</h3>
            {user.savedMedia && user.savedMedia.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {user.savedMedia.map((mediaId: string) => (
                  <div key={mediaId} className="aspect-[3/4] bg-bg-secondary rounded-xl flex items-center justify-center">
                    <span className="text-xs text-text-muted">{mediaId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted">No saved media yet</p>
                <Link
                  href="/recommender/anime"
                  className="inline-block mt-3 text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  Discover anime →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
