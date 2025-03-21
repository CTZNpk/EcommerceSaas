import VendorController from "@controllers/vendorController";
import { auth, isVendor } from "@middlewares/auth";
import { upload } from "config/multerConfig";
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
  upload.single("image"),
  VendorController.uploadProductPic,
);

vendorRouter.post(
  "/update-product",
  auth,
  isVendor,
  VendorController.updateProduct,
);

vendorRouter.delete(
  "/delete-product/:productId",
  auth,
  isVendor,
  VendorController.deleteProduct,
);

export default vendorRouter;
