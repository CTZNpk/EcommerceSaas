import { ProfileController } from "@controllers/index";
import { auth, isUser } from "@middlewares/auth";
import express, { Request, Response } from "express";
import { upload } from "config/multerConfig";

const userRouter = express.Router();

userRouter.get("/", auth, isUser, (_: Request, res: Response) => {
  res.status(200).json({ data: "Certified User" });
});
userRouter.post("/update", auth, ProfileController.updateProfile);
userRouter.post(
  "/upload",
  auth,
  upload.single("image"),
  ProfileController.uploadProfilePic,
);

userRouter.get("/:userId", auth, ProfileController.getProfileFromId);

export default userRouter;
