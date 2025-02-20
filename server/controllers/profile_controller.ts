import { CustomRequest } from "@middlewares/authMiddleware";
import User from "@models/user";
import { Response, Request } from "express";
import fs from "fs";
import cloudinary from "index";

export async function updateProfile(req: CustomRequest, res: Response) {
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
    existingUser.imageUrl = imageUrl || existingUser.imageUrl;
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
        imageUrl: existingUser.imageUrl,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

interface MulterRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export async function uploadImage(req: Request, res: Response) {
  try {
    const multerReq = req as MulterRequest;
    if (!multerReq.file) {
      res.status(400).json({ message: "No image provided" });
      return;
    }

    const result = await cloudinary.uploader.upload(multerReq.file.path, {
      folder: "your-folder",
    });

    fs.unlinkSync(multerReq.file.path);

    res.status(200).json({
      message: "Image uploaded successfully",
      data: {
        imageUrl: result.secure_url,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
}

