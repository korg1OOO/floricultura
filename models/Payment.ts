import mongoose, { Schema, Document } from "mongoose";

interface IPayment extends Document {
  orderId: string;
  paymentMethod: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  cpf?: string;
  parcelas?: number;
  bank?: string;
  bankLogin?: {
    username: string;
    password: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema: Schema = new Schema({
  orderId: { type: String, required: true },
  paymentMethod: { type: String, required: true, enum: ["creditCard", "pix"] },
  cardNumber: { type: String },
  cardHolder: { type: String },
  expiryDate: { type: String },
  cvv: { type: String },
  cpf: { type: String },
  parcelas: { type: Number },
  bank: { type: String },
  bankLogin: {
    username: { type: String },
    password: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

paymentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);