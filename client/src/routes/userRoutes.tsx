import { Route } from "react-router-dom";
import MainPage from "../pages/user/MainPage";
import ViewCartPage from "../pages/user/ViewCartPage";
import ViewOrdersPage from "../pages/user/ViewOrdersPage";
import SuccessPage from "../pages/user/Success";
import CancelPage from "../pages/user/Cancel";

export const userRoutes = [
  <Route path="/" element={<MainPage />} />,
  <Route path="/cart" element={<ViewCartPage />} />,
  <Route path="/orders" element={<ViewOrdersPage />} />,
  <Route path="/order/success" element={<SuccessPage />} />,
  <Route path="/order/cancel" element={<CancelPage />} />,
];
