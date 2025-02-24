import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const { error, loading, triggerFetch } = useFetch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const onSubmit = async (formData: ForgotPasswordFormValues) => {
    setFormError("");

    try {
      await triggerFetch("/users/forgot-password", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess(true);
    } catch (err) {
      // Error will be handled by the useEffect above
    }
  };

  const renderContent = () => {
    if (success) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-green-700">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We've sent you an email with instructions to reset your password.
              Please check your inbox and follow the link provided.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Don't see the email? Check your spam folder or try again.
            </p>
          </div>
          <div className="space-y-4">
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="w-full"
            >
              Try Another Email
            </Button>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Return to Login
            </Button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
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

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </form>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br 
      from-purple-100 via-purple-200 to-purple-300 dark:from-gray-700 dark:via-gray-800 
      dark:to-gray-900 p-4"
    >
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {success ? "Email Sent!" : "Forgot Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {success
              ? "Please check your email for reset instructions"
              : "Enter your email address to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
