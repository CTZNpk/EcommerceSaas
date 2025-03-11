import { ENV } from "config/env";
import { Request, Response } from "express";
import Stripe from "stripe";
import { v4 } from "uuid";

class StripeController {
  static async payStripe(req: Request, res: Response) {
    const stripe = new Stripe(ENV.STRIPE_KEY);
    const { token, amount } = req.body;
    const idempotencyKey = v4();

    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id, // Fix: Use token.id instead of token
      });

      const charge = await stripe.charges.create(
        {
          amount: amount * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
        },
        { idempotencyKey },
      );

      res.status(200).json({ message: "Payment Successful", data: charge });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Payment Failed", error: err });
    }
  }
}

export default StripeController;
