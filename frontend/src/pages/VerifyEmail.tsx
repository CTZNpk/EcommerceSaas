import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const { triggerFetch } = useFetch();

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get("token");
      if (!token) return setMessage("Invalid token.");

      try {
        const data = await triggerFetch("/users/verify-email", {
          body: JSON.stringify({ token: token }),
        });
        setMessage(data);
      } catch (error) {
        setMessage("Verification failed.");
      }
    };

    verifyUser();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <p className="font-bold text-2xl">{message}</p>
    </div>
  );
};

export default VerifyEmail;
