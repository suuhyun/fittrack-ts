import { Card } from "@/components/ui/card";
import Progressbar from "./Progressbar";
import { useUserContext } from "@/context/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";

const WeeklyProgress = () => {
  const { user } = useUserContext();
  const stats = useUserStats(user.id);
  const currentWeek = stats?.currentWeek ?? {
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalActiveMinutes: 0,
  };
  console.log(user)
  const { activeMinutes, calories, sessions } = user.weeklyGoal;

  return (
    <Card className="w-full lg:basis-1/3 p-6 border-0 h-full">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Weekly Progress</h2>
      </header>
      <div className="flex flex-col gap-5 mb-6">
        <Progressbar
          title="Weekly Sessions"
          current={currentWeek.totalWorkouts}
          goal={sessions}
          unit="sessions"
          color="bg-[#6C66E2]"
        />
        <Progressbar
          title="Active Minutes"
          current={currentWeek.totalActiveMinutes}
          goal={activeMinutes}
          unit="minutes"
          color="bg-[#6C66E2]"
        />
        <Progressbar
          title="Calories Goal"
          current={currentWeek.totalCaloriesBurned}
          goal={calories}
          unit="kcal"
          color="bg-[#6C66E2]"
        />
      </div>
    </Card>
  );
};

export default WeeklyProgress;
