import { FaFire, FaTrophy } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { MdElectricBolt } from "react-icons/md";
import { useUserContext } from "@/context/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";
import DashboardCard from "./DashboardCard";

const UserStats = () => {
  const { user } = useUserContext();
  const stats = useUserStats(user.id);
  const { activeMinutes, calories, sessions } = user.weeklyGoal;

  const currentWeek = stats?.currentWeek ?? {
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalActiveMinutes: 0,
  };
  const lastWeek = stats?.lastWeek ?? {
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalActiveMinutes: 0,
  };

  const countGoalsMet = () => {
    let count = 0;
    if (currentWeek.totalWorkouts >= sessions) count++;
    if (currentWeek.totalActiveMinutes >= activeMinutes) count++;
    if (currentWeek.totalCaloriesBurned >= calories) count++;
    return count
  }

  const calculateChangeText = (current: number, previous: number) => {
    const change = current - previous;
    if (change > 0) return `+${change} from last week`;
    if (change < 0) return `${change} from last week`;
    return "No change from last week";
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <DashboardCard
        title="Weekly Workouts"
        stats={{
          value: currentWeek.totalWorkouts,
          changeText: calculateChangeText(currentWeek.totalWorkouts, lastWeek.totalWorkouts),
          changeColor:
            currentWeek.totalWorkouts > lastWeek.totalWorkouts
              ? "text-green-500"
              : currentWeek.totalWorkouts < lastWeek.totalWorkouts
              ? "text-red-500"
              : "",
        }}
        icon={<FaFire className="text-orange-500 text-lg" />}
      />
      <DashboardCard
        title="Active Minutes"
        stats={{
          value: currentWeek.totalActiveMinutes,
          changeText: calculateChangeText(currentWeek.totalActiveMinutes, lastWeek.totalActiveMinutes),
          changeColor:
            currentWeek.totalActiveMinutes > lastWeek.totalActiveMinutes
              ? "text-green-500"
              : currentWeek.totalActiveMinutes < lastWeek.totalActiveMinutes
              ? "text-red-500"
              : "",
        }}
        icon={<IoTime className="text-blue-500 text-xl" />}
      />
      <DashboardCard
        title="Calories Burned"
        stats={{
          value: currentWeek.totalCaloriesBurned,
          changeText: calculateChangeText(currentWeek.totalCaloriesBurned, lastWeek.totalCaloriesBurned),
          changeColor:
            currentWeek.totalCaloriesBurned > lastWeek.totalCaloriesBurned
              ? "text-green-500"
              : currentWeek.totalCaloriesBurned < lastWeek.totalCaloriesBurned
              ? "text-red-500"
              : "",
        }}
        icon={<MdElectricBolt className="text-yellow-500 text-xl" />}
      />
      <DashboardCard
        title="Goals Met"
        stats={{
          value: countGoalsMet().toString() + "/3",
          changeText: "Weekly target",
        }}
        icon={<FaTrophy className="text-purple-500 text-lg" />}
      />
    </div>
  );
};

export default UserStats;
