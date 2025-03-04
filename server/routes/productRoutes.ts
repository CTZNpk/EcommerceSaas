import { ProductController } from "@controllers/productController";
import { auth } from "@middlewares/auth";
import express from "express";

const productRouter = express.Router();

productRouter.get("/:productId", auth, ProductController.getProductById);
productRouter.get("/", auth, ProductController.getProducts);

export default productRouter;
