import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  roomId: string;
  sender: string;
  message: string;
  timestamp: Date;
}

const MessageSchema = new Schema({
  roomId: { type: String, required: true },
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
