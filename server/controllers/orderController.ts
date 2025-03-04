import { CustomRequest } from "@middlewares/auth";
import Product, { IProduct } from "@models/product";
import { AccountType } from "@models/user";
import { Request, Response } from "express";
import Order, { IOrderItem, PaymentStatus, OrderStatus } from "models/order";
import { ObjectId } from "mongoose";
export class OrderController {
  static async createOrder(req: CustomRequest, res: Response) {
    try {
      const { products, paymentStatus } = req.body;
      const buyer = req.userId;

      if (
        !buyer ||
        !products ||
        !Array.isArray(products) ||
        products.length === 0
      ) {
        return res.status(400).json({ message: "Invalid order details" });
      }

      const productDetails = await Promise.all(
        products.map(async (item: IOrderItem) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product with ID ${item.product} not found`);
          }
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          return {
            ...item,
            price: product.price,
            subtotal: product.price * item.quantity,
          };
        }),
      );

      const totalAmount = productDetails.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );

      const order = new Order({
        buyer,
        products: productDetails,
        totalAmount,
        paymentStatus: paymentStatus,
        orderStatus: OrderStatus.PENDING,
      });

      await order.save();

      await Promise.all(
        products.map(async (item) => {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }),
      );

      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.log("Error ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getUsersOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const orders = await Order.find({ buyer: userId })
        .populate("products.product")
        .sort({ createdAt: -1 });

      if (!orders.length) {
        return res
          .status(404)
          .json({ message: "No orders found for this user" });
      }

      res.status(200).json({ orders });
    } catch (error) {
      console.log("Error :", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getVendorsOrders(req: Request, res: Response) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({ message: "Vendor ID is required" });
      }

      const vendorProducts = await Product.find({ vendor: vendorId }).select(
        "_id",
      );

      if (!vendorProducts.length) {
        return res
          .status(404)
          .json({ message: "No products found for this vendor" });
      }

      const productIds = vendorProducts.map((p) => p._id);

      const orders = await Order.find({
        "products.product": { $in: productIds },
      })
        .populate("buyer", "name email") // Populate buyer details
        .populate("products.product", "name price vendor") // Populate product details
        .sort({ createdAt: -1 });

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        buyer: order.buyer,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        products: order.products.filter((item) => {
          const product = item.product as IProduct;
          return productIds.some((id) => {
            const currId = id as ObjectId;
            return currId == product._id;
          });
        }),
      }));

      res.status(200).json({
        message: "Orders retrieved successfully",
        data: { orders: filteredOrders },
      });
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAdminOrders(_: Request, res: Response) {
    try {
      const orders = await Order.find()
        .populate("buyer", "name email")
        .populate("products.product", "name price");

      return res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
  static async cancelOrder(req: CustomRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.userId; // Assuming req.user contains authenticated user details

      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      if (
        order.buyer.toString() !== userId &&
        req.accountType !== AccountType.ADMIN
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });
      }

      if (
        order.orderStatus === OrderStatus.SHIPPED ||
        order.orderStatus === OrderStatus.DELIVERED
      ) {
        return res.status(400).json({
          success: false,
          message: "Order cannot be canceled at this stage",
        });
      }

      order.orderStatus = OrderStatus.CANCELED;
      await order.save();

      return res
        .status(200)
        .json({ success: true, message: "Order canceled successfully", order });
    } catch (error) {
      console.error("Error canceling order:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}
