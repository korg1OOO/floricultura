import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Favorites from "@models/Favorites";

// Get the user's favorites
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

    const favorites = await Favorites.findOne({ userId });
    return NextResponse.json(
      favorites ? favorites.productIds : [],
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// Add or remove a product from favorites
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

    const { productId, action } = await request.json();
    if (!productId || !["add", "remove"].includes(action)) {
      return NextResponse.json(
        { error: "Product ID and action (add/remove) are required" },
        { status: 400 }
      );
    }

    let favorites = await Favorites.findOne({ userId });
    if (!favorites) {
      favorites = new Favorites({
        userId,
        productIds: [],
      });
    }

    if (action === "add") {
      if (!favorites.productIds.includes(productId)) {
        favorites.productIds.push(productId);
      }
    } else if (action === "remove") {
      favorites.productIds = favorites.productIds.filter((id: number) => id !== productId);
    }

    await favorites.save();
    return NextResponse.json(favorites.productIds, { status: 200 });
  } catch (error) {
    console.error("Error updating favorites:", error);
    return NextResponse.json(
      { error: "Failed to update favorites" },
      { status: 500 }
    );
  }
}