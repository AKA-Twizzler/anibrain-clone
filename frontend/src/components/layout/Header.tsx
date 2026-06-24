'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/recommender/anime', label: 'Recommender' },
  { href: '/random/anime', label: 'Random' },
  { href: '/integrations/anilist', label: 'Integrations' },
  { href: '/search', label: 'Search' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-header backdrop-blur-md border-b border-border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:bg-accent-hover transition-colors">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg text-text-primary hidden sm:block">
              AniBrain<span className="text-accent">.ai</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary 
                           hover:text-text-primary hover:bg-bg-secondary transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                         bg-accent text-white hover:bg-accent-hover transition-all duration-200"
            >
              Sign In
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg
                         bg-bg-secondary border border-border-secondary text-text-secondary"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-secondary bg-bg-card">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-text-secondary 
                           hover:text-text-primary hover:bg-bg-secondary transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-center
                         bg-accent text-white mt-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
