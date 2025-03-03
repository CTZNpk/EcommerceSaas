import mongoose, { Schema, Document } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    ratingCount: {
      type: Number,
      required: true,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface IProduct extends Document {
  name: string;
  image: string;
  price: number;
  description: string;
  vendor: Schema.Types.ObjectId;
  rating: Number;
  ratingCount: number;
  purchaseCount: number;
  isActive: boolean;
}

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
