import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';

export function Quiz() {
  const { state, submitAnswer, resetQuiz } = useQuiz();
  const isGameOver = state.strikes >= 3;

  if (isGameOver) {
    return (
      <QuizResults
        score={state.score}
        total={state.questions.length}
        strikes={state.strikes}
        isGameOver={true}
        onRetry={resetQuiz}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Score: {state.score}
            </p>
            <p className="text-lg text-red-600 dark:text-red-400">
              Strikes: {state.strikes}/3
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current question worth: {state.questions[state.currentQuestionIndex].points} points
            </p>
          </div>
        </div>
        <QuizQuestion
          question={state.questions[state.currentQuestionIndex]}
          onAnswer={submitAnswer}
        />
      </div>
    </div>
  );
} 