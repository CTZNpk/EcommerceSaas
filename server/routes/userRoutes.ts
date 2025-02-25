import { ProfileController } from "@controllers/index";
import { auth } from "@middlewares/auth";
import express from "express";
import { upload } from "config/multerConfig";

const userRouter = express.Router();

userRouter.post("/update", auth, ProfileController.updateProfile);
userRouter.post(
  "/upload",
  auth,
  upload.single("image"),
  ProfileController.uploadImage,
);

export default userRouter;
