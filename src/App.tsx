import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import Dashboard from "./_root/pages/Dashboard/Dashboard";
import { Toaster } from "./components/ui/toaster";
import Onboarding from "./_root/pages/OnBoarding/OnBoarding";
import ProgressPage from "./_root/pages/Progress/ProgressPage";
import Profile from "./_root/pages/Profile/Profile";
import WorkoutPage from "./_root/pages/Workout/WorkoutPage";

function App() {
  return (
    <>
      <Toaster />
      <main className="flex h-screen">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/sign-up" element={<SignupForm />} />
            <Route path="/sign-in" element={<SigninForm />} />
          </Route>

          <Route element={<RootLayout />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/workouts" element={<WorkoutPage />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
