import { ProductController } from "@controllers/productController";
import { auth } from "@middlewares/auth";
import express from "express";

const productRouter = express.Router();

productRouter.get("/:productId", auth, ProductController.getProductById);

export default productRouter;
