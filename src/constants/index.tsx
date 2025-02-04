import { FaRunning, FaDumbbell, FaQuestionCircle } from "react-icons/fa";
import { GrYoga } from "react-icons/gr";

export const workoutIcons: Record<string, JSX.Element> = {
    cardio: <FaRunning className="text-2xl text-[#5046e5]"/>,
    strength: <FaDumbbell className="text-2xl text-[#5046e5]"/>,
    flexibility: <GrYoga className="text-2xl text-[#5046e5]"/>,
    other: <FaQuestionCircle className="text-2xl text-[#5046e5]"/>,
  };

type StepField = "sessions" | "activeMinutes" | "calories";

// Steps array
export const onboardingSteps: {
  label: string;
  field: StepField;
  interval: number;
  unit: string;
  min: number;
  max: number;
  defaultValue: number; // Added default value for each step
  question: string;
}[] = [
  {
    label: "Set Workout Frequency",
    field: "sessions",
    interval: 1,
    unit: "session",
    min: 1,
    max: 7,
    defaultValue: 1,
    question: "How many workouts per week?",
  },
  {
    label: "Set Active Minutes",
    field: "activeMinutes",
    interval: 10,
    unit: "minutes",
    min: 10,
    max: 300,
    defaultValue: 30,
    question: "How many minutes per session?",
  },
  {
    label: "Set Calorie Burn Goal",
    field: "calories",
    interval: 50,
    unit: "calories",
    min: 50,
    max: 5000,
    defaultValue: 300,
    question: "How many kcal per session?",
  },
];

export const onboardingChartData = [
  { value: 305 },
  { value: 237 },
  { value: 150 },
  { value: 209 },
  { value: 214 },
  { value: 190 },
  { value: 260 },
  { value: 150 },
  { value: 220 },
  { value: 305 },
];