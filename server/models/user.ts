import mongoose, { Schema, Document } from "mongoose";

export enum AccountType {
  USER = "user",
  ADMIN = "admin",
  VENDOR = "vendor",
}

export enum UserStatus {
  VERIFIED = "verified",
  UNVERIFIED = "unverified",
  DELETED = "deleted",
  BLOCKED = "blocked",
}

export interface IUser extends Document {
  profilePic: string;
  username: string;
  accountType: AccountType;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  verificationToken: string | null;
  status: UserStatus;
}

const userSchema = new Schema(
  {
    profilePic: {
      type: String,
    },
    username: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    accountType: {
      type: String,
      enum: Object.values(AccountType),
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.UNVERIFIED,
    },
    //TODO Total Spent
    //TODO Total Sold for vendor?
    verificationToken: { type: String },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
