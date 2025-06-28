
import React, { useState, useEffect, useRef } from 'react';
import { TestSessionData, StudySessionData, TestQuestion, QuestionType, UserAnswerRecord } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, AcademicCapIcon, QuestionMarkCircleIcon, ClockIcon, BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

interface TestTakingScreenProps {
  mode: 'test' | 'study';
  session: TestSessionData | StudySessionData; // TestSessionData now includes isOffline
  onUpdateAnswer: (questionId: string, selectedOptionId: string, timeSpentSeconds?: number) => void; 
  onChangeQuestion: (newIndex: number) => void;
  onToggleBookmark: (questionId: string) => void;
  onSubmitTest?: () => void; // For online tests
  onSubmitOfflineTest?: () => void; // New prop for offline tests
  onEndSession?: () => void; // For study sessions (online or offline)
}

const formatTime = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const TestTakingScreen: React.FC<TestTakingScreenProps> = ({ 
  mode,
  session,
  onUpdateAnswer,
  onChangeQuestion,
  onToggleBookmark,
  onSubmitTest,
  onSubmitOfflineTest, // New prop
  onEndSession,
}) => {
  const currentQuestion = session.questions[session.currentQuestionIndex];
  const userAnswer = session.userAnswers[currentQuestion.id];
  const totalQuestions = session.questions.length;

  const [timeLeftDisplay, setTimeLeftDisplay] = useState<string | null>(null);
  const questionViewStartTimeRef = useRef<number | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    questionViewStartTimeRef.current = Date.now();
  }, [session.currentQuestionIndex, currentQuestion.id]);


  useEffect(() => {
    if (mode === 'test' && session.endTime && (onSubmitTest || onSubmitOfflineTest)) {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const endTimeMs = session.endTime!.getTime(); 
        const diff = Math.round((endTimeMs - now) / 1000);
        
        if (diff <= 0) {
          setTimeLeftDisplay(formatTime(0));
          if (session.isOffline && onSubmitOfflineTest) onSubmitOfflineTest();
          else if (!session.isOffline && onSubmitTest) onSubmitTest();
          return 0; 
        }
        setTimeLeftDisplay(formatTime(diff));
        return diff;
      };

      if (calculateTimeLeft() <= 0) return; 

      const timerId = setInterval(() => {
        if (calculateTimeLeft() <= 0) {
          clearInterval(timerId);
        }
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setTimeLeftDisplay(null);
    }
  }, [mode, session.endTime, onSubmitTest, onSubmitOfflineTest, session.isOffline, session.currentQuestionIndex]);
  
  useEffect(() => {
    if (paletteRef.current) {
      const currentButton = paletteRef.current.querySelector(`[data-qindex="${session.currentQuestionIndex}"]`) as HTMLElement;
      if (currentButton) {
        currentButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [session.currentQuestionIndex]);


  const handleOptionSelect = (optionId: string) => {
    if (mode === 'study' && userAnswer?.selectedOptionId) {
      return;
    }
    const timeSpentSeconds = questionViewStartTimeRef.current 
      ? Math.round((Date.now() - questionViewStartTimeRef.current) / 1000) 
      : undefined;
    onUpdateAnswer(currentQuestion.id, optionId, timeSpentSeconds);
  };

  const renderOptions = (question: TestQuestion, currentAnswerRecord?: UserAnswerRecord) => {
    if (!question.options) return null;

    const isStudyModeAnswered = mode === 'study' && currentAnswerRecord?.selectedOptionId;

    return question.options.map((opt) => {
      let optionClasses = "p-3 border rounded-lg cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700/70 transition-colors text-gray-800 dark:text-gray-200";
      let icon = null;

      if (currentAnswerRecord?.selectedOptionId === opt.id) {
        optionClasses = `${optionClasses} bg-blue-100 dark:bg-blue-900/60 border-blue-500 dark:border-blue-600 ring-2 ring-blue-400 dark:ring-blue-500`; 
      }

      if (isStudyModeAnswered) {
        optionClasses = `${optionClasses} cursor-default ${ currentAnswerRecord?.selectedOptionId === opt.id ? '' : 'hover:bg-transparent dark:hover:bg-transparent'}`;
        if (question.correctAnswerIds?.includes(opt.id)) {
            optionClasses = `${optionClasses} bg-green-100 dark:bg-green-900/40 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300`;
            icon = <CheckCircleIcon className="w-5 h-5 ml-auto text-green-600 dark:text-green-400" />;
        } else if (opt.id === currentAnswerRecord.selectedOptionId && !question.correctAnswerIds?.includes(opt.id)) {
            optionClasses = `${optionClasses} bg-red-100 dark:bg-red-900/40 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300`;
            icon = <XCircleIcon className="w-5 h-5 ml-auto text-red-600 dark:text-red-400" />;
        } else {
             optionClasses = `${optionClasses} opacity-70 dark:opacity-60`; 
        }
      }

      return (
        <li
          key={opt.id}
          onClick={() => handleOptionSelect(opt.id)}
          className={`flex items-center ${optionClasses}`}
          aria-checked={currentAnswerRecord?.selectedOptionId === opt.id}
          role="radio" 
          tabIndex={isStudyModeAnswered ? -1 : 0} 
          onKeyDown={isStudyModeAnswered ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && handleOptionSelect(opt.id)}
        >
          <span className="mr-2 text-sm font-medium">{opt.text}</span> 
          {icon}
        </li>
      );
    });
  };
  
  const headerText = mode === 'test' ? (session.isOffline ? 'Offline Test' : 'Test in Progress') : (session.isOffline ? 'Offline Study' : 'Study Session');
  const headerIcon = mode === 'test' ? 
    <QuestionMarkCircleIcon className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" /> : 
    <AcademicCapIcon className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" />;

  const isCurrentBookmarked = userAnswer?.isBookmarked || false;
  const BookmarkToggleIcon = isCurrentBookmarked ? BookmarkSolidIcon : BookmarkOutlineIcon;

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300">
        <p>Error: Question not found. This should not happen.</p>
        {onEndSession && <button onClick={onEndSession} className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md">End Session</button>}
      </div>
    );
  }

  const finalSubmitAction = session.isOffline ? onSubmitOfflineTest : onSubmitTest;

  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200">
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-between">
              <div className="flex items-center text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100"> 
                  {headerIcon} {headerText}
              </div>
              {timeLeftDisplay && mode === 'test' && (
                  <div className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-full">
                      <ClockIcon className="w-5 h-5 mr-1.5" />
                      Time Remaining: {timeLeftDisplay}
                  </div>
              )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Question {session.currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-start mb-1">
                <h2 id={`question-stem-${currentQuestion.id}`} className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Question {currentQuestion.questionNumber}:
                </h2>
                <button
                    onClick={() => onToggleBookmark(currentQuestion.id)}
                    className={`p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${isCurrentBookmarked ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}
                    aria-label={isCurrentBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    title={isCurrentBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                    <BookmarkToggleIcon className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>
            <p className="text-md md:text-lg mb-4 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{currentQuestion.questionStem}</p>

            {currentQuestion.imageUrl && (
                <div className="my-3 flex justify-center">
                    <img 
                        src={currentQuestion.imageUrl} // This will be Base64 for offline, URL for online
                        alt="Question visual" 
                        className="max-w-sm h-auto rounded-md border border-gray-300 dark:border-gray-600 shadow"
                        style={{ maxHeight: '250px' }}
                    />
                </div>
            )}

            {(currentQuestion.questionType === QuestionType.MULTIPLE_CHOICE_SINGLE || currentQuestion.questionType === QuestionType.TRUE_FALSE) && (
            <ul className="space-y-3" role="radiogroup" aria-labelledby={`question-stem-${currentQuestion.id}`}>
                {renderOptions(currentQuestion, userAnswer)}
            </ul>
            )}
            
            {mode === 'study' && userAnswer?.selectedOptionId && (
            <div className={`mt-4 p-3 rounded-md ${userAnswer.isCorrect ? 'bg-green-50 dark:bg-green-900/40 border-green-400 dark:border-green-600' : 'bg-red-50 dark:bg-red-900/40 border-red-400 dark:border-red-600'} border`}>
                <h3 className={`text-sm font-semibold ${userAnswer.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {userAnswer.isCorrect ? 'Correct!' : 'Incorrect.'}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{currentQuestion.explanation}</p>
            </div>
            )}
        </div>

        <div className="mt-auto pt-4 flex justify-between items-center flex-shrink-0">
            <button
            onClick={() => onChangeQuestion(session.currentQuestionIndex - 1)}
            disabled={session.currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
            <ChevronLeftIcon className="w-5 h-5 mr-1" /> Previous
            </button>

            {mode === 'test' && session.currentQuestionIndex === totalQuestions - 1 && finalSubmitAction && (
            <button
                onClick={finalSubmitAction}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2"
            >
                Submit Test
            </button>
            )}
            
            {mode === 'study' && onEndSession && (
                session.currentQuestionIndex === totalQuestions - 1 ? (
                    <button
                        onClick={onEndSession}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:ring-offset-2"
                    >
                        End Study Session
                    </button>
                ) : (
                    <button
                        onClick={() => onChangeQuestion(session.currentQuestionIndex + 1)}
                        disabled={session.currentQuestionIndex === totalQuestions - 1 || (currentQuestion.questionType !== QuestionType.OPEN_ENDED && !userAnswer?.selectedOptionId) } 
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Next Question <ChevronRightIcon className="w-5 h-5 ml-1" />
                    </button>
                )
            )}
            
            {mode === 'test' && session.currentQuestionIndex < totalQuestions - 1 && (
                <button
                    onClick={() => onChangeQuestion(session.currentQuestionIndex + 1)}
                    disabled={session.currentQuestionIndex === totalQuestions - 1}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    Next Question <ChevronRightIcon className="w-5 h-5 ml-1" />
                </button>
            )}
        </div>
      </div>

      <div 
        ref={paletteRef}
        className="flex-shrink-0 bg-gray-200 dark:bg-gray-800 p-2 md:p-3 border-t border-gray-300 dark:border-gray-700 shadow-md overflow-x-auto"
        role="toolbar" 
        aria-label="Question navigation"
      >
        <div className="flex space-x-2">
          {session.questions.map((q, index) => {
            const answerRecord = session.userAnswers[q.id];
            const isCurrent = session.currentQuestionIndex === index;
            const isAnswered = !!answerRecord?.selectedOptionId; 
            const isBookmarked = !!answerRecord?.isBookmarked;

            let buttonClasses = "min-w-[40px] h-10 px-2.5 py-1 text-xs font-medium rounded-md flex items-center justify-center relative transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800";
            let title = `Go to Question ${q.questionNumber}`;
            if (isBookmarked) title += " (Bookmarked)";
            if (isAnswered) title += " (Answered)";
            else title += " (Unanswered)";


            if (isCurrent) {
              buttonClasses += " bg-blue-500 dark:bg-blue-400 text-white ring-2 ring-blue-600 dark:ring-blue-300 shadow-lg scale-105";
            } else if (isAnswered) {
              buttonClasses += " bg-green-200 dark:bg-green-700/80 text-green-800 dark:text-green-100 hover:bg-green-300 dark:hover:bg-green-600";
            } else {
              buttonClasses += " bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500";
            }
            if (isBookmarked && !isCurrent) { 
                 buttonClasses += " border-2 border-yellow-500 dark:border-yellow-400";
            }


            return (
              <button
                key={q.id}
                data-qindex={index}
                onClick={() => onChangeQuestion(index)}
                className={buttonClasses}
                aria-label={title}
                title={title}
              >
                {isBookmarked && (
                    <BookmarkSolidIcon className={`w-3 h-3 absolute top-0.5 right-0.5 ${isCurrent ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`} />
                )}
                {q.questionNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
