import React from 'react';

interface QuizResultsProps {
  score: number;
  total: number;
  strikes: number;
  isGameOver: boolean;
  onRetry: () => void;
}

export function QuizResults({ score, total, strikes, isGameOver, onRetry }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">
        {isGameOver ? "Game Over!" : "Quiz Complete!"}
      </h2>
      <p className="text-xl mb-4">
        Your score: {score} points
      </p>
      {isGameOver && (
        <p className="text-red-600 mb-4">
          You got {strikes} strikes and were eliminated!
        </p>
      )}
      <div className="mb-6">
        {score >= 100 ? (
          <p className="text-green-600">Outstanding! You're a subnetting expert! 🌟</p>
        ) : score >= 75 ? (
          <p className="text-blue-600">Great job! You have a solid understanding of subnetting!</p>
        ) : score >= 50 ? (
          <p className="text-orange-600">Good effort! Keep practicing to improve your score!</p>
        ) : (
          <p className="text-red-600">Don't worry! Review the concepts and try again!</p>
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