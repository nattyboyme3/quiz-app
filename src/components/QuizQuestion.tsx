import React from 'react';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: number) => void;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-medium text-gray-900 mb-12 text-center">
        {question.text}
      </h2>
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 border-gray-200 
                     hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 transition-all duration-200 bg-white shadow-sm"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
} 