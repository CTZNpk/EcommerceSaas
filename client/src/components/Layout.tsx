import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Background } from "./Background";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Background>
      <AdminSidebar />
      <div className="flex-1 md:ml-64">{children}</div>
    </Background>
  );
}
