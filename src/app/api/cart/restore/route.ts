import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Cart from "@models/Cart";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.id;

    const cart = await Cart.findOne({ userId });
    console.log("Cart fetched for restoration:", cart);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    console.log("lastCart in restore:", cart.lastCart);
    if (!cart.lastCart || cart.lastCart.length === 0) {
      return NextResponse.json({ error: "No previous cart to restore" }, { status: 400 });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: cart.lastCart,
          lastCart: [],
          total: cart.lastCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
          updatedAt: new Date(),
        },
      },
      { new: true } // Return the updated document
    );
    console.log("Cart after restoration:", updatedCart);

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error("Error restoring cart:", error);
    return NextResponse.json({ error: "Failed to restore cart" }, { status: 500 });
  }
}