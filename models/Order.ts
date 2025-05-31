import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  pixKey?: string; // Add pixKey as an optional field
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: Number, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "completed", "cancelled"],
  },
  paymentMethod: { type: String, required: true, enum: ["creditCard", "pix"] },
  pixKey: { type: String }, // Add this field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);