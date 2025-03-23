import { Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Order";
import Products from "../pages/admin/Products";
import Analytics from "../pages/admin/Analytics";
import ChatSupport from "../pages/admin/ChatSupport";
import Settings from "../pages/admin/Settings";
import Users from "../pages/admin/Users";

export const adminRoutes = [
  <Route path="/dashboard" element={<Dashboard />} />,
  <Route path="/products" element={<Products />} />,
  <Route path="/users" element={<Users />} />,
  <Route path="/analytics" element={<Analytics />} />,
  <Route path="/chat" element={<ChatSupport />} />,
  <Route path="/settings" element={<Settings />} />,
  <Route path="/orders" element={<Orders />} />,
];
