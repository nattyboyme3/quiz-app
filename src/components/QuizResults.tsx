import React from 'react';

interface QuizResultsProps {
  score: number;
  total: number;
  onRetry: () => void;
}

export function QuizResults({ score, total, onRetry }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl mb-4">
        Your score: {score} out of {total} ({percentage}%)
      </p>
      <div className="mb-6">
        {percentage >= 80 ? (
          <p className="text-green-600">Excellent! You've mastered IP subnetting!</p>
        ) : percentage >= 60 ? (
          <p className="text-blue-600">Good job! Keep practicing to improve!</p>
        ) : (
          <p className="text-orange-600">You might want to review IP subnetting concepts and try again.</p>
        )}
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
} 