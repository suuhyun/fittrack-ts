import { INewUser, INewWorkout, IUser, IWorkout } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, usersCollection } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getCurrentWeek, updateWeeklyProgress } from "../utils";

export async function getCurrentUser(
  uid: string,
  callback: (userData: IUser) => void
) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User is not authenticated");
  }
  try {
    const userDoc = doc(usersCollection, uid);
    return onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as IUser);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function createUserAccount(user: INewUser) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    const newUser = userCredential.user;
    const userDocData = {
      email: user.email,
      imageUrl: "",
      name: user.name,
      uid: newUser.uid,
      username: user.username,
    };
    await setDoc(doc(usersCollection, newUser.uid), userDocData);
    return newUser;
  } catch (error) {}
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    return userCredential.user;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
}

export async function addWorkout(userId: string, workout: INewWorkout) {
  try {
    console.log(workout);
    const newWorkout = {
      ...workout,
      createdAt: new Date().toISOString(),
      date: Timestamp.fromDate(workout.date),
      completed: false,
    };
    console.log(newWorkout);
    const userWorkoutsCollection = collection(db, `users/${userId}/workouts`);
    await addDoc(userWorkoutsCollection, newWorkout);
    console.log("doc added");
    return newWorkout;
  } catch (error) {
    console.log(error);
  }
}

export async function getTodaysWorkouts(userId: string) {
  try {
    const userWorkoutsCollection = collection(db, `users/${userId}/workouts`);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      userWorkoutsCollection,
      where("date", ">=", Timestamp.fromDate(startOfDay)),
      where("date", "<=", Timestamp.fromDate(endOfDay))
    );

    const querySnapshot = await getDocs(q);

    const workouts = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<IWorkout, "id">;
      return {
        id: doc.id,
        ...data,
      };
    });

    return workouts;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function toggleCompleted(
  userId: string,
  workout: {
    id: string;
    completed: boolean;
    calories: number;
    duration: number;
  }
) {
  try {
    const workoutDocRef = doc(db, `users/${userId}/workouts/${workout.id}`);
    await updateDoc(workoutDocRef, {
      completed: workout.completed,
      calories: workout.calories,
    });
    const userDocRef = doc(usersCollection, userId);
    const userDocSnapshot = await getDoc(userDocRef);
    const userData = userDocSnapshot.data();

    const currentWeek = getCurrentWeek();
    const weeklyProgress = userData?.weeklyProgress || {};

    const incrementValue = workout.completed ? 1 : -1;
    const calorieAdjustment = workout.completed
      ? workout.calories
      : -workout.calories;
    const durationAdjustment = workout.completed
      ? workout.duration
      : -workout.duration;

    const updatedWeeklyProgress = updateWeeklyProgress(
      weeklyProgress,
      currentWeek,
      incrementValue,
      calorieAdjustment,
      durationAdjustment
    );
    const updatedData: any = {
      totalWorkouts: increment(incrementValue),
      totalCaloriesBurned: increment(calorieAdjustment),
      totalActiveMinutes: increment(durationAdjustment),
      weeklyProgress: updatedWeeklyProgress,
    };

    await updateDoc(userDocRef, updatedData);

    console.log("Workout completion status updated successfully.");
  } catch (error) {
    console.log(error);
  }
}

export async function updateWorkout(userId: string, workout: IWorkout) {
  try {
    const workoutDocRef = doc(db, `users/${userId}/workouts/${workout.id}`);
    await updateDoc(workoutDocRef, {
      ...workout,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteWorkout(
  userId: string,
  workout: {
    id: string;
    completed: boolean;
    calories: number;
    duration: number;
  }
) {
  try {
    const workoutDocRef = doc(db, `users/${userId}/workouts/${workout.id}`);
    await deleteDoc(workoutDocRef);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function updateUserGoal(
  userId: string,
  goal: { sessions: number; activeMinutes: number; calories: number }
) {
  try {
    const userDocRef = doc(usersCollection, userId);
    await updateDoc(userDocRef, {
      weeklyGoal: goal,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: { name?: string; username?: string; imageUrl?: string }
) {
  try {
    const userDocRef = doc(usersCollection, userId);
    await updateDoc(userDocRef, updates);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}