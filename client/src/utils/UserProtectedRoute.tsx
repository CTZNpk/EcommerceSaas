import { AccountType } from "@/types/accountEnum";
import { useUserStore } from "@/store/userStore";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import LoadingScreen from "@/pages/auth/Loading";

export function UserProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const { error, loading, triggerFetch } = useFetch();

  useEffect(() => {
    const verifyUser = async () => {
      triggerFetch("/user/", {});
    };
    verifyUser();
  }, []);

  if (!user || user.accountType != AccountType.USER || error) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return LoadingScreen();
  }

  return children;
}
