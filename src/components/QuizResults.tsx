import React from 'react';

interface QuizResultsProps {
  score: number;
  total: number;
  strikes: number;
  isGameOver: boolean;
  onRetry: () => void;
}

export function QuizResults({ score, total, strikes, isGameOver, onRetry }: QuizResultsProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Game Over!</h2>
          <div className="space-y-4">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Final Score: <span className="font-semibold">{score}</span> points
            </p>
            <p className="text-lg text-red-600 dark:text-red-400">
              You got {strikes} strikes and were eliminated!
            </p>
            <div className="mt-6">
              {score >= 100 ? (
                <p className="text-green-600 dark:text-green-400 text-lg">Outstanding! You're a subnetting expert! 🌟</p>
              ) : score >= 75 ? (
                <p className="text-blue-600 dark:text-blue-400 text-lg">Great job! You have a solid understanding of subnetting!</p>
              ) : score >= 50 ? (
                <p className="text-orange-600 dark:text-orange-400 text-lg">Good effort! Keep practicing to improve your score!</p>
              ) : (
                <p className="text-red-600 dark:text-red-400 text-lg">Don't worry! Review the concepts and try again!</p>
              )}
            </div>
            <button
              onClick={onRetry}
              className="mt-8 px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 