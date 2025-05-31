import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Order from "@models/Order";
import Cart from "@models/Cart";

// GET handler to fetch either a single order or all orders for the user
export async function GET(request: Request, { params }: { params?: { orderId?: string } } = {}) {
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

    // If params and orderId are provided, fetch a single order
    if (params && params.orderId) {
      const order = await Order.findOne({ _id: params.orderId, userId });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.paymentMethod === "pix") {
        if (!process.env.PIX_KEY) {
          throw new Error("PIX_KEY is not defined in environment variables");
        }
        return NextResponse.json(
          {
            order,
            pix: {
              chavePix: process.env.PIX_KEY,
              amount: order.total,
            },
          },
          { status: 200 }
        );
      }

      return NextResponse.json({ order }, { status: 200 });
    }

    // If no orderId is provided, fetch all orders for the user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sort by creation date, newest first
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PATCH handler to update an order's status
export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { status } = await request.json();
    if (!status || !["pending", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findOne({ _id: params.orderId, userId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ message: "Order status updated", order }, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// POST handler to create a new order
export async function POST(request: Request) {
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

    const { paymentMethod } = await request.json();
    if (!paymentMethod || !["creditCard", "pix"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create a new order
    const order = new Order({
      userId,
      items: cart.items,
      total: cart.total,
      paymentMethod,
      status: "pending",
      createdAt: new Date(),
    });
    await order.save();

    // Clear the cart
    cart.items = [];
    cart.total = 0;
    await cart.save();

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}