import { Card } from "@/components/ui/card";
import WorkoutCard from "./WorkoutCard";
import { WorkoutForm } from "./forms/WorkoutForm";
import { useGetTodaysWorkouts } from "@/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const TodaysWorkout = () => {
  const { user } = useUserContext();
  const { data: workouts, isLoading, isError } = useGetTodaysWorkouts(user.id);

  return (
    <div className="w-full lg:basis-2/3">
      <Card className="p-6 border-0">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Today's Workout</h2>
          <WorkoutForm action="Create" />
        </header>
        
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-500">Failed to load workouts. Please try again.</div>
          ) : workouts?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No workouts logged for today!</p>
              <p className="text-gray-400 text-sm">Start fresh and add your first workout now.</p>
            </div>
          ) : (
            workouts?.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default TodaysWorkout;
