import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/ThemeContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'AniBrain.ai - AI-Powered Anime & Manga Recommendations',
  description:
    'Discover your next favorite anime, manga, light novel, or one shot with AI-powered recommendations. Get personalized suggestions based on what you love.',
  keywords: ['anime', 'manga', 'recommendations', 'AI', 'anilist', 'myanimelist'],
  openGraph: {
    title: 'AniBrain.ai - AI-Powered Anime & Manga Recommendations',
    description: 'Discover your next favorite anime, manga, light novel, or one shot with AI-powered recommendations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
