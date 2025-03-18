import { useForm } from "react-hook-form";
import * as COMP from "@/components";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import loginResolver, { LoginFormValues } from "@/types/zod/loginFormSchema";
import { Background } from "@/components/Background";

const LoginForm = () => {
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({ resolver: loginResolver });

  const { error: fetchError, loading, triggerFetch } = useFetch();
  const { setUser } = useUserStore();

  const navigate = useNavigate();

  const navigateToSignup = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (fetchError) {
      setFormError(fetchError);
    }
  }, [fetchError, setError]);

  const continueWithGoogle = async () => {
    setFormError("");
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  };

  const onSubmit = async (formData: LoginFormValues) => {
    setFormError("");
    try {
      const data = await triggerFetch(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(formData),
        },
        true,
      );
      if (data && !fetchError) {
        //TODO
        setUser(data);
        navigateToSignup();
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
              className="w-full bg-prim hover:bg-hover"
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
              className="text-prim hover:text-hover hover:underline focus:outline-none"
              disabled={loading}
              onClick={navigateToSignup}
            >
              Sign up
            </button>
          </p>
        </COMP.CardFooter>
      </COMP.Card>
    </Background>
  );
};

export { LoginForm };
