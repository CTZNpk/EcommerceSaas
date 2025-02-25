import mongoose from "mongoose";
import { ENV } from "./env";

const connectDB = () => {
  mongoose
    .connect(ENV.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => console.error("Failed to Connect to MongoDB", err));
};

export default connectDB;
