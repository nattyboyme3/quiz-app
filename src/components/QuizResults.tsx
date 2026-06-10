import React from 'react';

interface QuizResultsProps {
  score: number;
  total: number;
  questionsAnswered: number;
  strikes: number;
  onRetry: () => void;
}

const TIERS = [
  { min: 100, label: 'Expert',   bg: 'bg-emerald-50 dark:bg-emerald-950/50', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/60' },
  { min: 75,  label: 'Solid',    bg: 'bg-blue-50 dark:bg-blue-950/50',       text: 'text-blue-700 dark:text-blue-400',       border: 'border-blue-200 dark:border-blue-800/60' },
  { min: 50,  label: 'Learning', bg: 'bg-amber-50 dark:bg-amber-950/50',     text: 'text-amber-700 dark:text-amber-400',     border: 'border-amber-200 dark:border-amber-800/60' },
  { min: 0,   label: 'Review',   bg: 'bg-red-50 dark:bg-red-950/50',         text: 'text-red-700 dark:text-red-400',         border: 'border-red-200 dark:border-red-800/60' },
];

export function QuizResults({ score, total, questionsAnswered, strikes, onRetry }: QuizResultsProps) {
  const tier = TIERS.find(t => score >= t.min)!;

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-lg mx-auto px-4 text-center">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-10">
          Quiz Complete
        </p>

        <div className="flex justify-center mb-8">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${tier.bg} ${tier.text} ${tier.border}`}>
            {tier.label}
          </span>
        </div>

        <div className="mb-3 leading-none">
          <span className="text-[5.5rem] sm:text-[7.5rem] font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">
            {score}
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 mb-14">
          points
        </p>

        <div className="w-12 h-px bg-gray-200 dark:bg-gray-700 mx-auto mb-8" />

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-10 tabular-nums">
          {questionsAnswered} of {total} questions&ensp;·&ensp;{strikes} strike{strikes !== 1 ? 's' : ''}
        </p>

        <button
          onClick={onRetry}
          className="px-8 py-3 min-h-[44px] bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          Try Again
        </button>

      </div>
    </div>
  );
}
