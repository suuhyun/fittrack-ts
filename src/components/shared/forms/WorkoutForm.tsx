import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkoutValidation } from "@/lib/validation";
import {
  useAddWorkout,
  useUpdateWorkout,
} from "@/react-query/queriesAndMutations";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { IWorkout } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

type WorkoutFormProps = {
  workout?: IWorkout;
  action: "Create" | "Update";
};

export function WorkoutForm({ workout, action }: WorkoutFormProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { mutateAsync: addWorkout, isPending: isLoadingCreate } =
    useAddWorkout();
  const { mutateAsync: updateWorkout, isPending: isLoadingUpdate } =
    useUpdateWorkout();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof WorkoutValidation>>({
    resolver: zodResolver(WorkoutValidation),
    defaultValues: {
      title: "",
      type: "cardio",
      workoutFocus: "",
      duration: 0,
      calories: 0,
      details: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof WorkoutValidation>) {
    console.log(values);
    if (workout && action === "Update") {
        const result = await updateWorkout({
          userId: user.id,
          workout: {
            ...workout,
            ...values,
          },
        });
        if (!result) return toast({ title: "Please try again" });
        setIsOpen(false);
        return;
    }
    const validDate =
      values.date instanceof Date ? values.date : new Date(values.date);
    const newWorkout = await addWorkout({
      userId: user.id,
      workout: {
        ...values,
        date: validDate,
      },
    });
    if (!newWorkout) {
      return toast({
        title: "Failed to add a workout. Please try again.",
      });
    }
    setIsOpen(false);
    toast({ title: "New workout added! 🎉" });
    form.reset();
  }

  useEffect(() => {
    if (workout) {
      form.reset({
        title: workout.title || "",
        type: workout.type || "cardio",
        workoutFocus: workout.workoutFocus || "",
        duration: workout.duration || 0,
        calories: workout.calories || 0,
        details: workout.details || "",
        date: workout.date instanceof Date ? workout.date : new Date(),
      });
    }
  }, [workout, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {action == "Create" ? (
          <Button data-testid="open-dialog" className="bg-[#5046e5] hover:bg-[#6a62e2] flex gap-2">
            <span>+</span> Add Workout
          </Button>
        ) : (
          <div className={`cursor-pointer ${workout?.completed ? "pointer-events-none" : ""}`} data-testid="edit-workout-dialog">
            <img
              src="assets/icons/edit.svg"
              height={20}
              width={20}
              alt="edit"
            />
          </div>
        )}
      </DialogTrigger>
      <DialogContent aria-describedby="undefined">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Add Workout
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Morning Run" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="flexibility">Flexibility</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workoutFocus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Focus</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Interval training, Yoga flow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      name="duration"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Calories
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={isDisabled ? 0 : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <div className="flex justify-end items-center space-x-2">
                      <Checkbox
                        id="enter-later"
                        checked={isDisabled}
                        className="h-4 w-4 border-gray-300"
                        onCheckedChange={(checked) =>
                          setIsDisabled(checked === true)
                        }
                      />
                      <label
                        htmlFor="enter-later"
                        className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Skip for now
                      </label>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mr-5">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-50">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="main"
              className="w-full py-5"
              data-testid="submit-workout"
              disabled={isLoadingCreate || isLoadingUpdate}
            >
              {isLoadingCreate || (isLoadingUpdate && "Loading...")} {action}{" "}
              Workout
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
