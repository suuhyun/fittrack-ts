import { useUserContext } from "@/context/AuthContext";
import UserStats from "../../../components/shared/UserStats";
import WorkoutCard from "../../../components/shared/TodaysWorkout";
import WeeklyProgress from "../../../components/shared/WeeklyProgress";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, onBoarded } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!onBoarded) {
      navigate("/onboarding");
    }
  }, [onBoarded, navigate]);
  return (
    <div className="px-10 md:px-15 pt-3">
      <header className="mt-5 mb-10">
        <p className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</p>
        <p className="text-gray-500">Track your fitness journey and achieve your goals</p>
      </header>
      <div className="flex flex-col gap-6">
      <UserStats />
      <div className="flex flex-col lg:flex-row gap-5">
        <WorkoutCard />
        <WeeklyProgress />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
