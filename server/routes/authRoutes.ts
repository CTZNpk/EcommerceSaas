import { auth, validateEmailPassword } from "@middlewares/index";
import express from "express";
import passport from "passport";
import {
  AuthController,
  EmailController,
} from "controllers";

const authRouter = express.Router();

authRouter.post("/register", validateEmailPassword, AuthController.register);
authRouter.post("/login", validateEmailPassword, AuthController.login);

authRouter.post("/verify-email", EmailController.verifyEmail);
authRouter.post("/send-verification", auth, EmailController.sendVerification);
authRouter.post(
  "/confirm-verification",
  auth,
  EmailController.confirmVerification,
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.handleGoogleAuth,
);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.post("/reset-password", EmailController.resetPasssword);
authRouter.post("/forgot-password", EmailController.sendResetPassword);

export default authRouter;
