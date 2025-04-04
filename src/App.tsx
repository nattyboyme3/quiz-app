import React, { useState, useEffect } from 'react';
import { QuizProvider } from './context/QuizContext';
import { Quiz } from './components/Quiz';
import './App.css';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <QuizProvider>
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IP Subnetting Quiz</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </header>
        <main>
          <Quiz />
        </main>
      </div>
    </QuizProvider>
  );
}
