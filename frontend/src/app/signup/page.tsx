'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await api.signup({ email, username, password });
      localStorage.setItem('anibrain-token', res.token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-2xl border border-border-secondary p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Create an account</h1>
            <p className="text-text-muted text-sm mt-1">Join AniBrain and discover new favorites</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                           text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                           transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                           text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                           transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                           text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                           transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border-primary
                           text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                           transition-all duration-200"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white font-medium
                         hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
