import React from 'react';
import { QuizProvider } from './context/QuizContext';
import { Quiz } from './components/Quiz';
import './App.css';

export function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <h1 className="text-2xl font-bold text-gray-900">IP Subnetting Quiz</h1>
          </div>
        </header>
        <main>
          <Quiz />
        </main>
      </div>
    </QuizProvider>
  );
}
