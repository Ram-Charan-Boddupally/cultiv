
import React from 'react';
import { Habit, HabitState } from '../types';
import Tree from './Tree';

interface HabitCardProps {
  habit: Habit;
  state: HabitState;
  onToggle: (id: string) => void;
  onClick: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, state, onToggle, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-2xl p-4 border transition-all active:scale-[0.98] ${state.isCompletedToday ? 'border-green-200 shadow-sm' : 'border-stone-100 shadow-sm hover:border-stone-200'}`}
      onClick={() => onClick(habit.id)}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-stone-50 rounded-xl p-1">
          <Tree stage={state.growthStage} health={state.health} size="sm" />
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-stone-800 truncate">{habit.name}</h3>
            {habit.tags.length > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] font-bold text-stone-500 uppercase">
                {habit.tags[0]}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 truncate mb-2">{habit.description || 'Grow your tree every day'}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-400">STREAK</span>
              <span className="text-xs font-bold text-stone-700">{state.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-400">MAX</span>
              <span className="text-xs font-bold text-stone-700">{state.maxStreak}</span>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(habit.id);
          }}
          className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors ${
            state.isCompletedToday 
              ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
              : 'bg-stone-100 text-stone-400'
          }`}
        >
          {state.isCompletedToday ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
