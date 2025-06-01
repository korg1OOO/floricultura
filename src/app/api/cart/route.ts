import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Cart from "@models/Cart";

export const dynamic = "force-dynamic";

interface CartItem {
  productId: number; // Changed to number to match ProductSection.tsx
  quantity: number;
  name: string;
  price: number;
}

interface CartDocument {
  userId: string;
  items: CartItem[];
  total: number;
  lastCart?: CartItem[];
}

interface CartModel extends CartDocument {
  save: () => Promise<CartModel>;
}

// Function to calculate total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("GET /api/cart: No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;
    console.log("GET /api/cart: Decoded userId:", userId);

    const cart = await Cart.findOne({ userId }) as CartModel | null;
    if (cart) {
      cart.total = calculateTotal(cart.items);
      await cart.save();
      console.log("GET /api/cart: Cart found:", cart);
      return NextResponse.json(cart, { status: 200 });
    }
    console.log("GET /api/cart: No cart found for user, returning empty cart");
    return NextResponse.json({ items: [], total: 0 }, { status: 200 });
  } catch (error) {
    console.error("GET /api/cart: Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("POST /api/cart: No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;
    console.log("POST /api/cart: Decoded userId:", userId);

    const { productId, quantity, name, price } = await request.json();
    console.log("POST /api/cart: Request body:", { productId, quantity, name, price });

    if (!productId || !quantity || !name || !price) {
      console.log("POST /api/cart: Missing product details");
      return NextResponse.json({ error: "Product details are required" }, { status: 400 });
    }

    // Ensure productId is treated as a number
    const productIdNum = Number(productId);
    if (isNaN(productIdNum)) {
      console.log("POST /api/cart: Invalid productId:", productId);
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId }) as CartModel | null;
    if (!cart) {
      console.log("POST /api/cart: Creating new cart for user");
      cart = new Cart({
        userId,
        items: [],
        total: 0,
      }) as CartModel;
    }

    const existingItem = cart.items.find((item) => item.productId === productIdNum);
    if (existingItem) {
      existingItem.quantity += quantity;
      console.log("POST /api/cart: Updated existing item:", existingItem);
    } else {
      cart.items.push({ productId: productIdNum, quantity, name, price });
      console.log("POST /api/cart: Added new item:", { productId: productIdNum, quantity, name, price });
    }

    cart.total = calculateTotal(cart.items);
    await cart.save();
    console.log("POST /api/cart: Updated cart:", cart);

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("POST /api/cart: Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("DELETE /api/cart: No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;
    console.log("DELETE /api/cart: Decoded userId:", userId);

    const { productId } = await request.json();
    const productIdNum = Number(productId);
    if (isNaN(productIdNum)) {
      console.log("DELETE /api/cart: Invalid productId:", productId);
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }) as CartModel | null;
    if (!cart) {
      console.log("DELETE /api/cart: Cart not found");
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter((item) => item.productId !== productIdNum);
    cart.total = calculateTotal(cart.items);
    await cart.save();
    console.log("DELETE /api/cart: Updated cart after removal:", cart);

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/cart: Error removing from cart:", error);
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("PATCH /api/cart: No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const userId = decoded.id;
    console.log("PATCH /api/cart: Decoded userId:", userId);

    const { productId, quantity } = await request.json();
    const productIdNum = Number(productId);
    if (isNaN(productIdNum) || quantity === undefined || quantity < 1) {
      console.log("PATCH /api/cart: Invalid productId or quantity:", { productId, quantity });
      return NextResponse.json({ error: "Product ID and valid quantity are required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }) as CartModel | null;
    if (!cart) {
      console.log("PATCH /api/cart: Cart not found");
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find((item) => item.productId === productIdNum);
    if (!item) {
      console.log("PATCH /api/cart: Item not found in cart:", productIdNum);
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    item.quantity = quantity;
    cart.total = calculateTotal(cart.items);
    await cart.save();
    console.log("PATCH /api/cart: Updated cart after quantity change:", cart);

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/cart: Error updating cart quantity:", error);
    return NextResponse.json({ error: "Failed to update cart quantity" }, { status: 500 });
  }
}