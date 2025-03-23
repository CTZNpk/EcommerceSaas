import { Route } from "react-router-dom";
import { AdminProtectedRoute } from "@/utils/AdminProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Order";
import Products from "../pages/admin/Products";
import Analytics from "../pages/admin/Analytics";
import ChatSupport from "../pages/admin/ChatSupport";
import Settings from "../pages/admin/Settings";
import Users from "../pages/admin/Users";

export const adminRoutes = [
  <Route
    path="/dashboard"
    element={
      <AdminProtectedRoute>
        <Dashboard />
      </AdminProtectedRoute>
    }
  />,
  <Route
    path="/products"
    element={
      <AdminProtectedRoute>
        <Products />
      </AdminProtectedRoute>
    }
  />,
  <Route
    path="/users"
    element={
      <AdminProtectedRoute>
        <Users />
      </AdminProtectedRoute>
    }
  />,
  <Route
    path="/analytics"
    element={
      <AdminProtectedRoute>
        <Analytics />
      </AdminProtectedRoute>
    }
  />,
  <Route
    path="/chat"
    element={
      <AdminProtectedRoute>
        <ChatSupport />
      </AdminProtectedRoute>
    }
  />,
  <Route
    path="/settings"
    element={
      <AdminProtectedRoute>
        <Settings />
      </AdminProtectedRoute>
    }
  />,
  <Route
    path="/orders"
    element={
      <AdminProtectedRoute>
        <Orders />
      </AdminProtectedRoute>
    }
  />,
];
