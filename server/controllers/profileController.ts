import { CustomRequest } from "@middlewares/auth";
import User from "@models/user";
import { Response, Request } from "express";
import { uploadImageToCloudinary } from "@services/uploadImage";
import { MulterRequest } from "@services/uploadImage";

class ProfileController {
  static async updateProfile(req: CustomRequest, res: Response) {
    try {
      const { username, address, phoneNumber, imageUrl } = req.body;
      const userId = req.userId;

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        res.status(404).json({ message: "User does not exist" });
        return;
      }

      existingUser.username = username || existingUser.username;
      existingUser.address = address || existingUser.address;
      existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
      existingUser.profilePic = imageUrl || existingUser.profilePic;
      await existingUser.save();

      res.status(200).json({
        message: "User updated successfully",
        data: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          accountType: existingUser.accountType,
          phoneNumber: existingUser.phoneNumber,
          address: existingUser.address,
          profilePic: existingUser.profilePic,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async uploadProfilePic(req: Request, res: Response) {
    try {
      const multerReq = req as MulterRequest;
      if (!multerReq.file) {
        res.status(400).json({ message: "No image provided" });
        return;
      }
      const result = await uploadImageToCloudinary("profile-pic", multerReq);

      res.status(200).json({
        message: "Image uploaded successfully",
        data: {
          imageUrl: result,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Image upload failed" });
    }
  }

  static async getProfileFromId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const user = await User.findById(userId).select("username _id profilePic"); // Only fetch name, id, and profilePic

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res
        .status(200)
        .json({ message: "Successfully Retrieved User", data: user });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }
}

export default ProfileController;
