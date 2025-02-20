import { register, login } from "@controllers/auth_controller";
import { updateProfile } from "@controllers/profile_controller";
import { authMiddleware } from "@middlewares/authMiddleware";
import { validateEmailPasswordMiddleware } from "@middlewares/validateEmailAndPasswordMiddleware";
import express from "express";

const userRouter = express.Router();

userRouter.post("/register", validateEmailPasswordMiddleware, register);
userRouter.post("/login", validateEmailPasswordMiddleware, login);
userRouter.post("/update", authMiddleware, updateProfile);

export default userRouter;
