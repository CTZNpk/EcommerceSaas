import {
  register,
  login,
  handleGoogleAuth,
} from "@controllers/auth_controller";
import {
  confirmVerification,
  sendVerification,
  verifyEmail,
} from "@controllers/email_controller";
import { updateProfile, uploadImage } from "@controllers/profile_controller";
import { authMiddleware } from "@middlewares/authMiddleware";
import { validateEmailPasswordMiddleware } from "@middlewares/validateEmailAndPasswordMiddleware";
import express from "express";
import multer from "multer";
import passport from "passport";

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.post("/register", validateEmailPasswordMiddleware, register);
userRouter.post("/login", validateEmailPasswordMiddleware, login);
userRouter.post("/update", authMiddleware, updateProfile);
userRouter.post("/upload", authMiddleware, upload.single("image"), uploadImage);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/send-verification", authMiddleware, sendVerification);
userRouter.post("/confirm-verification", authMiddleware, confirmVerification);
userRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleAuth,
);
userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

export default userRouter;
