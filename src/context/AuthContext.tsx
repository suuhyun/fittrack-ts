import { getCurrentUser } from "@/lib/firebase/api";
import { IUser } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  weeklyGoal: {
    sessions: 0,
    activeMinutes: 0,
    calories: 0,
  },
  weeklyProgress: {},
};

const AuthContext = createContext<{
  user: IUser;
  isLoading: boolean;
  onBoarded: boolean;
}>({
  user: INITIAL_USER,
  isLoading: true,
  onBoarded: false,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [onBoarded, setOnBoarded] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const auth = getAuth();
    console.log("start auth");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoading(true);
        let unsubscribeUser: (() => void) | undefined;
        try {
          unsubscribeUser = await getCurrentUser(
            firebaseUser.uid,
            (updatedUser) => {
              setUser({
                id: firebaseUser.uid,
                name: updatedUser?.name || "",
                username: updatedUser?.username || "",
                email: firebaseUser.email || "",
                imageUrl: firebaseUser.photoURL || "",
                weeklyGoal: updatedUser?.weeklyGoal || {
                  sessions: 0,
                  activeMinutes: 0,
                  calories: 0,
                },
                weeklyProgress: updatedUser?.weeklyProgress || {},
              });

              if (updatedUser.weeklyGoal.sessions == 0) {
                navigate("/onboarding");
              } else {
                setOnBoarded(true);
              }
            }
          );

          return () => {
            if (unsubscribeUser) unsubscribeUser();
          };
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/sign-in");
        }
        setIsLoading(false);
      } else {
        console.log(user);
        setUser(INITIAL_USER);
        navigate("/sign-in");
        setIsLoading(false);
        console.log("go to sign in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, onBoarded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserContext = () => useContext(AuthContext);

export default AuthProvider;
