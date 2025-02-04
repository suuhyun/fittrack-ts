import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
// import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import { useCreateUserAccount } from "@/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { FaDumbbell } from "react-icons/fa6";

const SignupForm = () => {
  const { toast } = useToast();
  const { user, isLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        title: "Sign up failed. Please try again.",
      });
    }

    if (user) {
      form.reset();

      navigate("/onboarding");
    } else {
      return toast({ title: "Sign up failed. Please try again." });
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="logo flex gap-2 items-center">
          <FaDumbbell className="text-[#5046e5] text-4xl" />
          <img src="/assets/images/logo.png" alt="logo" className="h-9" />
        </div>
        <h2 className="text-3xl font-bold md:text-2xl pt-5 sm:pt-8">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use FitTrack enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name-input">Name</FormLabel>
                <FormControl>
                  <Input id="name-input" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username-input">Username</FormLabel>
                <FormControl>
                  <Input id="username-input" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            aria-label="Sign up"
            className="flex gap-2 py-5"
            variant="main"
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="font-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
