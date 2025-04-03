import { generateSubnettingQuestions } from './utils/subnettingQuestions.ts';

// Generate 5 questions
const questions = generateSubnettingQuestions(5);

// Display each question
questions.forEach((question, index) => {
  console.log(`\nQuestion ${index + 1}:`);
  console.log(question.text);
  console.log('\nOptions:');
  question.options.forEach((option, optIndex) => {
    console.log(`${optIndex + 1}. ${option}${optIndex === question.correctAnswer ? ' (Correct)' : ''}`);
  });
  console.log('\n-------------------');
}); 