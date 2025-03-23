import { Route } from "react-router-dom";
import ProductView from "../pages/product/ProductView";
import StripePaymentScreen from "../pages/stripe/CheckoutForm";

export const productRoutes = [
  <Route path="/product/:productId" element={<ProductView />} />,
  <Route path="/checkout" element={<StripePaymentScreen />} />,
];
