import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { Background } from "@/components/Background";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const { triggerFetch } = useFetch();

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get("token");
      console.log(token);
      if (!token) return setMessage("Invalid token.");

      try {
        const data = await triggerFetch("/users/verify-email", {
          method: "POST",
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
    <Background>
      <p className="font-bold text-2xl">{message}</p>
    </Background>
  );
};

export default VerifyEmail;
