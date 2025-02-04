import {
  addWorkout,
  createUserAccount,
  deleteWorkout,
  getTodaysWorkouts,
  signInAccount,
  signOutAccount,
  toggleCompleted,
  updateUserGoal,
  updateUserProfile,
  updateWorkout,
} from "@/lib/firebase/api";
import { INewUser, INewWorkout, IWorkout } from "@/types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { query } from "firebase/firestore";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useAddWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      workout,
    }: {
      userId: string;
      workout: INewWorkout;
    }) => addWorkout(userId, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTodaysWorkouts"] });
    },
  });
};

export const useGetTodaysWorkouts = (userId: string) => {
  return useQuery({
    queryKey: ["getTodaysWorkouts"],
    queryFn: () => getTodaysWorkouts(userId),
    enabled: !!userId,
  });
};

export const useToggleCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      workout,
    }: {
      userId: string;
      workout: {
        id: string;
        completed: boolean;
        calories: number;
        duration: number;
      };
    }) => toggleCompleted(userId, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTodaysWorkouts"] });
    },
  });
};

export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, workout }: { userId: string; workout: IWorkout }) =>
      updateWorkout(userId, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTodaysWorkouts"] });
    },
  });
};

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      workout,
    }: {
      userId: string;
      workout: {
        id: string;
        completed: boolean;
        calories: number;
        duration: number;
      };
    }) => deleteWorkout(userId, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTodaysWorkouts"] });
    },
  });
};

export const useUpdateUserGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      goal,
    }: {
      userId: string;
      goal: {
        sessions: number;
        activeMinutes: number;
        calories: number;
      };
    }) => updateUserGoal(userId, goal),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: {
        name?: string;
        username?: string;
        imageUrl?: string;
      };
    }) => updateUserProfile(userId, updates),
  });
};
