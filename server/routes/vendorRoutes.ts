import { auth, isVendor } from "@middlewares/auth";
import express, { Request, Response } from "express";

const vendorRouter = express.Router();

vendorRouter.get("/", auth, isVendor, (_: Request, res: Response) => {
  res.status(200).json({ data: "Certified User" });
});
export default vendorRouter;
