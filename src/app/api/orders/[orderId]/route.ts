import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Order from "@models/Order";
import User from "@models/User";

interface OrderDocument {
  _id: string;
  userId: string;
  total: number;
  paymentMethod: string;
  status: string;
  items?: Array<{
    productId: number;
    quantity: number;
    name: string;
    price: number;
  }>;
  toObject: () => OrderDocument;
}

export async function GET(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const params = await context.params;
    const orderId = params.orderId;

    const order = await Order.findOne({ _id: orderId, userId }) as OrderDocument | null;
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch customer details
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        order: {
          ...order.toObject(),
          _id: order._id.toString(),
          customer: { name: user.name, email: user.email },
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error fetching order:", {
      message: errorMessage,
      stack: errorStack,
    });
    return NextResponse.json({ error: "Failed to fetch order", details: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const params = await context.params;
    const orderId = params.orderId;

    const body = await request.json();
    const { status } = body;

    if (status && !["pending", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateFields: { status?: string } = {};
    if (status) updateFields.status = status;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId },
      updateFields,
      { new: true }
    ) as OrderDocument | null;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order updated", order: { ...order.toObject(), _id: order._id.toString() } },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error updating order:", {
      message: errorMessage,
      stack: errorStack,
    });
    return NextResponse.json({ error: "Failed to update order", details: errorMessage }, { status: 500 });
  }
}