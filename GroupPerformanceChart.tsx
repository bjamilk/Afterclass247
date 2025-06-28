
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration, TooltipItem } from 'chart.js';
Chart.register(...registerables); // Register all controllers, elements, scales, and plugins

export interface ChartDataPoint {
  x: string; // Label for x-axis (e.g., "Test 1", "2023-10-26")
  y: number; // Score
}

interface GroupPerformanceChartProps {
  groupName: string;
  data: ChartDataPoint[];
  theme: 'light' | 'dark';
}

const GroupPerformanceChart: React.FC<GroupPerformanceChartProps> = ({ groupName, data, theme }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Destroy previous instance
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
        const ticksColor = theme === 'dark' ? '#cbd5e1' : '#4b5563'; // Tailwind slate-300 and gray-600
        
        const barBackgroundColor = theme === 'dark' ? 'rgba(14, 165, 233, 0.65)' : 'rgba(59, 130, 246, 0.65)'; // sky-500 / blue-500 with opacity
        const barBorderColor = theme === 'dark' ? 'rgba(14, 165, 233, 1)' : 'rgba(59, 130, 246, 1)';
        
        const tooltipBackgroundColor = theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)'; // slate-800 and white
        const tooltipTitleColor = theme === 'dark' ? '#f1f5f9' : '#1e293b'; // slate-100 and slate-900
        const tooltipBodyColor = theme === 'dark' ? '#e2e8f0' : '#334155'; // slate-200 and slate-700

        const chartConfig: ChartConfiguration = {
          type: 'bar', // Changed from 'line' to 'bar'
          data: {
            labels: data.map(d => d.x),
            datasets: [{
              label: `Scores for ${groupName}`,
              data: data.map(d => d.y),
              backgroundColor: barBackgroundColor,
              borderColor: barBorderColor,
              borderWidth: 1,
              borderRadius: 4, // Optional: for rounded bars
              hoverBackgroundColor: theme === 'dark' ? 'rgba(14, 165, 233, 0.85)' : 'rgba(59, 130, 246, 0.85)',
              hoverBorderColor: barBorderColor,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Score (%)',
                  color: ticksColor,
                  font: { size: 12 }
                },
                grid: {
                  color: gridColor,
                },
                ticks: {
                  color: ticksColor,
                  padding: 8,
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Test Instance',
                  color: ticksColor,
                  font: { size: 12 }
                },
                grid: {
                  display: false, 
                },
                ticks: {
                  color: ticksColor,
                  padding: 8,
                }
              }
            },
            plugins: {
              legend: {
                display: false, 
              },
              tooltip: {
                enabled: true,
                backgroundColor: tooltipBackgroundColor,
                titleColor: tooltipTitleColor,
                bodyColor: tooltipBodyColor,
                borderColor: gridColor,
                borderWidth: 1,
                padding: 10,
                cornerRadius: 4,
                displayColors: false, 
                callbacks: {
                  label: function(context: TooltipItem<'bar'>) { // Updated TooltipItem type
                    return `Score: ${context.formattedValue}%`;
                  }
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
          }
        };
        chartInstanceRef.current = new Chart(ctx, chartConfig);
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, groupName, theme]);

  if (data.length < 2) { // Kept this condition as seeing a single bar isn't much of a "progression"
    return (
      <div className="text-center py-6 px-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-md mt-3">
        <p>At least 2 test results are needed to show a progression graph for this group.</p>
        <p className="text-xs mt-1">Keep taking tests to track your progress!</p>
      </div>
    );
  }

  return (
    <div className="h-60 md:h-64 my-4 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg shadow-inner">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default GroupPerformanceChart;
