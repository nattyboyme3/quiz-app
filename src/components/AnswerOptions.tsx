import React from 'react';

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showFeedback: boolean;
  onAnswerClick: (index: number) => void;
}

export function AnswerOptions({ 
  options, 
  selectedAnswer, 
  correctAnswer, 
  showFeedback, 
  onAnswerClick 
}: AnswerOptionsProps) {
  const getButtonClass = (index: number) => {
    if (!showFeedback || selectedAnswer !== index) {
      return "w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 bg-white shadow-sm";
    }
    
    return selectedAnswer === correctAnswer
      ? "w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 border-green-500 bg-green-50 text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
      : "w-full py-4 px-4 text-center text-lg font-medium rounded-xl border-2 border-red-500 bg-red-50 text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm";
  };

  return (
    <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !showFeedback && onAnswerClick(index)}
          disabled={showFeedback}
          className={getButtonClass(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
} 