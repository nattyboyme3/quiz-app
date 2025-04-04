import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { ProgressBar } from './ProgressBar';

export function Quiz() {
  const { state, submitAnswer, resetQuiz } = useQuiz();
  const isQuizComplete = state.currentQuestionIndex >= state.questions.length || state.isGameOver;

  if (isQuizComplete) {
    return (
      <QuizResults
        score={state.score}
        total={state.questions.length}
        strikes={state.strikes}
        isGameOver={state.isGameOver}
        onRetry={resetQuiz}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <ProgressBar
            current={state.currentQuestionIndex}
            total={state.questions.length}
          />
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-600">
              Question {state.currentQuestionIndex + 1} of {state.questions.length}
            </p>
            <p className="text-lg text-gray-600">
              Score: {state.score}
            </p>
            <p className="text-lg text-red-600">
              Strikes: {state.strikes}/3
            </p>
            <p className="text-sm text-gray-500">
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