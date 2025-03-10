import { CustomRequest } from "@middlewares/auth";
import Product, { IProduct } from "@models/product";
import axios from "axios";
import { ENV } from "config/env";
import { Request, Response } from "express";
import mongoose from "mongoose";

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

  static async searchProducts(req: CustomRequest, res: Response) {
    try {
      const { query, top_k } = req.query;

      if (!query) {
        res.status(400).json({ message: "Query is required" });
        return;
      }

      const fastApiResponse = await axios.get(`${ENV.FAST_API}/search`, {
        params: { query, top_k: top_k || 5 },
      });

      const productIds = fastApiResponse.data.results; // Assuming it's an array of product IDs


      if (!productIds.length) {
        res
          .status(200)
          .json({ message: "No products found", data: { products: [] } });
        return;
      }

      const products = await Product.find({ _id: { $in: productIds } });

      const orderedProducts = productIds.map((id: string) =>
        products.find(
          (product: any) => product._id.toString() === id[0] || null,
        ),
      );
      res.status(200).json({
        message: "Search Request Successful",
        data: { products: orderedProducts },
      });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to fetch search results" });
    }
  }

  static async getProducts(_: Request, res: Response) {
    try {
      const products = await Product.find({ isActive: true }).lean();
      if (!products) {
        res.status(404).json({
          message: "No Products Found",
        });
        return;
      }
      const formattedProducts = products.map(({ _id, ...rest }) => ({
        id: _id.toString(),
        ...rest,
      }));

      res.status(200).json({
        message: "Products Retrieved Successfully",
        data: {
          products: formattedProducts,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
