import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "vendor"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface IUser extends Document {
  userName: string;
  role: string;
  email: string;
  password: string;
  isActive: boolean;
}

const User = mongoose.model<IUser>("User", userSchema);
export default User;
