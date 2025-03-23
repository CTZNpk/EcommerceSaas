import { Route } from "react-router-dom";
import { SignupForm } from "../pages/auth/SignUpForm";
import { LoginForm } from "../pages/auth/LoginForm";
import { EmailVerificationSent } from "../pages/auth/EmailVerificationSent";
import { ProfileCreationForm } from "../pages/auth/ProfileCreationForm";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPasswordForm from "../pages/auth/ResetPassword";
import ForgotPasswordFormValues from "../pages/auth/ForgotPassword";

export const authRoutes = [
  <Route key="signup" path="/signup" element={<SignupForm />} />,
  <Route key="login" path="/login" element={<LoginForm />} />,
  <Route
    key="verification"
    path="/verification"
    element={<EmailVerificationSent />}
  />,
  <Route
    key="profile-creation"
    path="/profile-creation"
    element={<ProfileCreationForm />}
  />,
  <Route key="verify-email" path="/verify-email" element={<VerifyEmail />} />,
  <Route
    key="reset-password"
    path="/reset-password"
    element={<ResetPasswordForm />}
  />,
  <Route
    key="forgot-password"
    path="/forgot-password"
    element={<ForgotPasswordFormValues />}
  />,
];
