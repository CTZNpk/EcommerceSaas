import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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
