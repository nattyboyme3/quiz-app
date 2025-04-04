import React, { useState, useRef } from 'react';
import { Question } from '../types/quiz';
import { AnswerOptions } from './AnswerOptions';
import { AnswerFeedback, QuestionExplanation } from '../utils/questionExplanations';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: number) => void;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const timeoutRef = useRef<number>();

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === question.correctAnswer;
    
    // Only auto-advance on correct answers
    if (isCorrect) {
      timeoutRef.current = window.setTimeout(() => {
        moveToNextQuestion(index);
      }, 1500);
    }
  };

  const moveToNextQuestion = (index: number) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setShowFeedback(false);
    setSelectedAnswer(null);
    onAnswer(index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-medium text-gray-900 mb-8 text-center">
        {question.text}
      </h2>
      <AnswerOptions
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={question.correctAnswer}
        showFeedback={showFeedback}
        onAnswerClick={handleAnswerClick}
      />
      {showFeedback && (
        <div className="mt-8 text-center">
          <AnswerFeedback
            isCorrect={selectedAnswer === question.correctAnswer}
            correctAnswer={question.options[question.correctAnswer]}
          />
          {selectedAnswer !== question.correctAnswer && (
            <QuestionExplanation questionType={question.questionType} />
          )}
          <button
            onClick={() => selectedAnswer !== null && moveToNextQuestion(selectedAnswer)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
} 