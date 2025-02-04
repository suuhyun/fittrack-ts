import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { onboardingChartData, onboardingSteps } from "@/constants";
import { OnboardingValidation } from "@/lib/validation";
import { Bar, BarChart, CartesianGrid } from "recharts";
import { useUpdateUserGoal } from "@/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { user, onBoarded } = useUserContext();
  console.log(user, onBoarded);
  const { toast } = useToast();
  const [currentValue, setCurrentValue] = useState(
    onboardingSteps[0].defaultValue
  );

  useEffect(() => {
    if (onBoarded) {
      navigate("/");
    }
  }, [onBoarded, navigate]);

  const { mutateAsync: updateUserGoal } = useUpdateUserGoal();

  const form = useForm({
    resolver: zodResolver(OnboardingValidation),
    defaultValues: {
      sessions: 1,
      activeMinutes: 30,
      calories: 300,
    },
  });

  const currentField = onboardingSteps[step].field;

  const handleIncrement = () => {
    if (
      currentValue + onboardingSteps[step].interval <=
      onboardingSteps[step].max
    ) {
      setCurrentValue((prev) => prev + onboardingSteps[step].interval);
    }
  };

  const handleDecrement = () => {
    if (
      currentValue - onboardingSteps[step].interval >=
      onboardingSteps[step].min
    ) {
      setCurrentValue((prev) => prev - onboardingSteps[step].interval);
    }
  };

  const handleNext = async () => {
    form.setValue(currentField, currentValue);

    if (step < onboardingSteps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setCurrentValue(onboardingSteps[nextStep].defaultValue);
    } else {
      console.log("Final Values:", form.getValues());
      const { sessions, activeMinutes, calories } = form.getValues();
      const result = await updateUserGoal({
        userId: user.id,
        goal: {
          sessions,
          activeMinutes: sessions * activeMinutes,
          calories: sessions * calories,
        },
      });
      if (!result)
        return toast({ title: "Failed to save your goal. Please try again!" });
      navigate("/");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      setCurrentValue(form.getValues(onboardingSteps[prevStep].field));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6">
      <Card className="p-4">
        <Progress
          value={(step / onboardingSteps.length) * 100}
          color="bg-gray-500"
          className="mb-4"
        />
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {onboardingSteps[step].label}
          </CardTitle>
          <p className="text-center text-gray-400">
            {onboardingSteps[step].question}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="flex items-center mt-6 w-full justify-between">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={handleDecrement}
            >
              <Minus />
            </Button>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold">{currentValue}</span>
              <span className="text-gray-500 font-thin">
                {onboardingSteps[step].unit.toUpperCase()}
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={handleIncrement}
            >
              <Plus />
            </Button>
          </div>
          <div className="flex justify-center mb-5">
            <BarChart width={318} height={70} data={onboardingChartData}>
              <CartesianGrid vertical={false} stroke="0" />
              <Bar dataKey="value" fill="#9693f2" radius={6} />
            </BarChart>
          </div>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-4 w-full"
            >
              <div className="flex justify-between">
                <Button
                  className={`${step === 0 ? "invisible" : ""}`}
                  onClick={handleBack}
                  variant="outline"
                  type="button"
                >
                  Back
                </Button>
                <Button type="submit" variant="outline">
                  {step === onboardingSteps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
