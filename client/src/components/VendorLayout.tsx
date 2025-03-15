import type { ReactNode } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { Background } from "./Background";

interface LayoutProps {
  children: ReactNode;
}

export function VendorLayout({ children }: LayoutProps) {
  return (
    <Background>
      <VendorSidebar />
      <div className="flex-1 md:ml-64">{children}</div>
    </Background>
  );
}
