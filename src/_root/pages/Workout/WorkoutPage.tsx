import TodaysWorkout from "@/components/shared/TodaysWorkout";

const WorkoutPage = () => {
  return (
    <div className="px-10 md:px-15 pt-3">
      <header className="mt-5 mb-10">
        <h1 className="text-4xl font-bold mb-2">Track Your Workouts</h1>
        <p className="text-gray-500">
        Stay on top of your fitness routine by monitoring your workouts and progress.
        </p>
      </header>
      <div>
        <TodaysWorkout />
      </div>
    </div>
  );
};

export default WorkoutPage;
