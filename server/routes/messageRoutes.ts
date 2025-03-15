import { MessageController } from "@controllers/messageController";
import { auth } from "@middlewares/auth";
import express from "express";

const messageRouter = express.Router();

messageRouter.get("/:roomId", auth, MessageController.getMessages);
messageRouter.get("/rooms/:userId", auth, MessageController.getUserRooms);


export default messageRouter;
