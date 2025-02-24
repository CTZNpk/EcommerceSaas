import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { AccountType } from "@/interfaces/accountEnum";
import { useUserStore } from "@/store/userStore";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens",
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9\s]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
    accountType: z.nativeEnum(AccountType, {
      required_error: "Please select an account type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  //TODO Change this later
  const navigateToProfileCreationScreen = () => {
    navigate("/profile-creation");
  };

  const continueWithGoogle = async () => {
    setFormError("");
  window.location.href = "http://localhost:3000/api/v1/users/google"; 
    // try {
    //   const data = await triggerFetch(
    //     "/users/google",
    //     {
    //       method: "GET",
    //     },
    //     true,
    //   );
    //   if (data && !fetchError) {
    //     setUser(data);
    //     navigateToProfileCreationScreen();
    //   }
    // } catch (err) {
    //   setFormError("Unable to connect to the server. Please try again.");
    // }
  };

  const { error: fetchError, loading, triggerFetch } = useFetch();

  useEffect(() => {
    if (fetchError) {
      setFormError(fetchError);
    }
  }, [fetchError, setError]);

  const onSubmit = async (formData: SignupFormValues) => {
    setFormError(""); // Clear previous errors
    try {

      const data = await triggerFetch(
        "/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
        true,
      );

      console.log(data);
      if (data && !fetchError) {
        setUser(data);
        navigateToProfileCreationScreen();
      }
    } catch (err) {
      setFormError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br 
      from-purple-100 via-purple-200 to-purple-300 dark:from-gray-700 dark:via-gray-800 
      dark:to-gray-900 p-4"
    >
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Fill in your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                {...register("username")}
                className={errors.username ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select
                onValueChange={(value) =>
                  setValue("accountType", value as AccountType)
                }
                disabled={loading}
              >
                <SelectTrigger
                  className={errors.accountType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User Account</SelectItem>
                  <SelectItem value="vendor">Vendor Account</SelectItem>
                </SelectContent>
              </Select>
              {errors.accountType && (
                <p className="text-sm text-red-500">
                  {errors.accountType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={continueWithGoogle}
          >
            Continue with Google
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              className="text-purple-600 hover:text-purple-700 hover:underline focus:outline-none"
              disabled={loading}
              onClick={navigateToLogin}
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export { SignupForm };
