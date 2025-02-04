import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const { user, onBoarded } = useUserContext();
  console.log({user, onBoarded})

  return (
    <>
      {user.id !== "" ? (onBoarded ? (
        <Navigate to="/" />
      ): <Navigate to="/onboarding" />) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          <img
            src="/assets/images/side-img2.jpg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
