import { Route } from "react-router-dom";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorOrders from "../pages/vendor/VendorOrders";
import VendorProducts from "../pages/vendor/VendorProducts";
import VendorAnalytics from "../pages/vendor/VendorAnalytics";
import VendorChatSupport from "../pages/vendor/VendorChatSupport";
import VendorSettings from "../pages/vendor/VendorSettings";
import CreateProduct from "../pages/vendor/CreateProduct";
import { VendorProtectedRoute } from "@/utils/VendorProtectedRoute";

export const vendorRoutes = [
  <Route
    path="/vendor/dashboard"
    element={
      <VendorProtectedRoute>
        <VendorDashboard />
      </VendorProtectedRoute>
    }
  />,
  <Route
    path="/vendor/orders"
    element={
      <VendorProtectedRoute>
        <VendorOrders />
      </VendorProtectedRoute>
    }
  />,
  <Route
    path="/vendor/products"
    element={
      <VendorProtectedRoute>
        <VendorProducts />
      </VendorProtectedRoute>
    }
  />,
  <Route
    path="/vendor/analytics"
    element={
      <VendorProtectedRoute>
        <VendorAnalytics />
      </VendorProtectedRoute>
    }
  />,
  <Route
    path="/vendor/chat"
    element={
      <VendorProtectedRoute>
        <VendorChatSupport />
      </VendorProtectedRoute>
    }
  />,
  <Route
    path="/vendor/settings"
    element={
      <VendorProtectedRoute>
        <VendorSettings />
      </VendorProtectedRoute>
    }
  />,
  <Route
    path="/vendor/products/new"
    element={
      <VendorProtectedRoute>
        <CreateProduct />
      </VendorProtectedRoute>
    }
  />,
];
