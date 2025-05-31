import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectToDatabase } from "@lib/mongodb";
import Order from "@models/Order";
import Cart from "@models/Cart";

export const dynamic = "force-dynamic";

interface LeanOrder {
  _id: mongoose.Types.ObjectId;
  userId: string;
  items: Array<{
    productId: number;
    quantity: number;
    name: string;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  pixKey?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean() as unknown as LeanOrder[];
    return NextResponse.json(
      orders.map(order => ({ ...order, _id: order._id.toString() })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const { paymentMethod } = await request.json();
    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = new Order({
      userId,
      items: cart.items,
      total: cart.total,
      paymentMethod,
      status: "pending",
    });

    cart.lastCart = [...cart.items];
    cart.items = [];
    cart.total = 0;

    await Promise.all([order.save(), cart.save()]);

    return NextResponse.json({ order: { ...order.toObject(), _id: order._id.toString() } }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}