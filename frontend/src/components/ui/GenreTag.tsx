'use client';

interface GenreTagProps {
  genre: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  active?: boolean;
}

const genreColors: Record<string, string> = {
  Action: 'bg-red-500/15 text-red-500 border-red-500/30',
  Adventure: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  Comedy: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
  Drama: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  Fantasy: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30',
  Horror: 'bg-rose-700/15 text-rose-700 border-rose-700/30',
  Romance: 'bg-pink-500/15 text-pink-500 border-pink-500/30',
  'Sci-Fi': 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
  SliceOfLife: 'bg-teal-500/15 text-teal-500 border-teal-500/30',
  Sports: 'bg-lime-500/15 text-lime-500 border-lime-500/30',
  Supernatural: 'bg-violet-500/15 text-violet-500 border-violet-500/30',
  Thriller: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
  Mystery: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  Mecha: 'bg-stone-500/15 text-stone-500 border-stone-500/30',
  Music: 'bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/30',
  Seinen: 'bg-zinc-500/15 text-zinc-500 border-zinc-500/30',
  Shounen: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  Shoujo: 'bg-pink-400/15 text-pink-400 border-pink-400/30',
  Josei: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  Ecchi: 'bg-orange-600/15 text-orange-600 border-orange-600/30',
  Harem: 'bg-rose-600/15 text-rose-600 border-rose-600/30',
  Isekai: 'bg-blue-600/15 text-blue-600 border-blue-600/30',
  Psychological: 'bg-gray-500/15 text-gray-500 border-gray-500/30',
  Historical: 'bg-amber-700/15 text-amber-700 border-amber-700/30',
  Magic: 'bg-violet-400/15 text-violet-400 border-violet-400/30',
  Military: 'bg-green-700/15 text-green-700 border-green-700/30',
  Parody: 'bg-yellow-600/15 text-yellow-600 border-yellow-600/30',
  Samurai: 'bg-red-700/15 text-red-700 border-red-700/30',
  Space: 'bg-indigo-700/15 text-indigo-700 border-indigo-700/30',
  SuperPower: 'bg-cyan-600/15 text-cyan-600 border-cyan-600/30',
  Vampire: 'bg-purple-700/15 text-purple-700 border-purple-700/30',
  Yaoi: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
  Yuri: 'bg-pink-500/15 text-pink-500 border-pink-500/30',
  Dementia: 'bg-slate-500/15 text-slate-500 border-slate-500/30',
  Demons: 'bg-red-800/15 text-red-800 border-red-800/30',
  Game: 'bg-emerald-600/15 text-emerald-600 border-emerald-600/30',
  Kids: 'bg-sky-400/15 text-sky-400 border-sky-400/30',
  Police: 'bg-blue-700/15 text-blue-700 border-blue-700/30',
  School: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
};

export default function GenreTag({ genre, size = 'md', onClick, active }: GenreTagProps) {
  const colorClass = genreColors[genre] || 'bg-accent/15 text-accent border-accent/30';
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  const activeClass = active ? 'ring-2 ring-accent/50' : '';

  const baseClasses = `inline-flex items-center font-medium rounded-full border ${colorClass} ${sizeClasses} ${activeClass}`;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} cursor-pointer hover:opacity-80 transition-opacity`}
      >
        {genre}
      </button>
    );
  }

  return <span className={baseClasses}>{genre}</span>;
}
