import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';

export function Quiz() {
  const { state, submitAnswer, resetQuiz } = useQuiz();
  const isQuizComplete = state.currentQuestionIndex >= state.questions.length;

  if (isQuizComplete) {
    return (
      <QuizResults
        score={state.score}
        total={state.questions.length}
        onRetry={resetQuiz}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Question {state.currentQuestionIndex + 1} of {state.questions.length}
          </p>
          <p className="text-gray-600">
            Score: {state.score}
          </p>
        </div>
        <QuizQuestion
          question={state.questions[state.currentQuestionIndex]}
          onAnswer={submitAnswer}
        />
      </div>
    </div>
  );
} 