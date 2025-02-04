import { useEffect, useState } from "react";
import { usersCollection } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { getCurrentWeek, getLastWeek } from "@/lib/utils";

const defaultWeeklyStats = {
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalActiveMinutes: 0,
  };

export const useUserStats = (userId: string) => {
  const [stats, setStats] = useState<{
    currentWeek: { totalWorkouts: number; totalCaloriesBurned: number; totalActiveMinutes: number };
    lastWeek: { totalWorkouts: number; totalCaloriesBurned: number; totalActiveMinutes: number };
  } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const userDocRef = doc(usersCollection, userId);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data() as any;
        const currentWeekKey = getCurrentWeek();
        const lastWeekKey = getLastWeek();
        console.log(currentWeekKey)
        const weeklyStats = userData.weeklyProgress || {};
        console.log(weeklyStats)
        
        setStats({
          currentWeek: weeklyStats[currentWeekKey] || defaultWeeklyStats,
          lastWeek: weeklyStats[lastWeekKey] || defaultWeeklyStats,
        });
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return stats;
};
