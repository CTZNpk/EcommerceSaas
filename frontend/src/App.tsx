import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignupForm } from "./pages/auth/SignUpForm";
import { LoginForm } from "./pages/auth/LoginForm";
import { EmailVerificationSent } from "./pages/auth/EmailVerificationSent";
import { ProfileCreationForm } from "./pages/auth/ProfileCreationForm";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPasswordForm from "./pages/auth/ResetPassword";
import ForgotPasswordForm from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Order";
import Products from "./pages/admin/Products";
import Analytics from "./pages/admin/Analytics";
import ChatSupport from "./pages/admin/ChatSupport";
import Settings from "./pages/admin/Settings";
import Users from "./pages/admin/Users";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorChatSupport from "./pages/vendor/VendorChatSupport";
import VendorSettings from "./pages/vendor/VendorSettings";
import CreateProduct from "./pages/vendor/CreateProduct";
import ViewProduct from "./pages/vendor/ViewProductScreen";
import VendorProductView from "./pages/vendor/ViewProductScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/verification" element={<EmailVerificationSent />} />
        <Route path="/profile-creation" element={<ProfileCreationForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<Users />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chat" element={<ChatSupport />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/analytics" element={<VendorAnalytics />} />
        <Route path="/vendor/chat" element={<VendorChatSupport />} />
        <Route path="/vendor/settings" element={<VendorSettings />} />
        <Route path="/vendor/products/new" element={<CreateProduct />} />
        <Route path="/product/:productId" element={<VendorProductView />} />
      </Routes>
    </Router>
  );
}

export default App;
