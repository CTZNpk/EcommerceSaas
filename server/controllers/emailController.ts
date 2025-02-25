import User, { UserStatus } from "@models/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "@middlewares/auth";
import bcrypt from "bcrypt";
import { generateRefreshToken } from "utils/authUtils";
import { ENV } from "config/env";
import { sendEmail } from "@services/sendEmailService";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

class EmailController {
  static async sendResetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          message: "This User Does Not Exist",
        });
        return;
      }

      const accessToken = generateRefreshToken(user.id);

      const verificationLink = `http://localhost:5173/reset-password?token=${accessToken}`;

      await sendEmail(
        email,
        "Reset Password",
        `
        <h2>Reset Password</h2>
        <p>Click below to change your Password:</p>
        <a href="${verificationLink}">Change Password</a>
      `,
      );

      user.verificationToken = accessToken;
      await user.save();
      res.status(200).json({
        message: `Email Sent to email ${email}`,
      });
    } catch (error) {
      console.error("Email Send :", error);
      res.status(500).json({ message: "Error Sending Email" });
    }
  }

  static async resetPasssword(req: Request, res: Response) {
    const { token, password } = req.body;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
      };

      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(400).json({ message: "User not found." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.verificationToken = null;
      await user.save();

      res.status(200).json({ message: "Password Changed Successfully!" });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async sendVerification(req: CustomRequest, res: Response) {
    try {
      const { email } = req.body;

      const userId = req.userId!;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          message: "This User Does Not Exist",
        });
        return;
      }

      const accessToken = generateRefreshToken(userId);

      const verificationLink = `${ENV.CLIENT_URL}/verify-email?token=${accessToken}`;

      await sendEmail(
        email,
        "Verify Your Email",
        `
        <h2>Email Verification</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
      );

      user.verificationToken = accessToken;
      await user.save();
      res.status(200).json({
        message: `Email Sent to email ${email}`,
      });
    } catch (error) {
      console.error("Email Send :", error);
      res.status(500).json({ message: "Error Sending Email" });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token } = req.body;
    console.log(token);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
      };

      console.log(decoded.id);
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(400).json({ message: "User not found." });
        return;
      }
      user.status = UserStatus.VERIFIED;
      user.verificationToken = null;
      await user.save();

      res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async confirmVerification(req: CustomRequest, res: Response) {
    const userId = req.userId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(400).json({ message: "User not found." });
        return;
      }

      res.status(200).json({
        message: "Request Successful!",
        data: { verified: user.status == UserStatus.VERIFIED },
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default EmailController;
