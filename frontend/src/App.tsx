import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignupForm } from "./pages/SignUpForm";
import { LoginForm } from "./pages/LoginForm";
import { EmailVerificationSent } from "./pages/EmailVerificationSent";
import { ProfileCreationForm } from "./pages/ProfileCreationForm";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPasswordForm from "./pages/ResetPassword";
import ForgotPasswordForm from "./pages/ForgotPassword";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Order";
import Products from "./pages/admin/Products";
import Analytics from "./pages/admin/Analytics";
import ChatSupport from "./pages/admin/ChatSupport";
import Settings from "./pages/admin/Settings";
import Users from "./pages/admin/Users";

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
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<Users />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chat" element={<ChatSupport />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
