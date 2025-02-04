export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  weeklyGoal: {
    sessions: number;
    activeMinutes: number;
    calories: number;
  };
  weeklyProgress: { [week: string]: WeeklyGoalProgress };
};

export type WeeklyGoalProgress = {
  totalWorkouts: number;
  totalActiveMinutes: number;
  totalCaloriesBurned: number;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IWeeklyProgress = {
  id: string;
  userId: string;
  weekStartDate: string; // YYYY-MM-DD
  totalCalories: number;
  totalDuration: number; // in minutes
  workoutsCount: number;
};

export type IWorkoutType = "cardio" | "strength" | "flexibility" | "other";

export type IWorkout = {
  id: string;
  title: string;
  date: Date; // "YYYY-MM-DD"
  duration: number;
  type: "cardio" | "strength" | "flexibility" | "other";
  workoutFocus?: string; // (ex: "running", "deadlift")
  calories: number;
  details?: string;
  createdAt: Date;
  completed: boolean;
};

export type INewWorkout = {
  date: Date;
  title: string;
  duration: number;
  type: "cardio" | "strength" | "flexibility" | "other";
  workoutFocus?: string; // (ex: "running", "deadlift")
  calories: number;
  details?: string;
};

export type IWeeklyGoal = {
  id: string;
  startDate: string; // week start date
  endDate: string; // week end date
  workoutGoal: number;
  workoutsCompleted: number;
  activeMinutesGoal: number;
  activeMinutesCompleted: number;
};

export type IGoal = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  cretedAt: string;
};
