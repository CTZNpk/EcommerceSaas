import mongoose, { Schema, Document } from "mongoose";

const ratingSchema = new Schema(
  {
    //TODO Reference
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface IRating extends Document {
  userId: String;
  productId: String;
  rating: Number;
  review: Number;
}

const Rating = mongoose.model<IRating>("Rating", ratingSchema);
export default Rating;
