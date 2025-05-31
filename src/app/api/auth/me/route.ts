import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json(
      { user: decoded },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}