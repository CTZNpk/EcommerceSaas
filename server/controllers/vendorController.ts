import { CustomRequest } from "@middlewares/auth";
import Product, { IProduct } from "@models/product";
import { MulterRequest, uploadImageToCloudinary } from "@services/uploadImage";
import { Response, Request } from "express";

class VendorController {
  static async addProduct(req: CustomRequest, res: Response) {
    try {
      const { productName, image, description, price, category, stock } =
        req.body;
      const userId = req.userId;

      const newProduct: IProduct = new Product({
        name: productName,
        image,
        description,
        price,
        vendor: userId,
        category,
        stock,
      });

      const createdProduct = await newProduct.save();
      res.status(201).json({
        message: "Product Created Succesfully",
        data: {
          createdProduct,
        },
      });
    } catch (error) {
      console.log("Registration error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async uploadProductPic(req: Request, res: Response) {
    try {
      const multerReq = req as MulterRequest;

      if (!multerReq.file) {
        res.status(400).json({ message: "No image provided" });
        return;
      }
      const result = await uploadImageToCloudinary("product-image", multerReq);

      res.status(200).json({
        message: "Image uploaded successfully",
        data: {
          imageUrl: result,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Image upload failed" });
    }
  }

  static async updateProduct(req: CustomRequest, res: Response) {
    try {
      const { id, name, image, description, price, stock } = req.body;
      const userId = req.userId;

      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        res.status(404).json({ message: "Product does not exist" });
        return;
      }
      if (existingProduct.vendor.toString() != userId) {
        res
          .status(403)
          .json({ message: "You are not the Owner of this Product" });
        return;
      }

      existingProduct.name = name || existingProduct.name;
      existingProduct.image = image || existingProduct.image;
      existingProduct.description = description || existingProduct.description;
      existingProduct.price = price || existingProduct.price;
      existingProduct.stock = stock || existingProduct.stock;
      await existingProduct.save();

      res.status(200).json({
        message: "User updated successfully",
        data: {
          existingProduct,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAllMyProducts(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;

      const products = await Product.find({ vendor: userId, isActive: true });

      res.status(200).json({
        message: "Products Retrieved Successfully",
        data: {
          products,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteProduct(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;
      const productId = req.params.productId;

      const product = await Product.findOneAndUpdate(
        { _id: productId, vendor: userId },
        { isActive: false },
        { new: true },
      );

      if (!product) {
        res.status(404).json({ message: "Product not found or unauthorized" });
        return;
      }

      res.status(200).json({
        message: "Product deleted successfully",
        data: product,
      });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default VendorController;
