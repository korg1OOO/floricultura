import mongoose, { Schema, Document } from "mongoose";

interface IFavorites extends Document {
  userId: string;
  productIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

const favoritesSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  productIds: [{ type: Number }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

favoritesSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Favorites || mongoose.model<IFavorites>("Favorites", favoritesSchema);