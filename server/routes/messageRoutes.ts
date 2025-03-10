import { MessageController } from "@controllers/messageController";
import { auth } from "@middlewares/auth";
import express from "express";

const router = express.Router();

router.get("/messages/:roomId", auth, MessageController.getMessages);
router.get("/rooms/:userId", auth, MessageController.getUserRooms);

export default router;
