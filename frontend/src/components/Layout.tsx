import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
      <AdminSidebar />
      <div className="flex-1 md:ml-64">{children}</div>
    </div>
  );
}
