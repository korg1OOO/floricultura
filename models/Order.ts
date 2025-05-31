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
  paymentMethod: string;
  pixKey?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true, default: 0 },
  paymentMethod: { type: String, required: true },
  pixKey: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Explicitly type `this` as `IOrder` in the pre-save hook
orderSchema.pre("save", function (this: IOrder, next) {
  this.updatedAt = new Date();
  this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);