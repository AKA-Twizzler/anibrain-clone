'use client';

interface SimilarityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function SimilarityBadge({ score, size = 'md' }: SimilarityBadgeProps) {
  const getColor = () => {
    if (score >= 80) return 'bg-green-500/15 text-green-500 border-green-500/30';
    if (score >= 60) return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    if (score >= 40) return 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30';
    if (score >= 20) return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
    return 'bg-red-500/15 text-red-500 border-red-500/30';
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${getColor()} ${sizeClasses[size]}`}
      title={`${score}% similarity`}
    >
      {score}%
    </span>
  );
}
