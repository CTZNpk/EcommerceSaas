import { Schema } from "mongoose";

export interface IOrderProduct {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  subtotal: number;
}
