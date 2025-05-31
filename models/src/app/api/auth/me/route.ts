import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies(); // Await cookies()
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
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