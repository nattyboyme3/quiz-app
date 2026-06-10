import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { ProgressBar } from './ProgressBar';

export function Quiz() {
  const { state, submitAnswer, resetQuiz } = useQuiz();

  if (state.isGameOver) {
    return (
      <QuizResults
        score={state.score}
        total={state.questions.length}
        questionsAnswered={state.answers.length}
        strikes={state.strikes}
        onRetry={resetQuiz}
      />
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <ProgressBar
          current={state.currentQuestionIndex}
          total={state.questions.length}
        />

        <div className="flex items-start justify-between mb-10">
          {/* Left: position context */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 tabular-nums mb-3">
              Question {state.currentQuestionIndex + 1}
              <span className="text-gray-400 dark:text-gray-600"> of {state.questions.length}</span>
            </p>
            <div
              className="flex items-center gap-2"
              aria-label={`${state.strikes} of 3 strikes used`}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`text-base font-bold transition-colors ${
                    i < state.strikes
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-200 dark:text-gray-700'
                  }`}
                >
                  ✕
                </span>
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                {3 - state.strikes} left
              </span>
            </div>
          </div>

          {/* Right: score */}
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1">
              Score
            </p>
            <p className="text-3xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-white leading-none">
              {state.score}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
              {state.questions[state.currentQuestionIndex].points} pts this question
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
