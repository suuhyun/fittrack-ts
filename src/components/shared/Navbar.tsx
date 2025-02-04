import { useSignOutAccount } from "@/react-query/queriesAndMutations";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { FaDumbbell } from "react-icons/fa6";

const Navbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user, onBoarded } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate("/sign-in");
  }, [isSuccess]);

  return (
    <section className="bg-white">
      <div className="flex justify-between py-4 w-full px-10 md:px-15">
        <Link to="/" className="flex gap-3 items-center">
          <div className="logo flex gap-2 items-center">
            <FaDumbbell className="text-[#5046e5] text-4xl" />
            <img src="/assets/images/logo.png" alt="logo" className="h-9" />
          </div>
        </Link>
        {onBoarded && (
          <div className="flex gap-14 items-center font-medium max-md:hidden">
            {[
              { name: "Dashboard", path: "/" },
              { name: "Workouts", path: "/workouts" },
              { name: "Progress", path: "/progress" },
            ].map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className="relative transition-all duration-300 hover:text-[#5046e5] 
                         after:content-[''] after:absolute after:left-0 after:bottom-0 
                         after:w-0 after:h-[2px] after:bg-[#5046e5] 
                         after:transition-all after:duration-300 hover:after:w-full"
              >
                {name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link
            to={`/profile/${user?.id}`}
            className="flex justify-center items-center gap-3"
          >
            <img
              src={user?.imageUrl || "/assets/images/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
