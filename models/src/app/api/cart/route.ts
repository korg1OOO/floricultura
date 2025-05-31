import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Cart from "@models/Cart";

// Get the user's cart
export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies(); // Await cookies()
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const userId = decoded.id;

    const cart = await Cart.findOne({ userId });
    return NextResponse.json(cart || { items: [], total: 0 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// Add an item to the cart
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies(); // Await cookies()
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const userId = decoded.id;

    const { productId, quantity, name, price } = await request.json();
    if (!productId || !quantity || !name || !price) {
      return NextResponse.json(
        { error: "Product ID, quantity, name, and price are required" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0,
      });
    }

    const itemIndex = cart.items.findIndex((item: any) => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, name, price });
    }

    await cart.save();
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// Remove an item from the cart
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies(); // Await cookies()
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const userId = decoded.id;

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter((item: any) => item.productId !== productId);
    await cart.save();
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}