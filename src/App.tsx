import { QuizProvider } from './context/QuizContext';
import { Quiz } from './components/Quiz';
import './App.css';

function App() {
  return (
    <QuizProvider>
      <div className="app">
        <h1>Quiz App</h1>
        <Quiz />
      </div>
    </QuizProvider>
  );
}

export default App;
