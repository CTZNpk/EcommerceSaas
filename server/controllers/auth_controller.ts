import { Response, Request } from "express";
import User, { IUser } from "@models/user";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@services/auth_services";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password, accountType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = new User({
      email,
      username,
      password: hashedPassword,
      accountType,
      isActive: true,
    });

    const createdUser = await User.create(newUser);
    const accessToken = generateAccessToken(String(createdUser._id));
    const refreshToken = generateRefreshToken(String(createdUser._id));

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, //15 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        accountType: createdUser.accountType,
      },
    });
  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = generateAccessToken(String(user._id));

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, //15 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });
    res.status(201).json({
      message: "User login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
