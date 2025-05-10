import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import Message from "@models/message";
import Room from "@models/room";

class SocketController {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

      socket.on("joinRoom", async ({ user1, user2 }) => {
        const roomId = [user1.userId, user2.userId].sort().join("_");

        let room = await Room.findOne({ roomId });

        if (!room) {
          room = new Room({
            roomId,
            users: [user1, user2], // Store both users with name & profilePic
            lastMessage: null,
          });
          await room.save();
        }

        socket.join(roomId);

        // Send previous messages
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        socket.emit("previousMessages", messages);
      });

      // Handle sending a message
      socket.on("sendMessage", async ({ roomId, message, sender }) => {
        const newMessage = new Message({ roomId, sender, message });
        await newMessage.save();

        // Update last message in Room
        await Room.findOneAndUpdate(
          { roomId },
          {
            lastMessage: {
              text: message,
              sender,
              timestamp: newMessage.timestamp,
            },
          },
        );

        // Broadcast message
        this.io.to(roomId).emit("receiveMessage", {
          message,
          sender,
          timestamp: newMessage.timestamp,
        });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
}

export default SocketController;
