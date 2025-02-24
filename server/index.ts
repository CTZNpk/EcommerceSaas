import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "@routes/user_routes";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  createUserFromGoogle,
  generateAccessToken,
  generateRefreshToken,
} from "@services/auth_services";
import User from "@models/user";

dotenv.config();

const app = express();

const port = 3000;

const mongoUrl = process.env.MONGODB_URL!;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
export const upload = multer({ dest: "uploads/" }); // Temporary folder

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/api/v1/users/google/callback", // This must match
    },
    async (token_1: string, token_2: string, profile: Profile, done) => {
      let user = await User.findOne({ email: profile.emails?.[0].value });
      if (!user) {
        user = await createUserFromGoogle(profile);
      }

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      return done(null, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile,
      });
    },
  ),
);

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Failed to Connect to MongoDB", err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use("/api/v1/users", userRouter);

console.log(process.env.GOOGLE_CLIENT_ID as string);
console.log(process.env.GOOGLE_CLIENT_SECRET as string);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
