import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  lastCart?: ICartItem[];
}

const cartSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastCart: [
    {
      productId: { type: Number },
      quantity: { type: Number },
      name: { type: String },
      price: { type: Number },
    },
  ],
});

// Explicitly type `this` as `ICart` in the pre-save hook
cartSchema.pre("save", function (this: ICart, next) {
  this.updatedAt = new Date();
  this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);