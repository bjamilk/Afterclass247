
import React from 'react';
import { TestResult, QuestionType, UserAnswerRecord, Message } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ArrowLeftOnRectangleIcon, ChartBarIcon } from '@heroicons/react/24/solid';

interface TestReviewScreenProps {
  results: TestResult; 
  onExit: () => void;
  onNavigateToDashboard: () => void;
}

const TestReviewScreen: React.FC<TestReviewScreenProps> = ({ results, onExit, onNavigateToDashboard }) => {
  const { session, score, totalQuestions, correctAnswersCount } = results;

  const getOptionText = (question: Message, optionId?: string): string => {
    if (!optionId) return "Not answered";
    if (!question || !question.options) return "Error: Option not found";
    const option = question.options.find(opt => opt.id === optionId);
    return option ? option.text : "Error: Option text not found";
  };
  
  const scoreColor = score >= 70 ? 'text-green-600 dark:text-green-400' : score >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-blue-700 dark:text-blue-400 mb-2 sm:mb-0">Test Review</h1>
            <div className="flex space-x-2">
                <button
                    onClick={onNavigateToDashboard}
                    className="px-3 py-2 bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 focus:ring-offset-2 flex items-center text-sm"
                    aria-label="View Dashboard"
                >
                    <ChartBarIcon className="w-5 h-5 mr-1.5" /> Dashboard
                </button>
                <button
                    onClick={onExit}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 flex items-center text-sm"
                    aria-label="Return to Chat"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-1.5" /> Return to Chat
                </button>
            </div>
        </div>
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row justify-around items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Your Score</p>
                <p className={`text-3xl font-bold ${scoreColor}`}>{score.toFixed(1)}%</p>
            </div>
             <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Correct Answers</p>
                <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{correctAnswersCount} / {totalQuestions}</p>
            </div>
            {/* Display Group Name - Ensure dark mode text color for group name */}
            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Group</p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px] md:max-w-xs" title={session.config.groupId}>
                    {session.config.groupId} 
                </p>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {session.questions.map((question, index) => {
          const userAnswerRecord = session.userAnswers[question.id];
          const isCorrect = userAnswerRecord?.isCorrect;
          const userSelectedOptionId = userAnswerRecord?.selectedOptionId;
          const correctOptionIds = question.correctAnswerIds || []; 

          return (
            <div key={question.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-md font-semibold mb-2 text-gray-900 dark:text-gray-100"> 
                Question {index + 1}: {isCorrect ? 
                <CheckCircleIcon className="w-5 h-5 inline-block ml-2 text-green-500 dark:text-green-400" /> : 
                (userSelectedOptionId ? <XCircleIcon className="w-5 h-5 inline-block ml-2 text-red-500 dark:text-red-400" /> : <InformationCircleIcon className="w-5 h-5 inline-block ml-2 text-yellow-500 dark:text-yellow-400" />)
                }
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{question.questionStem}</p>

              {question.imageUrl && (
                <div className="my-3 flex justify-center">
                    <img 
                        src={question.imageUrl} 
                        alt="Question visual" 
                        className="max-w-xs h-auto rounded-md border border-gray-300 dark:border-gray-600 shadow"
                        style={{ maxHeight: '200px' }}
                    />
                </div>
              )}

              {(question.questionType === QuestionType.MULTIPLE_CHOICE_SINGLE || question.questionType === QuestionType.TRUE_FALSE) && question.options && (
                <div className="space-y-2 mb-3">
                    {question.options.map(opt => {
                    let classes = "p-2 border dark:border-gray-600 rounded-md text-sm";
                    if (correctOptionIds.includes(opt.id)) {
                        classes += " bg-green-50 dark:bg-green-900/40 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 font-medium"; 
                    }
                    if (opt.id === userSelectedOptionId && !correctOptionIds.includes(opt.id)) {
                        classes += " bg-red-50 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 line-through"; 
                    } else if (opt.id === userSelectedOptionId && correctOptionIds.includes(opt.id)) {
                        // User's correct choice is already highlighted by the green class
                    } else if (!correctOptionIds.includes(opt.id) && opt.id !== userSelectedOptionId) { // Added condition to not override explicitly styled wrong answers
                        classes += " text-gray-600 dark:text-gray-400"; 
                    }
                    return (
                        <div key={opt.id} className={classes}>
                        {opt.text}
                        {opt.id === userSelectedOptionId && <span className="text-xs font-normal ml-2 text-blue-600 dark:text-blue-400">(Your Answer)</span>}
                        {correctOptionIds.includes(opt.id) && opt.id !== userSelectedOptionId && <span className="text-xs font-normal ml-2 text-green-700 dark:text-green-300">(Correct Answer)</span>}
                        </div>
                    );
                    })}
                    {!userSelectedOptionId && correctOptionIds.length > 0 && (
                        <p className="p-2 border dark:border-yellow-600 rounded-md text-sm bg-yellow-50 dark:bg-yellow-900/40 border-yellow-400 text-yellow-700 dark:text-yellow-300">
                            Not Answered. Correct answer: {getOptionText(question, correctOptionIds[0])}
                            {correctOptionIds.length > 1 && " (and others if multiple correct type)"} 
                        </p>
                    )}
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center">
                    <InformationCircleIcon className="w-5 h-5 mr-1 text-blue-500 dark:text-blue-400" /> Explanation:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{question.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
       <div className="mt-8 text-center">
         <button
            onClick={onExit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 flex items-center text-base mx-auto"
            >
             <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> Return to Chat
            </button>
      </div>
    </div>
  );
};

export default TestReviewScreen;
