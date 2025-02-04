import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaDumbbell } from "react-icons/fa6";

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
import { SigninValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import {
  useSignInAccount,
} from "@/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const { user, isLoading, onBoarded } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const signedInUser = await signInAccount({
      email: values.email || "",
      password: values.password || "",
    });

    if (!signedInUser) {
      return toast({
        title: "Sign in failed. Please try again.",
      });
    }

    if (user) {
      form.reset();
      navigate("/")
    } else {
      return toast({ title: "Sign in failed. Please try again." });
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
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back!
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
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
                  <Input data-testid="password-input" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            aria-label="Sign in"
            className="flex gap-2 py-5"
            variant="main"
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-center mt-2">
            Don't have an account?
            <Link to="/sign-up" className="font-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
