import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-secondary bg-bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="font-semibold text-base">
                AniBrain<span className="text-accent">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              AI-powered anime, manga, light novel, and one shot recommendations.
              Discover your next favorite story.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Discover</h3>
            <ul className="space-y-2">
              <li><Link href="/recommender/anime" className="text-sm text-text-secondary hover:text-accent transition-colors">Anime</Link></li>
              <li><Link href="/recommender/manga" className="text-sm text-text-secondary hover:text-accent transition-colors">Manga</Link></li>
              <li><Link href="/random/anime" className="text-sm text-text-secondary hover:text-accent transition-colors">Random</Link></li>
              <li><Link href="/search" className="text-sm text-text-secondary hover:text-accent transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Integrations</h3>
            <ul className="space-y-2">
              <li><Link href="/integrations/anilist" className="text-sm text-text-secondary hover:text-accent transition-colors">AniList</Link></li>
              <li><Link href="/integrations/myanimelist" className="text-sm text-text-secondary hover:text-accent transition-colors">MyAnimeList</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-accent transition-colors">About</Link></li>
              <li><Link href="/privacy" className="text-sm text-text-secondary hover:text-accent transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-text-secondary hover:text-accent transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-secondary flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} AniBrain.ai. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Powered by AI &middot; Data from AniList &amp; MyAnimeList
          </p>
        </div>
      </div>
    </footer>
  );
}
