import { CustomRequest } from "@middlewares/auth";
import { Response } from "express";
import Cart, { ICart } from "@models/cart";
import Product, { IProduct } from "@models/product";
import { ObjectId } from "mongoose";

export class CartController {
  static async addProductToCart(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;
      const { productId, quantity } = req.body;

      if (!productId || quantity <= 0) {
        res.status(400).json({ message: "Invalid product or quantity" });
        return;
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      let cart = (await Cart.findOne({ user: userId })) as ICart | null;

      if (!cart) {
        cart = new Cart({ user: userId, products: [] }) as ICart;
      }

      const existingProduct = cart!.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.subtotal = existingProduct.quantity * product.price;
      } else {
        cart.items.push({
          product: product._id as ObjectId,
          quantity,
          price: product.price,
          subtotal: quantity * product.price,
        });
      }

      await cart.save();

      res
        .status(200)
        .json({ message: "Product added to cart", data: { cart } });
    } catch (e) {
      console.error("Error adding to cart:", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getCart(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;

      let cart = (await Cart.findOne({ user: userId }).populate(
        "items.product",
      )) as ICart;

      if (!cart) {
        cart = new Cart({ user: userId, products: [] }) as ICart;
      }

      res
        .status(200)
        .json({ message: "Cart Retrieved Successfully", data: { cart } });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async updateProductQuantity(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;
      const { productId, quantity } = req.body;

      if (quantity < 1) {
        res.status(400).json({ message: "Quantity must be at least 1" });
        return;
      }

      let cart = (await Cart.findOne({ user: userId }).populate(
        "items.product",
      )) as ICart;

      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }

      const productItem = cart.items.find(
        (item) => (item.product as IProduct).id.toString() === productId,
      );

      if (!productItem) {
        res.status(404).json({ message: "Product not found in cart" });
        return;
      }

      productItem.quantity = quantity;
      productItem.subtotal = productItem.price * quantity;

      await cart.save();

      res
        .status(200)
        .json({ message: "Cart Updated Successfully", data: { cart } });
    } catch (error) {
      console.error("Error updating product quantity:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async removeProductFromCart(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;
      const productId = req.params.productId;

      let cart = (await Cart.findOne({ user: userId }).populate(
        "items.product",
      )) as ICart;
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }

      const initialLength = cart.items.length;

      cart.items = cart.items.filter(
        (item) => (item.product as IProduct)._id.toString() !== productId,
      );

      console.log(cart.items);
      if (cart.items.length === initialLength) {
        res.status(404).json({ message: "Product not found in cart" });
        return;
      }

      await cart.save();
      res.status(200).json({ message: "Item Removed Successfully", cart });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async clearCart(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;

      let cart = (await Cart.findOne({ user: userId }).populate(
        "items.product",
      )) as ICart;

      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }

      cart.items = [];
      await cart.save();

      res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
