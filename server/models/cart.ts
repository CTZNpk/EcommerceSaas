import mongoose, { Schema, Document } from "mongoose";
import { IOrderProduct } from "../types/IOrderItem"; // Reusing the interface

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  items: IOrderProduct[];
  totalCost: number;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    totalCost: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

cartSchema.pre("save", function(next) {
  this.items.forEach((item) => {
    item.subtotal = item.quantity * item.price;
  });

  this.totalCost = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  next();
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
