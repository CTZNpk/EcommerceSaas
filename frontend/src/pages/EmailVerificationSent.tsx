import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";

const EmailVerificationSent = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br 
      from-purple-100 via-purple-200 to-purple-300 dark:from-gray-700 dark:via-gray-800 
      dark:to-gray-900 p-4"
    >
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <MailCheck className="h-16 w-16 text-purple-600 mx-auto" />
          <CardTitle className="text-2xl font-bold">
            Email Verification Sent
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            We have sent a verification link to your email. Please check your
            inbox and verify your account.
          </p>

          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Go to Login
          </Button>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn’t receive an email? Check your spam folder or{" "}
            <span className="text-purple-600 hover:underline cursor-pointer">
              resend it
            </span>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { EmailVerificationSent };
