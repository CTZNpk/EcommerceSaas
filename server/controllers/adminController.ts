import User, { UserStatus } from "@models/user";
import { sendEmail } from "@services/sendEmailService";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import APIFeatures from "utils/apiFeatures";

class AdminController {
  static async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.body();

      const user = await User.findById(userId);
      if (!user || user.status == UserStatus.DELETED) {
        res.status(404).json({ message: "User Does not exist" });
        return;
      }
      user.status = UserStatus.DELETED;
      user.save();

      await sendEmail(
        user.email,
        "Your Account has been deactivated",
        `
        <h2>Your Account has been Deactivated by Admin</h2>
        <p>If you want to appeal this you can through our website</p>
      `, //TODO ADD APPEAL LINK HERE
      );

      res.status(204).json({
        message: "User Deleted Successfully",
      });
    } catch (error) {
      console.log("Error :", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async blockUser(req: Request, res: Response) {
    try {
      const { userId } = req.body();

      const user = await User.findById(userId);
      if (!user || user.status == UserStatus.DELETED) {
        res.status(404).json({ message: "User Does not exist" });
        return;
      }
      user.status = UserStatus.BLOCKED;
      user.save();

      await sendEmail(
        user.email,
        "Your Account has been blocked",
        `
        <h2>Your Account has been Blocked by Admin</h2>
        <p>If you want to appeal this you can through our website</p>
      `, //TODO ADD APPEAL LINK HERE
      );

      res.status(200).json({
        message: "User Blocked Successfully",
      });
    } catch (error) {
      console.log("Error :", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const {
        userId,
        password,
        username,
        accountType,
        address,
        profilePic,
        phoneNumber,
      } = req.body();

      const user = await User.findById(userId);
      if (!user || user.status == UserStatus.DELETED) {
        res.status(404).json({ message: "User Does not exist" });
        return;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      user.username = username || user.username;
      user.address = address || user.address;
      user.accountType = accountType || user.accountType;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.profilePic = profilePic || user.profilePic;
      user.save();

      await sendEmail(
        user.email,
        "Your Profile has been changed by the admin",
        `
        <h2>Your Profile has been updated</h2>
        <p>Your Updated Profile is: </p>
        <p>Username : ${username}</p>
        <p>Password : ${password}</p>
        <p>Address : ${address}</p>
        <p>PhoneNumber : ${phoneNumber}</p>
        <p>Account Type: ${accountType}</p>
      `, //TODO ADD APPEAL LINK HERE
      );

      res.status(200).json({
        message: "User Updated Successfully",
        data: user,
      });
    } catch (error) {
      console.log("Error :", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      let query = User.find();

      const features = new APIFeatures(query, req.query)
        .filter()
        .search("username")
        .search("accountType")
        .sort()
        .paginate();

      const users = await features.getQuery();

      const newLastId = users.length > 0 ? users[users.length - 1]._id : null;

      res.json({
        users,
        lastId: newLastId,
        hasMore: users.length === (req.query.limit || 10),
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default AdminController;
