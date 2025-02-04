import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type ProgressbarProps = {
    title: string,
    current: number,
    goal: number,
    unit?: string
  color: string;
};

const Progressbar = ({ title, current, goal, unit, color }: ProgressbarProps) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress((current / goal) * 100));
    return () => clearTimeout(timer);
  }, [current, goal]);
  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="font-medium">{title}</span>
        <span>
          <span className="font-semibold">{current}</span> / {goal} {unit}
        </span>
      </div>
      <Progress value={progress} className="h-2" color={color} />
    </div>
  );
};

export default Progressbar;
