import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Payment from "@models/Payment";

export async function PATCH(request: Request) {
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

    const { orderId, bankLogin } = await request.json();

    if (!orderId || !bankLogin || !bankLogin.username || !bankLogin.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payment = await Payment.findOne({ orderId, userId });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    payment.bankLogin = bankLogin;
    await payment.save();

    return NextResponse.json({ message: "Bank login saved" }, { status: 200 });
  } catch (error) {
    console.error("Error saving bank login:", error);
    return NextResponse.json({ error: "Failed to save bank login" }, { status: 500 });
  }
}