import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Order from "@models/Order";
import Cart from "@models/Cart";

// GET handler to fetch all orders for the user
export async function GET(request: Request) {
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

    // Fetch all orders for the user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      orders.map(order => ({ ...order, _id: order._id.toString() })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
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
    console.log("Cart fetched for order creation:", cart); // Debug log
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Store the current cart items in lastCart before clearing
    console.log("Cart items before saving to lastCart:", cart.items);
    cart.lastCart = cart.items;
    console.log("lastCart after assignment:", cart.lastCart);

    // Create a new order
    const order = new Order({
      userId,
      items: cart.items,
      total: cart.total,
      paymentMethod,
      status: "pending",
      pixKey: paymentMethod === "pix" ? "385e84bb-09e4-4c38-a812-c7c4e1378383" : undefined, // Set pixKey during creation
      createdAt: new Date(),
    });
    await order.save();
    console.log("Order created:", order); // Debug log

    // Clear the cart
    cart.items = [];
    cart.total = 0;
    await cart.save();
    console.log("Cart after clearing:", cart); // Debug log

    return NextResponse.json({ order: { ...order.toObject(), _id: order._id.toString() } }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}