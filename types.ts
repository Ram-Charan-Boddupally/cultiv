
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export enum TreeHealth {
  HEALTHY = 'Healthy',
  PAUSED = 'On Hold',
  DRYING = 'Drying',
  WITHERED = 'Withered',
  DEAD = 'Dead'
}

export interface HabitSchedule {
  type: 'daily' | 'weekly';
  interval?: number;
  weekdays?: DayOfWeek[];
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  tags: string[];
  schedule: HabitSchedule;
  startDate: string;
  notificationTime?: string;
  createdAt: string;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  comment?: string;
}

export interface HabitState {
  currentStreak: number;
  maxStreak: number;
  growthStage: number; // 0-5 (0: Seed, 5: Mature)
  health: TreeHealth;
  daysOnHold: number;
  totalCompletions: number;
  isCompletedToday: boolean;
  nextScheduledDate: string;
}
