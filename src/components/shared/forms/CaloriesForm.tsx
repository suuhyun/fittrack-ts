import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CaloriesValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";

type CaloriesFormProps = {
  onSave: (calories: number) => void;
  isOpen: React.ComponentState;
  setIsOpen: React.ComponentState;
};

const CaloriesForm = ({ onSave, isOpen, setIsOpen }: CaloriesFormProps) => {
  const form = useForm<z.infer<typeof CaloriesValidation>>({
    resolver: zodResolver(CaloriesValidation),
    defaultValues: {
      calories: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof CaloriesValidation>) {
    console.log(values.calories)
    onSave(values.calories);
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Calories</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                  <Input
                      type="number"
                      placeholder="0"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" variant="main">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CaloriesForm;
