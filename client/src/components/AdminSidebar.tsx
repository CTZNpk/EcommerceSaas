import { Link } from "react-router-dom";
import {
  BarChart,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

export function AdminSidebar() {
  return (
    <div
      className="hidden md:flex h-screen w-64 flex-col fixed 
      inset-y-0 z-50 border-r bg-prim "
    >
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-light items-center flex justify-center">
          Admin Panel
        </h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {[
            { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/orders", icon: ShoppingCart, label: "Orders" },
            { to: "/products", icon: Package, label: "Products" },
            { to: "/users", icon: Users, label: "Users" },
            { to: "/analytics", icon: BarChart, label: "Analytics" },
            { to: "/chat", icon: MessageSquare, label: "Chat Support" },
            { to: "/settings", icon: Settings, label: "Settings" },
          ].map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 
                text-light transition-all hover:bg-hover"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
