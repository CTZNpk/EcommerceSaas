import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "@routes/user_routes";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const port = 3000;

const mongoUrl = process.env.MONGODB_URL!;

app.use(express.json());

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
