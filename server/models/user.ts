import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    accountType: {
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
  username: string;
  accountType: string;
  email: string;
  password: string;
  isActive: boolean;
  address: string;
  phoneNumber: string;
}

const User = mongoose.model<IUser>("User", userSchema);
export default User;
