import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { startOfWeek, endOfWeek, formatISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrentWeek = (date = new Date()) => {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  return `${date.getFullYear()}-W${Math.ceil((days + oneJan.getDay() + 1) / 7)}`;
};

export const getLastWeek = () => {
  const today = new Date();
  today.setDate(today.getDate() - 7);
  const oneJan = new Date(today.getFullYear(), 0, 1);
  const days = Math.floor((today.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  return `${today.getFullYear()}-W${Math.ceil((days + oneJan.getDay() + 1) / 7)}`;
};

export const updateWeeklyProgress = (
  weeklyProgress: Record<string, any>,
  currentWeek: string,
  incrementValue: number,
  calorieAdjustment: number,
  durationAdjustment: number
) => {
  const currentWeekData = weeklyProgress[currentWeek] || {
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalActiveMinutes: 0,
  };

  currentWeekData.totalWorkouts += incrementValue;
  currentWeekData.totalCaloriesBurned += calorieAdjustment;
  currentWeekData.totalActiveMinutes += durationAdjustment;

  return {
    ...weeklyProgress,
    [currentWeek]: currentWeekData,
  };
};


export const getCurrentWeekKey = (): string => {
  const now = new Date();
  return formatISO(startOfWeek(now, { weekStartsOn: 1 }), { representation: "date" }) +
    " - " +
    formatISO(endOfWeek(now, { weekStartsOn: 1 }), { representation: "date" });
};

export const getLastWeekKey = (): string => {
  const now = new Date();
  const lastWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  return formatISO(lastWeekStart, { representation: "date" }) +
    " - " +
    formatISO(endOfWeek(lastWeekStart, { weekStartsOn: 1 }), {
      representation: "date",
    });
};