
import React from 'react';

interface TodayStatusProps {
  total: number;
  completed: number;
}

const TodayStatus: React.FC<TodayStatusProps> = ({ total, completed }) => {
  const allDone = total > 0 && total === completed;
  const someMissed = total > 0 && completed < total;

  return (
    <div className={`p-6 rounded-2xl mb-6 shadow-sm transition-all duration-300 ${allDone ? 'bg-green-100 text-green-900 border border-green-200' : 'bg-white border border-stone-200'}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-1">Status</h2>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">
            {completed} <span className="text-xl font-normal text-stone-400">/ {total}</span>
          </p>
          <p className="text-sm mt-1 text-stone-600 font-medium">
            {allDone ? 'Day complete. Well done!' : 
             total === 0 ? 'No habits scheduled for today.' :
             `${total - completed} habit${total - completed > 1 ? 's' : ''} left to grow.`}
          </p>
        </div>
        {allDone && (
          <div className="bg-green-500 text-white p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayStatus;
