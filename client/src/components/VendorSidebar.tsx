import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart,
  Settings,
  MessageSquare,
} from "lucide-react";

export function VendorSidebar() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path, { replace: true });
  };
  return (
    <div
      className="hidden md:flex h-screen w-64 flex-col fixed 
      inset-y-0 z-50 border-r bg-prim"
    >
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-light items-center flex justify-center">
          Vendor Panel
        </h2>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {[
            {
              to: "/vendor/dashboard",
              icon: LayoutDashboard,
              label: "Dashboard",
            },
            { to: "/vendor/products", icon: Package, label: "My Products" },
            { to: "/vendor/orders", icon: ShoppingCart, label: "Orders" },
            { to: "/vendor/analytics", icon: BarChart, label: "Analytics" },
            { to: "/vendor/chat", icon: MessageSquare, label: "Chat Support" },
            { to: "/vendor/settings", icon: Settings, label: "Settings" },
          ].map(({ to, icon: Icon, label }) => (
            <button
              key={to}
              onClick={() => handleNavigation(to)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 
              text-light dark:text-gray-300 transition-all 
              hover:bg-hover"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
