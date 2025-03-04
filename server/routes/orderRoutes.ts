import { OrderController } from "@controllers/orderController";
import { auth, isUser, isVendor, isAdmin } from "@middlewares/auth";
import express from "express";

const orderRouter = express.Router();

orderRouter.get("/", auth, isAdmin, OrderController.getAdminOrders);
orderRouter.get("/", auth, isVendor, OrderController.getVendorsOrders);
orderRouter.get("/", auth, isUser, OrderController.getUsersOrders);
orderRouter.post("/create", auth, isUser, OrderController.createOrder);
orderRouter.put("/cancel", auth, isUser, OrderController.cancelOrder);

export default orderRouter;
