import StripeController from "@controllers/stripeController";
import { auth } from "@middlewares/auth";
import express from "express";

const stripeRouter = express.Router();

stripeRouter.post("/pay", auth, StripeController.payStripe);

export default stripeRouter;
