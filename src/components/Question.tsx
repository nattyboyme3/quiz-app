import React from 'react';
import { Question as QuestionType } from '../types/quiz';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: number) => void;
}

export function Question({ question, onAnswer }: QuestionProps) {
  return (
    <div className="question-container">
      <h2 className="question-text">{question.text}</h2>
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => onAnswer(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
} 