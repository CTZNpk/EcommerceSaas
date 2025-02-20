import { register, login } from "@controllers/auth_controller";
import { updateProfile, uploadImage } from "@controllers/profile_controller";
import { authMiddleware } from "@middlewares/authMiddleware";
import { validateEmailPasswordMiddleware } from "@middlewares/validateEmailAndPasswordMiddleware";
import express from "express";
import multer from "multer";

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.post("/register", validateEmailPasswordMiddleware, register);
userRouter.post("/login", validateEmailPasswordMiddleware, login);
userRouter.post("/update", authMiddleware, updateProfile);
userRouter.post("/upload", authMiddleware, upload.single("image"), uploadImage);

export default userRouter;
