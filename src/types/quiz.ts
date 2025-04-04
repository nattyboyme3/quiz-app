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