import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomId: string;
  users: {
    userId: string;
    name: string;
    profilePic: string;
  }[];
  lastMessage: {
    text: string;
    sender: string;
    timestamp: Date;
  } | null;
}

const RoomSchema = new Schema({
  roomId: { type: String, required: true, unique: true },
  users: [
    {
      userId: { type: String, required: true },
      name: { type: String, required: true },
      profilePic: { type: String, required: true },
    },
  ],
  lastMessage: {
    text: { type: String },
    sender: { type: String },
    timestamp: { type: Date },
  },
});

export default mongoose.model<IRoom>("Room", RoomSchema);
