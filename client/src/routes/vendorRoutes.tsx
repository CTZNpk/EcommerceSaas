import { Route } from "react-router-dom";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorOrders from "../pages/vendor/VendorOrders";
import VendorProducts from "../pages/vendor/VendorProducts";
import VendorAnalytics from "../pages/vendor/VendorAnalytics";
import VendorChatSupport from "../pages/vendor/VendorChatSupport";
import VendorSettings from "../pages/vendor/VendorSettings";
import CreateProduct from "../pages/vendor/CreateProduct";

export const vendorRoutes = [
  <Route path="/vendor/dashboard" element={<VendorDashboard />} />,
  <Route path="/vendor/orders" element={<VendorOrders />} />,
  <Route path="/vendor/products" element={<VendorProducts />} />,
  <Route path="/vendor/analytics" element={<VendorAnalytics />} />,
  <Route path="/vendor/chat" element={<VendorChatSupport />} />,
  <Route path="/vendor/settings" element={<VendorSettings />} />,
  <Route path="/vendor/products/new" element={<CreateProduct />} />,
];
