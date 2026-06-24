'use client';

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
  size?: 'sm' | 'md';
}

export default function VoteButtons({
  upvotes,
  downvotes,
  onUpvote,
  onDownvote,
  size = 'md',
}: VoteButtonsProps) {
  const total = upvotes + downvotes;
  const score = total > 0 ? Math.round(((upvotes - downvotes) / total) * 100) : 0;

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onUpvote}
        className={`flex items-center justify-center rounded-lg 
                     hover:bg-accent/10 text-text-muted hover:text-accent 
                     transition-all duration-200 ${iconSize === 'w-5 h-5' ? 'p-1.5' : 'p-1'}`}
        title="Upvote"
      >
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <span className={`font-semibold ${textSize} ${
        score > 0 ? 'text-accent' : score < 0 ? 'text-error' : 'text-text-muted'
      }`}>
        {score > 0 ? '+' : ''}{score}
      </span>

      <button
        onClick={onDownvote}
        className={`flex items-center justify-center rounded-lg
                     hover:bg-error/10 text-text-muted hover:text-error
                     transition-all duration-200 ${iconSize === 'w-5 h-5' ? 'p-1.5' : 'p-1'}`}
        title="Downvote"
      >
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
