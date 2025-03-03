import VendorController from "@controllers/vendorController";
import { auth, isVendor } from "@middlewares/auth";
import express, { Request, Response } from "express";

const vendorRouter = express.Router();

vendorRouter.get("/", auth, isVendor, (_: Request, res: Response) => {
  res.status(200).json({ data: "Certified User" });
});

vendorRouter.get(
  "/get-all-products",
  auth,
  isVendor,
  VendorController.getAllMyProducts,
);

vendorRouter.post("/add-product", auth, isVendor, VendorController.addProduct);
vendorRouter.post(
  "/upload-product-pic",
  auth,
  isVendor,
  VendorController.uploadProductPic,
);

vendorRouter.post(
  "/update-product",
  auth,
  isVendor,
  VendorController.updateProduct,
);

export default vendorRouter;
