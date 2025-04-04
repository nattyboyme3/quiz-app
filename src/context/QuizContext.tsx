import React, { createContext, useContext, useReducer } from 'react';
import { QuizState, QuizContextType, Question } from '../types/quiz';
import { generateSubnettingQuestions } from '../utils/subnettingQuestions';
import { QUESTION_POINTS } from '../utils/questionExplanations';

const MAX_STRIKES = 3;

const initialState: QuizState = {
  currentQuestionIndex: 0,
  score: 0,
  strikes: 0,
  answers: [],
  questions: generateSubnettingQuestions(10).map(question => ({
    ...question,
    points: QUESTION_POINTS[question.questionType]
  })),
  isGameOver: false,
};

type QuizAction =
  | { type: 'SUBMIT_ANSWER'; payload: number }
  | { type: 'RESET_QUIZ' };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SUBMIT_ANSWER': {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = currentQuestion.correctAnswer === action.payload;
      const newStrikes = isCorrect ? state.strikes : state.strikes + 1;
      const isGameOver = newStrikes >= MAX_STRIKES;

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        score: isCorrect ? state.score + currentQuestion.points : state.score,
        strikes: newStrikes,
        answers: [...state.answers, action.payload],
        isGameOver,
      };
    }
    case 'RESET_QUIZ':
      return {
        ...initialState,
        questions: generateSubnettingQuestions(10).map(question => ({
          ...question,
          points: QUESTION_POINTS[question.questionType]
        })),
      };
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