import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Too long"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Too long"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const WorkoutValidation = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  type: z.enum(["cardio", "strength", "flexibility", "other"]),
  workoutFocus : z.string().optional(),
  duration: z.number().positive({ message: "Duration must be greater than 0." }),
  calories: z.number(),
  details: z.string().optional(),
  date: z.date(),
});

export const CaloriesValidation = z.object({
  calories: z.number().positive({ message: "Calories must be greater than 0." }),
});

export const OnboardingValidation = z.object({
  sessions: z.number().min(1, "Must be at least 1").max(7, "Cannot exceed 7"),
  activeMinutes: z.number().min(10, "Must be at least 10").max(300, "Cannot exceed 300"),
  calories: z.number().min(50, "Must be at least 50").max(5000, "Cannot exceed 5000"),
});

export const profileValidation = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Too long").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Too long").optional(),
  imageUrl: z.string().optional(),
});