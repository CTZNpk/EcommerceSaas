import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema(
  {
    //TODO change
    imageUrl: {
      type: String,
    },
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

    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: { type: String },
  },
  {
    timestamps: true,
  },
);

export interface IUser extends Document {
  imageUrl: string;
  username: string;
  accountType: string;
  email: string;
  password: string;
  isActive: boolean;
  address: string;
  phoneNumber: string;
  verificationToken: string | null;
  isVerified: boolean;
}

const User = mongoose.model<IUser>("User", userSchema);
export default User;
