import { useNavigate } from "react-router-dom";
import * as COMP from "@/components";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { MailCheck, AlertCircle, Loader2 } from "lucide-react";

const EmailVerificationSent = () => {
  const navigate = useNavigate();
  const { loading, error, triggerFetch } = useFetch();
  const [verificationError, setVerificationError] = useState("");
  const { user } = useUserStore();

  useEffect(() => {
    const sendVerification = async () => {
      try {
        const result = await triggerFetch(
          "/users/send-verification",
          {
            method: "POST",
            body: JSON.stringify({
              email: user?.email,
            }),
          },
          true,
        );
        console.log(result);
      } catch (err) {
        setVerificationError("Failed to verify email. Please try again later.");
      }
    };
    sendVerification();
  }, []);

  const confirmVerification = async () => {
    try {
      const result = await triggerFetch(
        "/users/confirm-verification",
        {
          method: "POST",
        },
        true,
      );
      if (result.verified === true) {
        navigate("/dashboard");
      } else {
        setVerificationError(
          "Email verification is pending. Please check your email and verify your account before proceeding.",
        );
      }
    } catch (err) {
      setVerificationError("Failed to verify email. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 p-4">
      <COMP.Card className="w-full max-w-md border-0 shadow-2xl">
        <COMP.CardHeader className="space-y-4 text-center">
          <MailCheck className="h-16 w-16 text-purple-600 mx-auto" />
          <COMP.CardTitle className="text-2xl font-bold">
            Email Verification Sent
          </COMP.CardTitle>
        </COMP.CardHeader>
        <COMP.CardContent className="space-y-6 text-center">
          {error && (
            <COMP.Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <COMP.AlertDescription>
                {error ||
                  "An error occurred during verification. Please try again."}
              </COMP.AlertDescription>
            </COMP.Alert>
          )}

          {verificationError && (
            <COMP.Alert variant="default" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <COMP.AlertDescription>{verificationError}</COMP.AlertDescription>
            </COMP.Alert>
          )}

          <p className="text-gray-700 dark:text-gray-300">
            We have sent a verification link to your email. Please check your
            inbox and verify your account.
          </p>

          <COMP.Button
            onClick={confirmVerification}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Proceed"
            )}
          </COMP.Button>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive an email? Check your spam folder or{" "}
            <COMP.Button
              variant="link"
              className="text-purple-600 hover:underline p-0 h-auto font-normal"
              onClick={() => triggerFetch("/resend-verification", {}, true)}
              disabled={loading}
            >
              resend it
            </COMP.Button>
            .
          </p>
        </COMP.CardContent>
      </COMP.Card>
    </div>
  );
};

export { EmailVerificationSent };
