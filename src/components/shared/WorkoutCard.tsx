import { workoutIcons } from "@/constants";
import { IWorkout } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import {
  useDeleteWorkout,
  useToggleCompleted,
} from "@/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { WorkoutForm } from "./forms/WorkoutForm";
import CaloriesForm from "./forms/CaloriesForm";

type WorkoutCardProps = {
  workout: IWorkout;
};

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const { toast } = useToast()
  const { user } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: toggleCompleted } = useToggleCompleted();
  const { mutateAsync: deleteWorkout } = useDeleteWorkout();
  const handleClickCheckbox = () => {
    if (workout.calories !== 0) {
      handleCheckboxChange();
    } else {
      setIsOpen(true);
    }
  };
  const handleCheckboxChange = async (calories = workout.calories) => {
    try {
      await toggleCompleted({
        userId: user.id,
        workout: {
          id: workout.id,
          completed: !workout.completed,
          calories: calories,
          duration: workout.duration,
        },
      });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to complete a workout. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleDelete = async () => {
    const result = await deleteWorkout({
      userId: user.id,
      workout: {
        id: workout.id,
        completed: workout.completed,
        calories: workout.calories,
        duration: workout.duration
      },
    });
    if (!result)
      return toast({
        title: "Failed to delete a workout. Please try again.",
        variant: "destructive",
      });
    toast({ title: "Workout deleted.",  variant: "destructive"});
  };
  return (
    <div
      className={`bg-[#f9fbfc] rounded-md flex items-center p-5 justify-between ${
        workout.completed ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="mr-2 ml-1">{workoutIcons[workout.type]}</div>
        <div>
          <div className="font-semibold text-lg flex gap-2">
            <div>{workout.title}</div>
            {workout?.workoutFocus && "-"}
            <div>{workout?.workoutFocus}</div>
          </div>
          <div className="flex gap-1 font-medium text-sm text-[#8d8ca0]">
            <div>{workout.duration} minutes</div>
            {workout.details && (
              <div>{`${workout.details ? "•" : ""} ${workout.details}`}</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <WorkoutForm action="Update" workout={workout} />
        <div className={`cursor-pointer ${workout?.completed ? "pointer-events-none" : ""}`} onClick={handleDelete}>
          <img src="assets/icons/delete.svg" alt="delete" />
        </div>
        <Checkbox
          className="data-[state=checked]:bg-[#655fdd] bg-white border-0 w-6 h-6"
          onCheckedChange={handleClickCheckbox}
          checked={workout.completed}
        />
      </div>
      {isOpen && (
        <CaloriesForm
          onSave={handleCheckboxChange}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default WorkoutCard;
