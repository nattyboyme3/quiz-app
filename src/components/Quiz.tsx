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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          IP Subnetting Quiz
        </h1>
        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">
            Question {state.currentQuestionIndex + 1} of {state.questions.length}
          </p>
          <p className="text-lg text-gray-600">
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