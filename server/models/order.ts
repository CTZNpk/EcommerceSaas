import mongoose, { Schema, Document } from "mongoose";

export enum PaymentStatus {
  PAID = "paid",
  CASH_ON_DELIVERY = "cash_on_delivery",
  UNPAID = "unpaid",
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number; // Price at the time of order
  subtotal: number; // quantity * price
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
        price: {
          type: Number,
          required: true,
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
      default: PaymentStatus.UNPAID,
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
