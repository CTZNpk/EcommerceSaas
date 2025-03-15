import { useForm } from "react-hook-form";
import * as COMP from "@/components";
import { useState, useEffect } from "react";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import resetPasswordResolver, {
  ResetPasswordFormValues,
} from "@/types/zod/resetPasswordSchema";
import { Background } from "@/components/Background";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const { error, loading, triggerFetch } = useFetch();

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: resetPasswordResolver,
  });

  const onSubmit = async (formData: ResetPasswordFormValues) => {
    setFormError("");

    if (!token) {
      setFormError(
        "Invalid or missing reset token. Please request a new password reset link.",
      );
      return;
    }

    try {
      const updatedData = {
        ...formData,
        token,
      };

      await triggerFetch("/users/reset-password", {
        method: "POST",
        body: JSON.stringify(updatedData),
      });

      setSuccess(true);
    } catch (err) {}
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
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your password has been successfully updated. You can now log in
              with your new password.
            </p>
          </div>
          <COMP.Button
            onClick={() => (window.location.href = "/login")}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Login
          </COMP.Button>
        </div>
      );
    }

    if (!token) {
      return (
        <div className="text-center space-y-6">
          <COMP.Alert variant="destructive">
            <COMP.AlertDescription>
              Invalid or missing reset token. Please request a new password
              reset link.
            </COMP.AlertDescription>
          </COMP.Alert>
          <COMP.Button
            onClick={() => (window.location.href = "/forgot-password")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Request New Reset Link
          </COMP.Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <COMP.Alert variant="destructive">
            <COMP.AlertDescription>{formError}</COMP.AlertDescription>
          </COMP.Alert>
        )}

        <div className="space-y-2">
          <COMP.Label htmlFor="password">New Password</COMP.Label>
          <COMP.Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <COMP.Label htmlFor="confirmPassword">Confirm Password</COMP.Label>
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
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </COMP.Button>
      </form>
    );
  };

  return (
    <Background className="flex items-center justify-center">
      <COMP.Card className="w-full max-w-md border-0 shadow-2xl">
        <COMP.CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <KeyRound className="h-12 w-12 text-blue-600" />
          </div>
          <COMP.CardTitle className="text-2xl font-bold text-center">
            {success ? "Success!" : "Reset Password"}
          </COMP.CardTitle>
          <COMP.CardDescription className="text-center">
            {success
              ? "Your password has been reset successfully"
              : "Enter your new password below"}
          </COMP.CardDescription>
        </COMP.CardHeader>
        <COMP.CardContent>{renderContent()}</COMP.CardContent>
      </COMP.Card>
    </Background>
  );
};

export default ResetPasswordForm;
