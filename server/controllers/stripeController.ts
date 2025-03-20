import { CustomRequest } from "@middlewares/auth";
import Cart from "@models/cart";
import { IProduct } from "@models/product";
import { ENV } from "config/env";
import { Response } from "express";
import Stripe from "stripe";

class StripeController {
  static async payStripe(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId!;
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product",
      );

      if (!cart) {
        res.status(404).json({ message: "Cart Not Found" });
      }
      const products = cart?.items;

      const lineItems = products!.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: (product.product as IProduct).name,
            images: [(product.product as IProduct).image],
          },
          unit_amount: product.subtotal * 100,
        },
        quantity: product.quantity,
      }));

      console.log(lineItems);

      const stripe = new Stripe(ENV.STRIPE_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:5173/order/success",
        cancel_url: "http://localhost:5173/order/cancel",
      });

      res.status(200).json({ data: { session: session.id } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Payment Failed", error: err });
    }
  }
}

export default StripeController;
