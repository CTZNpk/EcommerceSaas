import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useUserStore } from "@/store/userStore";

const ProfileCreationForm = () => {
  const [profileImage, setProfileImage] = useState(
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fperson-placeholder-vectors&psig=AOvVaw3OVUZ5cvyyQXKr1EPTaIgU&ust=1740054314362000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPDkpM3dz4sDFQAAAAAdAAAAABAE",
  );

  const { setUser, user } = useUserStore();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset } = useForm();
  const { error: fetchError, loading, triggerFetch } = useFetch();
  const [updateSuccess, setUpdateSucces] = useState<boolean>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setImageFile(e.target.files[0]);
      setProfileImage(imageUrl);
    }
  };

  useEffect(() => {
    if (user) {
      reset(user);
    }
    console.log(user?.phoneNumber);
    if (user?.imageUrl) {
      setProfileImage(user.imageUrl);
    }
    console.log(user);
  }, []);

  const onSubmit = async (data: FieldValues) => {
    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const urlData = await triggerFetch(
        "/users/upload",
        {
          method: "POST",
          body: formData,
        },
        true,
        false,
      );

      const url = urlData.imageUrl;

      data.imageUrl = url;
      const responseData = await triggerFetch(
        "/users/update",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        true,
      );

      if (data) {
        setUser(responseData);
        setUpdateSucces(true);
        console.log(data);
      }
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Profile
          </CardTitle>
          <CardDescription className="text-center">
            Fill in your profile details
          </CardDescription>
        </CardHeader>

        <CardContent>
          {fetchError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{fetchError}</AlertDescription>
            </Alert>
          )}

          {updateSuccess && (
            <Alert className="mb-6">
              <AlertDescription>Profile created successfully!</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
                />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Full Name</Label>
              <Input
                id="username"
                placeholder="John Doe"
                {...register("username")}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main St"
                {...register("address")}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="123-456-7890"
                {...register("phoneNumber")}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Preferences</Label>
              <Textarea
                id="preferences"
                placeholder="Your preferences..."
                {...register("preferences")}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Complete your profile to get started.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export { ProfileCreationForm };
