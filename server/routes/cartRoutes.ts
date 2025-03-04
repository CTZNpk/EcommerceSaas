import { CartController } from "@controllers/cartController";
import { auth, isUser } from "@middlewares/auth";
import express from "express";

const cartRouter = express.Router();

cartRouter.get("/", auth, isUser, CartController.getCart);
cartRouter.post("/add", auth, isUser, CartController.addProductToCart);
cartRouter.post(
  "/update-quantity",
  auth,
  isUser,
  CartController.updateProductQuantity,
);
cartRouter.delete(
  "/delete/:productId",
  auth,
  isUser,
  CartController.removeProductFromCart,
);

cartRouter.delete("/delete", auth, isUser, CartController.clearCart);

export default cartRouter;
