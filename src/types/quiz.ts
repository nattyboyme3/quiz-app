export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  questions: Question[];
}

export interface QuizContextType {
  state: QuizState;
  submitAnswer: (answer: number) => void;
  resetQuiz: () => void;
} 