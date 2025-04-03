import React from 'react';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: number) => void;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full p-3 text-left rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
} 