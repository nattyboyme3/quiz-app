import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Question ${current + 1} of ${total}`}
      className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden"
    >
      <div
        className="absolute inset-y-0 left-0 w-full bg-blue-500 rounded-full transition-transform duration-300 ease-out origin-left"
        style={{ transform: `scaleX(${percentage / 100})` }}
      />
    </div>
  );
}
