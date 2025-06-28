
import React, { useState, useEffect, useMemo } from 'react';
import { Group, Message, MessageType, QuestionType, TestConfig } from '../types';
import { QuestionMarkCircleIcon, AcademicCapIcon, XMarkIcon, ClockIcon, ListBulletIcon, TagIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline';

interface TestConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  mode: 'test' | 'study';
  allMessages: Message[];
  onSubmit: (config: Omit<TestConfig, 'questionIds' | 'groupId'>, mode: 'test' | 'study') => void;
  onDownloadForOffline: (config: Omit<TestConfig, 'questionIds' | 'groupId'>) => void; // New prop
  isDownloading?: boolean; // New prop
}

const timerOptions = [
  { label: 'No Timer', value: 0 },
  { label: '10 minutes', value: 10 * 60 },
  { label: '15 minutes', value: 15 * 60 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '45 minutes', value: 45 * 60 },
  { label: '60 minutes', value: 60 * 60 },
];

const TESTABLE_QUESTION_TYPES: QuestionType[] = [
  QuestionType.MULTIPLE_CHOICE_SINGLE,
  QuestionType.TRUE_FALSE,
  // Add other types here if they become testable & downloadable
];

const TestConfigModal: React.FC<TestConfigModalProps> = ({ 
    isOpen, 
    onClose, 
    group, 
    mode, 
    allMessages, 
    onSubmit,
    onDownloadForOffline,
    isDownloading 
}) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [selectedTimerSeconds, setSelectedTimerSeconds] = useState<number>(0);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([]);
  const [selectedTagsInModal, setSelectedTagsInModal] = useState<string[]>([]);

  const uniqueTagsFromGroup = useMemo(() => {
    const tagsSet = new Set<string>();
    allMessages.forEach(msg => {
      if (
        msg.type === MessageType.QUESTION &&
        TESTABLE_QUESTION_TYPES.includes(msg.questionType!) &&
        (msg.upvotes || 0) > (msg.downvotes || 0) &&
        msg.tags && msg.tags.length > 0
      ) {
        msg.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [allMessages]);

  const availableQuestions = useMemo(() => {
    if (selectedQuestionTypes.length === 0) return [];
    return allMessages.filter(msg => {
      const isTestableType = msg.type === MessageType.QUESTION && selectedQuestionTypes.includes(msg.questionType!);
      const hasRequiredFields = msg.questionStem && 
                                msg.options && msg.options.length > 0 && 
                                msg.correctAnswerIds && msg.correctAnswerIds.length > 0;
      const isUpvoted = (msg.upvotes || 0) > (msg.downvotes || 0);

      let matchesTags = true;
      if (selectedTagsInModal.length > 0) {
        matchesTags = msg.tags ? selectedTagsInModal.some(tag => msg.tags!.includes(tag)) : false;
      }

      return isTestableType && hasRequiredFields && isUpvoted && matchesTags;
    });
  }, [allMessages, selectedQuestionTypes, selectedTagsInModal]);

  useEffect(() => {
    if (isOpen) {
      setSelectedQuestionTypes([]);
      setSelectedTagsInModal([]);
      setSelectedTimerSeconds(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const maxQs = availableQuestions.length;
    setNumberOfQuestions(prevNumOfQs => {
      if (maxQs === 0) return 0;
      const defaultNum = Math.min(5, maxQs);
      if (prevNumOfQs === 0 && maxQs > 0) return defaultNum;
      if (prevNumOfQs > maxQs) return maxQs;
      if (prevNumOfQs < 1 && maxQs > 0) return 1; // Ensure at least 1 if available
      return prevNumOfQs;
    });
  }, [availableQuestions]);


  if (!isOpen) return null;

  const maxQuestions = availableQuestions.length;

  const handleQuestionTypeChange = (type: QuestionType, checked: boolean) => {
    setSelectedQuestionTypes(prevTypes =>
      checked ? [...prevTypes, type] : prevTypes.filter(t => t !== type)
    );
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTagsInModal(prevTags =>
      checked ? [...prevTags, tag] : prevTags.filter(t => t !== tag)
    );
  };

  const isSubmitDisabled = () => {
    if (selectedQuestionTypes.length === 0) return true;
    if (maxQuestions === 0) return true;
    if (numberOfQuestions <= 0 || numberOfQuestions > maxQuestions) return true;
    if (isDownloading) return true;
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled()) {
        alert(`Please ensure you have selected question types, there are available questions for the selected criteria, and the number of questions is valid (1-${maxQuestions}).`);
        return;
    }
    const config: Omit<TestConfig, 'questionIds' | 'groupId'> = {
      numberOfQuestions,
      allowedQuestionTypes: selectedQuestionTypes,
      selectedTags: selectedTagsInModal,
    };

    if (mode === 'test' && selectedTimerSeconds > 0) {
      config.timerDuration = selectedTimerSeconds;
    }
    onSubmit(config, mode);
  };

  const handleDownload = () => {
    if (isSubmitDisabled()) {
        alert(`Cannot download. Please ensure you have selected question types, there are available questions for the selected criteria, and the number of questions is valid (1-${maxQuestions}).`);
        return;
    }
     const config: Omit<TestConfig, 'questionIds' | 'groupId'> = {
      numberOfQuestions,
      allowedQuestionTypes: selectedQuestionTypes,
      selectedTags: selectedTagsInModal,
      timerDuration: mode === 'test' && selectedTimerSeconds > 0 ? selectedTimerSeconds : undefined,
    };
    onDownloadForOffline(config);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = maxQuestions > 0 ? 1 : 0;

    if (maxQuestions === 0) {
      val = 0;
    } else {
      if (val < 1) val = 1;
      if (val > maxQuestions) val = maxQuestions;
    }
    setNumberOfQuestions(val);
  };

  const modalTitle = mode === 'test' ? 'Configure Test' : 'Configure Study Session';
  const modalIcon = mode === 'test' ?
    <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" /> :
    <AcademicCapIcon className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />;

  const getQuestionTypeLabel = (type: QuestionType): string => {
    switch(type) {
      case QuestionType.MULTIPLE_CHOICE_SINGLE: return "Multiple Choice";
      case QuestionType.TRUE_FALSE: return "True/False";
      default: return type;
    }
  };

  const submitButtonBaseClasses = "px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  let determinedSubmitButtonColorClasses: string;
  if (mode === 'test') {
    determinedSubmitButtonColorClasses = 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400';
  } else { 
    determinedSubmitButtonColorClasses = 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-400';
  }
  const submitButtonColorClasses = determinedSubmitButtonColorClasses;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="test-config-modal-title">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {modalIcon}
            <h2 id="test-config-modal-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {modalTitle} for <span className={`${mode === 'test' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>{group.name}</span>
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Close modal" disabled={isDownloading}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <ListBulletIcon className="w-5 h-5 mr-1.5 text-gray-500 dark:text-gray-400"/> Question Formats
                </label>
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md border border-gray-200 dark:border-gray-700">
                    {TESTABLE_QUESTION_TYPES.map(type => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600/50">
                            <input
                                type="checkbox"
                                checked={selectedQuestionTypes.includes(type)}
                                onChange={(e) => handleQuestionTypeChange(type, e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                                disabled={isDownloading}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{getQuestionTypeLabel(type)}</span>
                        </label>
                    ))}
                </div>
                {selectedQuestionTypes.length === 0 && <p className="text-xs text-red-500 dark:text-red-400 mt-1">Please select at least one question format.</p>}
            </div>

            {uniqueTagsFromGroup.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <TagIcon className="w-5 h-5 mr-1.5 text-gray-500 dark:text-gray-400" /> Filter by Tags (Optional)
                </label>
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
                  {uniqueTagsFromGroup.map(tag => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600/50">
                      <input
                        type="checkbox"
                        checked={selectedTagsInModal.includes(tag)}
                        onChange={(e) => handleTagChange(tag, e.target.checked)}
                        className="h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 dark:focus:ring-purple-400 dark:bg-gray-700 dark:checked:bg-purple-500 dark:checked:border-purple-500"
                        disabled={isDownloading}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                    </label>
                  ))}
                </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">If no tags are selected, questions will not be filtered by tags.</p>
              </div>
            )}


            <div className="mb-4">
                <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Questions
                </label>
                <input
                type="number"
                id="numberOfQuestions"
                value={numberOfQuestions}
                onChange={handleNumberChange}
                min={maxQuestions > 0 ? 1 : 0}
                max={maxQuestions > 0 ? maxQuestions : 0}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                required
                disabled={maxQuestions === 0 || selectedQuestionTypes.length === 0 || isDownloading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                { selectedQuestionTypes.length > 0 ?
                    `Available quality-approved questions matching selected criteria: ${maxQuestions}.` :
                    `Select question formats to see available questions.`
                }
                </p>
            </div>

            {mode === 'test' && (
              <div className="mb-6">
                <label htmlFor="timerDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400"/> Timer Duration (Optional)
                </label>
                <select
                  id="timerDuration"
                  value={selectedTimerSeconds}
                  onChange={(e) => setSelectedTimerSeconds(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  disabled={maxQuestions === 0 || selectedQuestionTypes.length === 0 || isDownloading}
                >
                  {timerOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500 order-1 sm:order-none"
                disabled={isDownloading}
                >
                Cancel
                </button>
                <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 disabled:opacity-50 order-3 sm:order-none"
                    disabled={isSubmitDisabled() || isDownloading}
                >
                    <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download for Offline'}
                </button>
                <button
                type="submit"
                className={`${submitButtonBaseClasses} ${submitButtonColorClasses} order-2 sm:order-none`}
                disabled={isSubmitDisabled()}
                >
                 {mode === 'test' ? 'Start Test' : 'Start Study Session'}
                </button>
            </div>
            {isSubmitDisabled() && maxQuestions === 0 && selectedQuestionTypes.length > 0 && !isDownloading && (
                 <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-center">No quality-approved questions match the selected criteria (types and/or tags). Try other options or add/upvote questions.</p>
            )}
            </form>
      </div>
    </div>
  );
};

export default TestConfigModal;
