import { Response, Request } from "express";
import User, { IUser, UserStatus } from "@models/user";
import bcrypt from "bcrypt";
import { attachAccessToken, attachRefreshToken } from "utils/authUtils";
import { createUserFromGoogle } from "@services/authServices";
import { Profile } from "passport";

class AuthController {
  static async register(req: Request, res: Response) {
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

      attachAccessToken(res, newUser._id as string, newUser.accountType);
      attachRefreshToken(res, newUser._id as string, newUser.accountType);

      res.status(201).json({
        message: "User registered successfully",
        data: {
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

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || user.status == UserStatus.DELETED) {
        res.status(401).json({ message: "Invalid Credentials" });
        return;
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid Credentials" });
        return;
      }

      attachAccessToken(res, user._id as string, user.accountType);
      attachRefreshToken(res, user._id as string, user.accountType);

      res.status(200).json({
        message: "User login successful",
        data: {
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

  static async handleGoogleAuth(req: Request, res: Response) {
    try {
      const profile = req.user as Profile;

      let isNew = false;
      let user = await User.findOne({ email: profile?.emails?.[0]?.value });
      if (!user) {
        isNew = true;
        user = await createUserFromGoogle(profile!);
      }

      attachAccessToken(res, user._id as string, user.accountType);
      attachRefreshToken(res, user._id as string, user.accountType);

      if (isNew) {
        res.redirect("http://localhost:5173/");
      } else {
        res.redirect("http://localhost:5173/dashboard");
      }
    } catch (error) {
      console.log("Registration error:", error);
      res.json({ message: "Internal Server Error" });
      res.redirect("http://localhost:5173/login");
    }
  }
}

export default AuthController;
