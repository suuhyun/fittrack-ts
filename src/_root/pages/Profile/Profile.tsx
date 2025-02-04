import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUpdateUserProfile } from "@/react-query/queriesAndMutations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileValidation } from "@/lib/validation";

const Profile = () => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const { mutateAsync: updateUserProfile, isPending: isUpdating } =
    useUpdateUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    user.imageUrl || "/assets/images/profile-placeholder.svg"
  );

  useEffect(() => {
    console.log("User data loaded:", user);
  }, [user]);

  const form = useForm<z.infer<typeof profileValidation>>({
    resolver: zodResolver(profileValidation),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      imageUrl: user.imageUrl || "/assets/images/profile-placeholder.svg",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        username: user.username || "",
        imageUrl: user.imageUrl || "/assets/images/profile-placeholder.svg",
      });
      setImageUrl(user.imageUrl || "/assets/images/profile-placeholder.svg");
    }
  }, [user]);

  const handleUpdateProfile = async (
    values: z.infer<typeof profileValidation>
  ) => {
    const result = await updateUserProfile({
      userId: user.id,
      updates: { ...values, imageUrl },
    });

    if (!result) {
      return toast({
        title: "Failed to update profile",
        variant: "destructive",
      });
    }
    toast({ title: "Profile updated successfully!" });
    setIsEditing(false);
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-pic"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const fileReader = new FileReader();
                    fileReader.onload = () =>
                      setImageUrl(fileReader.result as string);
                    fileReader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="profile-pic"
                className="text-sm text-[#5046e5] cursor-pointer hover:underline"
              >
                Change Profile Picture
              </label>
            </>
          )}

          {!isEditing ? (
            <div className="text-center flex flex-col gap-1">
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-gray-400">{user.email}</p>
              <Button
                className="mt-5"
                variant="main"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Submitting Form...");
                  form.handleSubmit(handleUpdateProfile)();
                }}
                className="w-full space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
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
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between w-full">
                  <Button
                    className="w-[48%] border-[#cac8e8]"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                      setImageUrl(
                        user.imageUrl ||
                          "/assets/images/profile-placeholder.svg"
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-[48%]"
                    variant="main"
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
