import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@lib/mongodb";
import Payment from "@models/Payment";

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

    const {
      orderId,
      paymentMethod,
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      cpf,
      parcelas,
      bank,
    } = await request.json();

    if (!orderId || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payment = new Payment({
      orderId,
      paymentMethod,
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      cpf,
      parcelas,
      bank,
      userId,
    });

    await payment.save();

    return NextResponse.json({ message: "Payment details saved" }, { status: 201 });
  } catch (error) {
    console.error("Error saving payment details:", error);
    return NextResponse.json({ error: "Failed to save payment details" }, { status: 500 });
  }
}

// GET handler to fetch payment details (for easy access)
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

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}