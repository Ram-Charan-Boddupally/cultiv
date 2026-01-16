
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayStr = (): string => formatDate(new Date());

export const getYesterdayStr = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
};

export const getDaysCompletedInYear = (): number => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const diff = today.getDate() - startOfYear.getDate();
  return diff + 1;
}
export const getDaysLeftInYear = (): number => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), 11, 31);
  const diff = lastDay.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const getDaysLeftInMonth = (): number => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const diff = lastDay.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isScheduledForDate = (habit: any, date: Date): boolean => {
  const startDate = new Date(habit.startDate);
  if (date < startDate) return false;

  if (habit.schedule.type === 'daily') {
    const interval = habit.schedule.interval || 1;
    const diffTime = Math.abs(date.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % interval === 0;
  } else {
    const dayOfWeek = date.getDay();
    return habit.schedule.weekdays?.includes(dayOfWeek) || false;
  }
};
