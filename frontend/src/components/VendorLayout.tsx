import type { ReactNode } from "react";
import { VendorSidebar } from "./VendorSidebar";

interface LayoutProps {
  children: ReactNode;
}

export function VendorLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200">
      <VendorSidebar />
      <div className="flex-1 md:ml-64">{children}</div>
    </div>
  );
}
