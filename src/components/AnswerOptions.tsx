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
  onAnswerClick 
}: AnswerOptionsProps) {
  const getButtonClass = (index: number) => {
    if (!showFeedback || selectedAnswer !== index) {
      return "w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50 text-gray-900 dark:text-gray-100";
    }
    
    return selectedAnswer === correctAnswer
      ? "w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-sm dark:shadow-gray-900/50"
      : "w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-sm dark:shadow-gray-900/50";
  };

  return (
    <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
      {options.map((option, index) => (
        <button
          key={index}
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