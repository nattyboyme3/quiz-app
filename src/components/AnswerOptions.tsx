import React from 'react';

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showFeedback: boolean;
  onAnswerClick: (index: number) => void;
}

export function AnswerOptions({
  options,
  selectedAnswer,
  correctAnswer,
  showFeedback,
  onAnswerClick,
}: AnswerOptionsProps) {
  const base =
    'w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-colors duration-200 shadow-sm dark:shadow-gray-900/50 break-all';

  const getButtonClass = (index: number) => {
    if (!showFeedback) {
      return `${base} border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`;
    }
    if (index === correctAnswer) {
      return `${base} border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400`;
    }
    if (index === selectedAnswer) {
      return `${base} border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 focus:ring-red-500 dark:focus:ring-red-400`;
    }
    return `${base} border-gray-200 dark:border-gray-600 opacity-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500`;
  };

  return (
    <div
      role="radiogroup"
      aria-label="Answer options"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto"
    >
      {options.map((option, index) => (
        <button
          key={index}
          role="radio"
          aria-checked={selectedAnswer === index}
          aria-label={`Option ${index + 1}: ${option}`}
          onClick={() => !showFeedback && onAnswerClick(index)}
          disabled={showFeedback}
          className={getButtonClass(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
