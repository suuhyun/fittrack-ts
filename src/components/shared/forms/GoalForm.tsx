import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
// import { useCreateGoal, useUpdateGoal } from "@/react-query/queriesAndMutations";
import { useToast } from "@/hooks/use-toast";

type GoalFormProps = {
  action: "Create" | "Update";
  goal?: { id: string; title: string; description?: string };
};

const GoalForm = ({ action, goal }: GoalFormProps) => {
  const { user } = useUserContext();
  const { toast } = useToast();
//   const { mutateAsync: createGoal } = useCreateGoal();
//   const { mutateAsync: updateGoal } = useUpdateGoal();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");

  const handleSubmit = async () => {
    if (!title.trim()) {
      return toast({ title: "Goal title is required.", variant: "destructive" });
    }

    // if (action === "Create") {
    //   await createGoal({ userId: user.id, title, description });
    // } else {
    //   await updateGoal({ userId: user.id, goalId: goal!.id, title, description });
    // }

    toast({ title: `Goal ${action.toLowerCase()}d successfully!` });
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{action}</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action} Goal</DialogTitle>
          </DialogHeader>
          <Input placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{action}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalForm;
