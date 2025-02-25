import { AccountType } from "@/types/accountEnum";
import { useUserStore } from "@/store/userStore";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  //TODO CHECK THIS FROM BACKEND
  if (!user || user.accountType != AccountType.ADMIN) {
    navigate("/login");
    return null;
  }

  return children;
}
