import {
  register,
  login,
  handleGoogleAuth,
} from "@controllers/auth_controller";
import {
  confirmVerification,
  resetPasssword,
  sendResetPassword,
  sendVerification,
  verifyEmail,
} from "@controllers/email_controller";
import { updateProfile, uploadImage } from "@controllers/profile_controller";
import { auth } from "@middlewares/auth";
import { validateEmailPasswordMiddleware } from "@middlewares/validateEmailAndPasswordMiddleware";
import express from "express";
import multer from "multer";
import passport from "passport";

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.post("/register", validateEmailPasswordMiddleware, register);
userRouter.post("/login", validateEmailPasswordMiddleware, login);
userRouter.post("/update", auth, updateProfile);
userRouter.post("/upload", auth, upload.single("image"), uploadImage);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/send-verification", auth, sendVerification);
userRouter.post("/confirm-verification", auth, confirmVerification);
userRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleAuth,
);
userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
userRouter.post("/reset-password", resetPasssword);
userRouter.post("/forgot-password", sendResetPassword);

export default userRouter;
