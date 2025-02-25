import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as COMP from "@/components";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

const loginSchema = z.object({
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
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const { error: fetchError, loading, triggerFetch } = useFetch();
  const { setUser } = useUserStore();

  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (fetchError) {
      setFormError(fetchError);
    }
  }, [fetchError, setError]);

  const continueWithGoogle = async () => {
    setFormError("");
    try {
      const data = await triggerFetch(
        "/users/google",
        {
          method: "GET",
        },
        true,
      );
      if (data && !fetchError) {
        setUser(data);
        navigateToDashboard();
      }
    } catch (err) {
      setFormError("Unable to connect to the server. Please try again.");
    }
  };

  const onSubmit = async (formData: LoginFormValues) => {
    setFormError("");
    try {
      const data = await triggerFetch(
        "/users/login",
        {
          method: "POST",
          body: JSON.stringify(formData),
        },
        true,
      );
      if (data && !fetchError) {
        //TODO
        setUser(data);
        navigateToDashboard();
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
      <COMP.Card className="w-full max-w-md border-0 shadow-2xl">
        <COMP.CardHeader className="space-y-1">
          <COMP.CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </COMP.CardTitle>
          <COMP.CardDescription className="text-center">
            Enter your credentials to access your account
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

            <COMP.Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
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
            Don't have an account?{" "}
            <button
              type="button"
              className="text-purple-600 hover:text-purple-700 hover:underline focus:outline-none"
              disabled={loading}
              onClick={navigateToDashboard}
            >
              Sign up
            </button>
          </p>
        </COMP.CardFooter>
      </COMP.Card>
    </div>
  );
};

export { LoginForm };
