import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Question } from './Question';

export function Quiz() {
  const { state, submitAnswer, resetQuiz } = useQuiz();
  const { currentQuestionIndex, questions, score } = state;

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} out of {questions.length}</p>
        <button className="reset-button" onClick={resetQuiz}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        <p>Score: {score}</p>
      </div>
      <Question
        question={questions[currentQuestionIndex]}
        onAnswer={submitAnswer}
      />
    </div>
  );
} 