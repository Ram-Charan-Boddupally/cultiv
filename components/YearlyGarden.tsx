
import React from 'react';
import { getDaysLeftInMonth, getDaysLeftInYear, formatDate, addDays, getDaysCompletedInYear } from '../utils/date.utils';
import { format } from 'path';

interface YearlyGardenProps {
  allCompletions: string[];
}

const YearlyGarden: React.FC<YearlyGardenProps> = ({ allCompletions }) => {
  const daysMonth = getDaysLeftInMonth();
  const daysYear = getDaysLeftInYear();
  const daysCompleted = getDaysCompletedInYear();
  const today = new Date();

  const days = Array.from({ length: 365 }, (_, i) => i + 1);


  return (
    <div className="space-y-4 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-900 rounded-[1.2rem] text-white p-3 shadow-xl flex flex-col justify-between h-20">
          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">YEARLY</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-[900] italic">{daysYear}</span>&nbsp;
            <span className="text-[8px] font-black text-stone-400 uppercase">REMAINING</span>
          </div>
        </div>
        <div className="bg-stone-900 rounded-[1.2rem] p-3 text-white shadow-xl flex flex-col justify-between h-20">
          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">MONTHLY</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-[900] italic">{daysMonth}</span>&nbsp;
            <span className="text-[8px] font-black text-stone-400">DAYS LEFT</span>
          </div>
        </div>
    
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-stone-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">{today.toLocaleDateString(undefined, {
                                                                                                      day: 'numeric',
                                                                                                      month: 'long',
                                                                                                      year: 'numeric'
                                                                                                    })}</h3>
          <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[8px] font-black text-stone-300 uppercase">Status Active</span>
          </div>
        </div>

        <div style={{ gap: '2.5px' }} className="flex flex-wrap pb-4">
          {/*grid grid-flow-col grid-rows-7 */}
          {days.map((day) => {
            let className = '';
            if (day < daysCompleted) {
              className = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
            } else if (day === daysCompleted) {
              className = 'bg-red-500 shadow-[0_0_8px_rgba(34,197,94,0.3)] animate-pulse';
            } else {
              className = 'bg-stone-200 shadow-inner border border-stone-100';
            }

            return (<div
              key={day}
              /* Size increased by ~25-40% from 2.5 to 3.5 */
              className={`w-5 h-5 rounded-[2px] transition-all duration-300 ${className}`}
            ></div>)
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-stone-50 flex justify-center">
          <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic tracking-tighter">Growth visualization of the annual harvest</p>
        </div>
      </div>
    </div>
  );
};

export default YearlyGarden;
