import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as COMP from "@/components";
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
    } catch (e) { }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 p-4">
      <COMP.Card className="w-full max-w-lg border-0 shadow-2xl">
        <COMP.CardHeader>
          <COMP.CardTitle className="text-2xl font-bold text-center">
            Create Profile
          </COMP.CardTitle>
          <COMP.CardDescription className="text-center">
            Fill in your profile details
          </COMP.CardDescription>
        </COMP.CardHeader>

        <COMP.CardContent>
          {fetchError && (
            <COMP.Alert variant="destructive" className="mb-6">
              <COMP.AlertDescription>{fetchError}</COMP.AlertDescription>
            </COMP.Alert>
          )}

          {updateSuccess && (
            <COMP.Alert className="mb-6">
              <COMP.AlertDescription>
                Profile created successfully!
              </COMP.AlertDescription>
            </COMP.Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
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
              <COMP.Label htmlFor="username">Full Name</COMP.Label>
              <COMP.Input
                id="username"
                placeholder="John Doe"
                {...register("username")}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <COMP.Label htmlFor="address">Address</COMP.Label>
              <COMP.Textarea
                id="address"
                placeholder="123 Main St"
                {...register("address")}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <COMP.Label htmlFor="phoneNumber">Phone Number</COMP.Label>
              <COMP.Input
                id="phoneNumber"
                placeholder="123-456-7890"
                {...register("phoneNumber")}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <COMP.Label htmlFor="preferences">Preferences</COMP.Label>
              <COMP.Textarea
                id="preferences"
                placeholder="Your preferences..."
                {...register("preferences")}
                disabled={loading}
              />
            </div>

            <COMP.Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
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
            </COMP.Button>
          </form>
        </COMP.CardContent>

        <COMP.CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Complete your profile to get started.
          </p>
        </COMP.CardFooter>
      </COMP.Card>
    </div>
  );
};

export { ProfileCreationForm };
