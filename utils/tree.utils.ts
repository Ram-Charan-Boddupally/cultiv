
import { Habit, Completion, TreeHealth, HabitState } from '../types';
import { getTodayStr, isScheduledForDate, formatDate, addDays } from './date.utils';

export const calculateHabitState = (habit: Habit, completions: Completion[]): HabitState => {
  const habitCompletions = completions
    .filter(c => c.habitId === habit.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const completedDates = new Set(habitCompletions.map(c => c.date));
  const todayStr = getTodayStr();
  
  // Calculate Current Streak
  let currentStreak = 0;
  let streakSearchDate = new Date();
  while (true) {
    const dateStr = formatDate(streakSearchDate);
    if (isScheduledForDate(habit, streakSearchDate)) {
      if (completedDates.has(dateStr)) {
        currentStreak++;
      } else if (dateStr !== todayStr) {
        break;
      }
    }
    streakSearchDate = addDays(streakSearchDate, -1);
    if (streakSearchDate < new Date(habit.startDate)) break;
  }

  // Calculate Max Streak
  let maxStreak = 0;
  let tempStreak = 0;
  let maxSearchDate = new Date();
  while (maxSearchDate >= new Date(habit.startDate)) {
    if (isScheduledForDate(habit, maxSearchDate)) {
      if (completedDates.has(formatDate(maxSearchDate))) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
    maxSearchDate = addDays(maxSearchDate, -1);
  }

  // Growth Stage: 30 days for full maturity
  // 0: Seed (0-2 completions)
  // 1: Sprout (3-7 completions)
  // 2: Leafy (8-14 completions)
  // 3: Small Plant (15-22 completions)
  // 4: Young Tree (23-29 completions)
  // 5: Mature Tree (30+ completions)
  const count = habitCompletions.length;
  let growthStage = 0;
  if (count >= 30) growthStage = 5;
  else if (count >= 23) growthStage = 4;
  else if (count >= 15) growthStage = 3;
  else if (count >= 8) growthStage = 2;
  else if (count >= 3) growthStage = 1;

  // Health Logic
  let misses = 0;
  let healthSearchDate = addDays(new Date(), -1);
  const startDate = new Date(habit.startDate);
  
  while (healthSearchDate >= startDate) {
    if (isScheduledForDate(habit, healthSearchDate)) {
      if (!completedDates.has(formatDate(healthSearchDate))) {
        misses++;
      } else {
        break;
      }
    }
    healthSearchDate = addDays(healthSearchDate, -1);
    if (misses > 20) break;
  }

  let health = TreeHealth.HEALTHY;
  if (misses >= 1 && misses <= 2) health = TreeHealth.PAUSED;
  else if (misses >= 3 && misses <= 5) health = TreeHealth.DRYING;
  else if (misses >= 6 && misses <= 10) health = TreeHealth.WITHERED;
  else if (misses > 10) health = TreeHealth.DEAD;

  return {
    currentStreak,
    maxStreak,
    growthStage,
    health,
    daysOnHold: misses,
    totalCompletions: count,
    isCompletedToday: completedDates.has(todayStr),
    nextScheduledDate: todayStr
  };
};
