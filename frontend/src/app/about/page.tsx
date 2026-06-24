'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
          <span className="text-3xl font-bold text-accent">A</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          About <span className="text-accent">AniBrain</span>.ai
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          AniBrain uses advanced AI to help you discover anime, manga, light novels, and one shots
          that match your unique taste.
        </p>
      </div>

      {/* Background */}
      <section className="bg-bg-card rounded-2xl border border-border-secondary p-8 mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">Background</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          AniBrain was built to solve a simple problem: with thousands of anime and manga series
          available, finding your next favorite can be overwhelming. Traditional recommendation
          systems often fall short, relying on simple tag matching or popularity metrics.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Our AI-powered engine analyzes the content, themes, visual style, narrative structure,
          and community ratings of titles you love to find truly similar recommendations you
          might have never discovered otherwise.
        </p>
      </section>

      {/* Goals */}
      <section className="bg-bg-card rounded-2xl border border-border-secondary p-8 mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">Our Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-bg-secondary">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Better Discovery</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Help fans discover hidden gems and lesser-known titles that match their specific taste.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-bg-secondary">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Cross-Category</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Bridge the gap between anime, manga, light novels, and one shots. Find manga
              adaptations of your favorite anime and vice versa.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-bg-secondary">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Smart Filters</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Fine-tune recommendations with intelligent filters including genre include/exclude,
              year range, rating thresholds, and more.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-bg-secondary">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Platform Integration</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Seamlessly connect with AniList and MyAnimeList to get recommendations
              based on your existing lists.
            </p>
          </div>
        </div>
      </section>

      {/* Thank You */}
      <section className="bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-accent/20 p-8 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Thank You</h2>
        <p className="text-text-secondary max-w-lg mx-auto leading-relaxed mb-6">
          AniBrain is built with love for the anime and manga community. Special thanks to
          AniList and MyAnimeList for providing the data that powers our recommendations.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://anilist.co"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            AniList
          </a>
          <a
            href="https://myanimelist.net"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 text-sm font-medium hover:bg-orange-500/20 transition-colors"
          >
            MyAnimeList
          </a>
        </div>
      </section>
    </div>
  );
}
