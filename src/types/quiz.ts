export type QuestionType = 
  | 'usableHosts'
  | 'hostRange'
  | 'subnetMask'
  | 'cidrNotation'
  | 'ipContainment'
  | 'broadcastAddress'
  | 'networkAddress';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  questionType: QuestionType;
  points: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  strikes: number;
  answers: number[];
  questions: Question[];
  isGameOver: boolean;
}

export interface QuizContextType {
  state: QuizState;
  submitAnswer: (answer: number) => void;
  resetQuiz: () => void;
} 