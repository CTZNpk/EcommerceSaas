import { Route } from "react-router-dom";
import MainPage from "../pages/user/MainPage";
import ViewCartPage from "../pages/user/ViewCartPage";
import ViewOrdersPage from "../pages/user/ViewOrdersPage";
import SuccessPage from "../pages/user/Success";
import CancelPage from "../pages/user/Cancel";
import { UserProtectedRoute } from "@/utils/UserProtectedRoute";

export const userRoutes = [
  <Route
    path="/"
    element={
      <UserProtectedRoute>
        <MainPage />
      </UserProtectedRoute>
    }
  />,
  <Route
    path="/cart"
    element={
      <UserProtectedRoute>
        <ViewCartPage />
      </UserProtectedRoute>
    }
  />,
  <Route
    path="/orders"
    element={
      <UserProtectedRoute>
        <ViewOrdersPage />
      </UserProtectedRoute>
    }
  />,
  <Route
    path="/order/success"
    element={
      <UserProtectedRoute>
        <SuccessPage />
      </UserProtectedRoute>
    }
  />,
  <Route
    path="/order/cancel"
    element={
      <UserProtectedRoute>
        <CancelPage />
      </UserProtectedRoute>
    }
  />,
];
