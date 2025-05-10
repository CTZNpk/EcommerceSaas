import { IProduct } from "@models/product";
import { Schema } from "mongoose";

export interface IOrderProduct {
  product: Schema.Types.ObjectId | IProduct;
  quantity: number;
  price: number;
  subtotal: number;
}
