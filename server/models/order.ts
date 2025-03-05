import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./product";

export enum PaymentStatus {
  CardPayment = "cardpayment",
  CASH_ON_DELIVERY = "cash_on_delivery",
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

export interface IOrderItem {
  product: Schema.Types.ObjectId | IProduct;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  buyer: Schema.Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    trackingId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Middleware to calculate subtotal & total amount before saving
orderSchema.pre("save", function(next) {
  this.products.forEach((item) => {
    item.subtotal = item.quantity * item.price;
  });

  this.totalAmount = this.products.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );

  next();
});

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
