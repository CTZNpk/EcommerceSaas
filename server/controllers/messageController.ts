import Message from "@models/message";
import Room from "@models/room";
import { Response, Request } from "express";

export class MessageController {
  static async getMessages(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  }

  static async getUserRooms(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const rooms = await Room.find({ "users.userId": userId }).sort({
        "lastMessage.timestamp": -1,
      });
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  }
}
