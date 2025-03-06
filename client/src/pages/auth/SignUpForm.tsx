import { useForm } from "react-hook-form";
import * as COMP from "@/components";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { AccountType } from "@/types/accountEnum";
import { useUserStore } from "@/store/userStore";
import signupResolver, { SignupFormValues } from "@/types/zod/signupSchema";
import { Background } from "@/components/Background";

const SignupForm = () => {
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<SignupFormValues>({ resolver: signupResolver });

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
    window.location.href = "http://localhost:3000/api/v1/auth/google";
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
        "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
        true,
      );

      if (data && !fetchError) {
        setUser(data);
        navigateToProfileCreationScreen();
      }
    } catch (err) {
      setFormError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <Background className="flex items-center justify-center">
      <COMP.Card className="w-full max-w-md border-0 shadow-2xl">
        <COMP.CardHeader className="space-y-1">
          <COMP.CardTitle className="text-2xl font-bold text-center">
            Create Account
          </COMP.CardTitle>
          <COMP.CardDescription className="text-center">
            Fill in your details to create a new account
          </COMP.CardDescription>
        </COMP.CardHeader>
        <COMP.CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formError && (
              <COMP.Alert variant="destructive">
                <COMP.AlertDescription>{formError}</COMP.AlertDescription>
              </COMP.Alert>
            )}

            <div className="space-y-2">
              <COMP.Label htmlFor="username">Username</COMP.Label>
              <COMP.Input
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
              <COMP.Label htmlFor="email">Email</COMP.Label>
              <COMP.Input
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
              <COMP.Label>Account Type</COMP.Label>
              <COMP.Select
                onValueChange={(value) =>
                  setValue("accountType", value as AccountType)
                }
                disabled={loading}
              >
                <COMP.SelectTrigger
                  className={errors.accountType ? "border-red-500" : ""}
                >
                  <COMP.SelectValue placeholder="Select account type" />
                </COMP.SelectTrigger>
                <COMP.SelectContent>
                  <COMP.SelectItem value="user">User Account</COMP.SelectItem>
                  <COMP.SelectItem value="vendor">
                    Vendor Account
                  </COMP.SelectItem>
                </COMP.SelectContent>
              </COMP.Select>
              {errors.accountType && (
                <p className="text-sm text-red-500">
                  {errors.accountType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <COMP.Label htmlFor="password">Password</COMP.Label>
              <COMP.Input
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
              <COMP.Label htmlFor="confirmPassword">
                Confirm Password
              </COMP.Label>
              <COMP.Input
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

            <COMP.Button
              type="submit"
              className="w-full bg-prim hover:bg-hover"
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
            </COMP.Button>
          </form>
        </COMP.CardContent>
        <COMP.CardFooter className="flex flex-col space-y-4">
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

          <COMP.Button
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={continueWithGoogle}
          >
            Continue with Google
          </COMP.Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              className="text-prim hover:text-hover hover:underline focus:outline-none"
              disabled={loading}
              onClick={navigateToLogin}
            >
              Sign in
            </button>
          </p>
        </COMP.CardFooter>
      </COMP.Card>
    </Background>
  );
};

export { SignupForm };
