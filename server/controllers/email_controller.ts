import User from "@models/user";
import { generateAccessToken } from "@services/auth_services";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { CustomRequest } from "@middlewares/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function sendVerification(req: CustomRequest, res: Response) {
  try {
    const { email } = req.body;

    const userId = req.userId!;

    console.log(userId);
    console.log(email);
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "This User Does Not Exist",
      });
      return;
    }

    const accessToken = generateAccessToken(userId);

    const verificationLink = `http://localhost:5173/verify-email?token=${accessToken}`;

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };

    user.verificationToken = accessToken;
    await user.save();
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: `Email Sent to email ${email}`,
    });
  } catch (error) {
    console.error("Email Send :", error);
    res.status(500).json({ message: "Error Sending Email" });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
    };

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(400).json({ message: "User not found." });
      return;
    }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
