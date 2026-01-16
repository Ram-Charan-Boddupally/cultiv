
import React from 'react';
import { formatDate, addDays } from '../utils/date.utils';

interface CalendarHeatmapProps {
  completions: string[];
  daysToShow?: number;
  title?: string;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ 
  completions, 
  daysToShow = 84, 
  title = "Activity History" 
}) => {
  const today = new Date();
  const days = Array.from({ length: daysToShow }, (_, i) => {
    const date = addDays(today, -(daysToShow - 1) + i);
    const dateStr = formatDate(date);
    return {
      dateStr,
      completed: completions.includes(dateStr)
    };
  });

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-stone-200 shadow-sm w-full min-h-[160px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6 px-1">
        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">{title}</h4>
      </div>
      <div className="flex justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide">
        <div className="grid grid-flow-col grid-rows-7 gap-2.5 w-full">
          {days.map((day) => (
            <div
              key={day.dateStr}
              title={day.dateStr}
              className={`w-4.5 h-4.5 md:w-5.5 md:h-5.5 rounded-[5px] transition-all duration-500 ${
                day.completed 
                  ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-110' 
                  : 'bg-stone-100 border border-stone-200/40'
              }`}
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-5 px-1 text-[9px] font-black text-stone-300 uppercase tracking-[0.2em]">
        <span>PAST</span>
        <span>TODAY</span>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
