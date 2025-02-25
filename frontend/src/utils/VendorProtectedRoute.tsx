import { AccountType } from "@/types/accountEnum";
import { useUserStore } from "@/store/userStore";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import LoadingScreen from "@/pages/Loading";

export function VendorProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const { error, loading, triggerFetch } = useFetch();

  useEffect(() => {
    const verifyUser = async () => {
      triggerFetch("/admin/", {});
    };
    verifyUser();
  }, []);

  if (!user || user.accountType != AccountType.VENDOR || error) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return LoadingScreen();
  }

  return children;
}
