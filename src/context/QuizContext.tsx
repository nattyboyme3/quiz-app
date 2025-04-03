import React, { createContext, useContext, useReducer } from 'react';
import { QuizState, QuizContextType, Question } from '../types/quiz';

const initialQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1
  }
];

const initialState: QuizState = {
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  questions: initialQuestions,
};

type QuizAction =
  | { type: 'SUBMIT_ANSWER'; payload: number }
  | { type: 'RESET_QUIZ' };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SUBMIT_ANSWER':
      const isCorrect = state.questions[state.currentQuestionIndex].correctAnswer === action.payload;
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        score: isCorrect ? state.score + 1 : state.score,
        answers: [...state.answers, action.payload],
      };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const submitAnswer = (answer: number) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  return (
    <QuizContext.Provider value={{ state, submitAnswer, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
} 