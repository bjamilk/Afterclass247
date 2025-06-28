
import React, { useState, useEffect, useMemo } from 'react';
import { TestResult, Group } from '../types';
import { ChartBarIcon, CalendarDaysIcon, CheckCircleIcon, InformationCircleIcon, UsersIcon, ClockIcon, ArrowLeftIcon, PresentationChartLineIcon, ChevronUpIcon, ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/solid';
import GroupPerformanceChart, { ChartDataPoint } from './GroupPerformanceChart';

interface DashboardScreenProps {
  testResults: TestResult[];
  groups: Group[];
  onNavigateToChat: () => void;
  theme: 'light' | 'dark';
}

interface GroupPerformanceData {
  id: string;
  name: string;
  testCount: number;
  totalScore: number;
  averageScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  totalTimeSpentSeconds: number;
  questionsWithTimeData: number;
  averageTimePerQuestion: number;
  chartData: ChartDataPoint[];
}

type TimePeriodOptionValue = 'allTime' | 'last7Days' | 'last30Days' | 'last90Days' | 'custom';

const timePeriodOptions: { value: TimePeriodOptionValue, label: string }[] = [
  { value: 'allTime', label: 'All Time' },
  { value: 'last7Days', label: 'Last 7 Days' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'last90Days', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
];


const DashboardScreen: React.FC<DashboardScreenProps> = ({ testResults: initialTestResults, groups, onNavigateToChat, theme }) => {
  
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriodOptionValue>('allTime');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');


  const filteredTestResults = useMemo(() => {
    if (selectedTimePeriod === 'allTime') {
      return initialTestResults;
    }

    if (selectedTimePeriod === 'custom') {
      if (customStartDate && customEndDate) {
        try {
          const startDateObj = new Date(customStartDate + "T00:00:00"); // Local time start of day
          const endDateObj = new Date(customEndDate + "T23:59:59.999");   // Local time end of day

          if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            console.warn("Invalid custom dates provided.");
            return initialTestResults; // Fallback to all if dates are invalid
          }
          if (startDateObj > endDateObj) {
            console.warn("Custom start date is after end date.");
            return []; // No results possible
          }

          return initialTestResults.filter(result => {
            const resultDate = new Date(result.session.startTime);
            return resultDate >= startDateObj && resultDate <= endDateObj;
          });
        } catch (e) {
            console.error("Error parsing custom dates:", e);
            return initialTestResults; 
        }
      } else {
        // If custom is selected but dates aren't set, effectively show "All Time"
        // or a specific message, here we show all for now.
        return initialTestResults;
      }
    }
    
    // Logic for 'last7Days', 'last30Days', 'last90Days'
    const now = new Date();
    let daysToSubtract = 0;
    if (selectedTimePeriod === 'last7Days') daysToSubtract = 7;
    else if (selectedTimePeriod === 'last30Days') daysToSubtract = 30;
    else if (selectedTimePeriod === 'last90Days') daysToSubtract = 90;

    const cutoffDate = new Date(); 
    cutoffDate.setDate(now.getDate() - daysToSubtract);
    cutoffDate.setHours(0, 0, 0, 0); 

    return initialTestResults.filter(result => {
        const resultDate = new Date(result.session.startTime);
        return resultDate >= cutoffDate;
    });
  }, [initialTestResults, selectedTimePeriod, customStartDate, customEndDate]);
  
  const totalTestsTakenOverall = filteredTestResults.length;
  
  const getGroupName = (groupId: string): string => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  };

  const [allGroupPerformanceData, setAllGroupPerformanceData] = useState<GroupPerformanceData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isRecentTestsExpanded, setIsRecentTestsExpanded] = useState(true);

  useEffect(() => {
    const groupPerformanceMap: Map<string, GroupPerformanceData> = new Map();
    if (totalTestsTakenOverall > 0) {
      filteredTestResults.forEach(result => {
        const groupId = result.session.config.groupId;
        const groupName = getGroupName(groupId);
        
        let data = groupPerformanceMap.get(groupId);
        if (!data) {
          data = { 
            id: groupId, 
            name: groupName, 
            testCount: 0, 
            totalScore: 0, 
            averageScore: 0,
            correctAnswers: 0,
            totalQuestions: 0,
            accuracy: 0,
            totalTimeSpentSeconds: 0,
            questionsWithTimeData: 0,
            averageTimePerQuestion: 0,
            chartData: [],
          };
        }

        data.testCount++;
        data.totalScore += result.score;
        data.correctAnswers += result.correctAnswersCount;
        data.totalQuestions += result.totalQuestions;
        
        Object.values(result.session.userAnswers).forEach(answer => {
          if (answer.timeSpentSeconds !== undefined) {
            data.totalTimeSpentSeconds += answer.timeSpentSeconds;
            data.questionsWithTimeData++;
          }
        });
        
        groupPerformanceMap.set(groupId, data);
      });

      groupPerformanceMap.forEach(data => {
        data.averageScore = data.testCount > 0 ? data.totalScore / data.testCount : 0;
        data.accuracy = data.totalQuestions > 0 ? (data.correctAnswers / data.totalQuestions) * 100 : 0;
        data.averageTimePerQuestion = data.questionsWithTimeData > 0 ? data.totalTimeSpentSeconds / data.questionsWithTimeData : 0;

        const groupSpecificResults = filteredTestResults
          .filter(tr => tr.session.config.groupId === data.id)
          .sort((a, b) => new Date(a.session.startTime).getTime() - new Date(b.session.startTime).getTime());
        
        data.chartData = groupSpecificResults.map((result, index) => {
          const date = new Date(result.session.startTime);
          const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
          const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            x: `Test ${index + 1} - ${formattedDate} ${formattedTime}`,
            y: result.score,
          };
        });
      });
    }
    const performanceDataArray = Array.from(groupPerformanceMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    setAllGroupPerformanceData(performanceDataArray);

    const initialExpandedState: Record<string, boolean> = {};
    performanceDataArray.forEach(groupData => {
      initialExpandedState[groupData.id] = true; 
    });
    setExpandedGroups(initialExpandedState);

  }, [filteredTestResults, groups, totalTestsTakenOverall]);


  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const toggleRecentTestsExpansion = () => {
    setIsRecentTestsExpanded(prev => !prev);
  };
  
  let overallTotalTimeSpent = 0;
  let overallQuestionsWithTime = 0;
  filteredTestResults.forEach(result => {
    Object.values(result.session.userAnswers).forEach(answer => {
      if (answer.timeSpentSeconds !== undefined) {
        overallTotalTimeSpent += answer.timeSpentSeconds;
        overallQuestionsWithTime++;
      }
    });
  });
  const overallAverageTimePerQuestion = overallQuestionsWithTime > 0 
    ? (overallTotalTimeSpent / overallQuestionsWithTime)
    : 0;

  const recentTests = [...filteredTestResults].sort((a,b) => new Date(b.session.startTime).getTime() - new Date(a.session.startTime).getTime()).slice(0, 5);

  const getTimePeriodLabel = () => {
    if (selectedTimePeriod === 'custom') {
      if (customStartDate && customEndDate) {
        try {
            const startDate = new Date(customStartDate + "T00:00:00");
            const endDate = new Date(customEndDate + "T00:00:00");
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'Custom Range (Invalid Dates)';
            return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        } catch {
            return 'Custom Range (Invalid Dates)';
        }
      }
      return 'Custom Range (Select Dates)';
    }
    return timePeriodOptions.find(o => o.value === selectedTimePeriod)?.label || 'All Time';
  };
  const currentPeriodLabel = getTimePeriodLabel();

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center text-2xl md:text-3xl font-semibold text-teal-600 dark:text-teal-400 mb-2 sm:mb-0">
            <ChartBarIcon className="w-8 h-8 mr-3" />
            Performance Dashboard
          </div>
          <button
            onClick={onNavigateToChat}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 flex items-center text-sm"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1.5" /> Back to Chat
          </button>
        </div>
        <div className="mt-4">
            <label htmlFor="timePeriodSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <FunnelIcon className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"/>
                Filter by Time Period:
            </label>
            <select
                id="timePeriodSelect"
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value as TimePeriodOptionValue)}
                className="w-full sm:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
                {timePeriodOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
        {selectedTimePeriod === 'custom' && (
            <div className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/30">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Custom Date Range:</h4>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <div>
                        <label htmlFor="customStartDate" className="block text-xs text-gray-600 dark:text-gray-400 mb-0.5">Start Date:</label>
                        <input
                            type="date"
                            id="customStartDate"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            max={customEndDate || undefined}
                        />
                    </div>
                    <div>
                        <label htmlFor="customEndDate" className="block text-xs text-gray-600 dark:text-gray-400 mb-0.5">End Date:</label>
                        <input
                            type="date"
                            id="customEndDate"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            min={customStartDate || undefined}
                        />
                    </div>
                </div>
                {(!customStartDate || !customEndDate) && 
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Please select both a start and end date for custom filtering.</p>
                }
            </div>
        )}
      </div>

      {totalTestsTakenOverall > 0 ? (
        <div className="space-y-8">
          {/* Overall Activity Metrics */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">Overall Activity ({currentPeriodLabel})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tests Taken</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalTestsTakenOverall}</p>
              </div>
               <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center"><ClockIcon className="w-4 h-4 mr-1"/>Avg. Time / Question</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {overallAverageTimePerQuestion > 0 ? `${overallAverageTimePerQuestion.toFixed(0)}s` : 'N/A'}
                </p>
              </div>
            </div>
          </section>

          {allGroupPerformanceData.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Performance by Group ({currentPeriodLabel})</h2>
              <div className="space-y-6">
                {allGroupPerformanceData.map(groupData => (
                  <div key={groupData.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <button
                      onClick={() => toggleGroupExpansion(groupData.id)}
                      className="w-full flex justify-between items-center text-left mb-3 focus:outline-none"
                      aria-expanded={expandedGroups[groupData.id]}
                      aria-controls={`group-details-${groupData.id}`}
                    >
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 flex items-center">
                        <UsersIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                        {groupData.name}
                      </h3>
                      {expandedGroups[groupData.id] ? <ChevronUpIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" /> : <ChevronDownIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
                    </button>
                    
                    {expandedGroups[groupData.id] && (
                      <div id={`group-details-${groupData.id}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tests Taken</p>
                            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{groupData.testCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Score</p>
                            <p className={`text-xl font-bold ${groupData.averageScore >= 70 ? 'text-green-600 dark:text-green-400' : groupData.averageScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                              {groupData.averageScore.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
                            <p className={`text-xl font-bold ${groupData.accuracy >= 70 ? 'text-green-600 dark:text-green-400' : groupData.accuracy >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                              {groupData.accuracy.toFixed(1)}%
                            </p>
                            <p className="text-2xs text-gray-400 dark:text-gray-500">({groupData.correctAnswers}/{groupData.totalQuestions} correct)</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center"><ClockIcon className="w-3 h-3 mr-0.5"/>Avg. Time/Q</p>
                            <p className="text-xl font-bold text-indigo-500 dark:text-indigo-400">
                                {groupData.averageTimePerQuestion > 0 ? `${groupData.averageTimePerQuestion.toFixed(0)}s` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {groupData.chartData.length > 0 ? (
                          <>
                            <h4 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-1 mt-4 flex items-center">
                                <PresentationChartLineIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                Score Progression
                            </h4>
                            <GroupPerformanceChart 
                                groupName={groupData.name} 
                                data={groupData.chartData} 
                                theme={theme} 
                            />
                          </>
                        ) : (
                             <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No test data for this group in the selected period.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
             <button
                onClick={toggleRecentTestsExpansion}
                className="w-full flex justify-between items-center text-left mb-3 focus:outline-none"
                aria-expanded={isRecentTestsExpanded}
                aria-controls="recent-tests-content"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Recent Tests ({currentPeriodLabel})</h2>
                {isRecentTestsExpanded ? <ChevronUpIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" /> : <ChevronDownIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
              </button>
            
            {isRecentTestsExpanded && (
                <div id="recent-tests-content">
                    {recentTests.length > 0 ? (
                    <div className="space-y-3">
                        {recentTests.map((result, index) => {
                        const testTimeSpentSeconds = Object.values(result.session.userAnswers)
                            .reduce((sum, ans) => sum + (ans.timeSpentSeconds || 0), 0);
                        const answeredQuestionsWithTime = Object.values(result.session.userAnswers)
                            .filter(ans => ans.timeSpentSeconds !== undefined).length;
                        const avgTimePerQThisTest = answeredQuestionsWithTime > 0 
                            ? (testTimeSpentSeconds / answeredQuestionsWithTime).toFixed(0) + 's' 
                            : 'N/A';

                        return (
                            <div key={result.session.startTime.toISOString() + '-' + index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-0.5">
                                <CalendarDaysIcon className="w-3.5 h-3.5 mr-1 text-gray-400 dark:text-gray-500"/> 
                                {new Date(result.session.startTime).toLocaleDateString()} - {new Date(result.session.startTime).toLocaleTimeString()}
                                </p>
                                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate" title={getGroupName(result.session.config.groupId)}>
                                Group: {getGroupName(result.session.config.groupId)}
                                </p>
                            </div>
                            <div className="flex space-x-4 items-center sm:text-right">
                                <div className="text-left sm:text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Time/Q</p>
                                    <p className="font-semibold text-indigo-500 dark:text-indigo-400">{avgTimePerQThisTest}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                <p className={`text-lg font-bold ${result.score >= 70 ? 'text-green-500 dark:text-green-400' : result.score >= 40 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
                                    {result.score.toFixed(1)}%
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">({result.correctAnswersCount}/{result.totalQuestions} correct)</p>
                                </div>
                            </div>
                            </div>
                        );
                        })}
                    </div>
                    ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-3 bg-white dark:bg-gray-800 rounded-lg shadow">No recent test data available for the selected period.</p>
                    )}
                </div>
            )}
          </section>
        </div>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <CheckCircleIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Tests Taken Yet {selectedTimePeriod !== 'allTime' ? `in the period: ${currentPeriodLabel}` : ''}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Complete some tests in your study groups to see your performance here.</p>
          <button
            onClick={onNavigateToChat}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 text-base"
          >
            Go to My Groups
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
