import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200">
      <AdminSidebar />
      <div className="flex-1 md:ml-64">{children}</div>
    </div>
  );
}
