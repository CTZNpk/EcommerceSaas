import Product from "@models/product";
import { Request, Response } from "express";

export class ProductController {
  static async getProductById(req: Request, res: Response) {
    try {
      const productId = req.params.productId;

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        res.status(404).json({
          message: "This Product Does not exist",
        });
        return;
      }

      res.status(200).json({
        message: "Products Retrieved Successfully",
        data: {
          product,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
