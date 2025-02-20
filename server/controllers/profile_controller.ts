import { CustomRequest } from "@middlewares/authMiddleware";
import User from "@models/user";
import { Response } from "express";

export async function updateProfile(req: CustomRequest, res: Response) {
  try {
    const { username, address, phoneNumber } = req.body;
    const userId = req.userId;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    existingUser.username = username || existingUser.username;
    existingUser.address = address || existingUser.address;
    existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
    await existingUser.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        accountType: existingUser.accountType,
        phoneNumber: existingUser.phoneNumber,
        address: existingUser.address,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
