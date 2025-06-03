import { NextResponse } from "next/server";
import User from "@models/User";
import { connectToDatabase } from "@lib/mongodb";
import { cookies } from "next/headers";

interface OrderItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

// Define the success response structure
interface SuccessOrderResponse {
  order: {
    total: number;
    userId: string;
    items: OrderItem[];
  };
}

// Define the error response structure
interface ErrorResponse {
  error: string;
}

// Union type for the fetch response
type OrderResponse = SuccessOrderResponse | ErrorResponse;

export async function GET(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  try {
    await connectToDatabase();

    // Fetch order details
    let baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3001";
    baseUrl = baseUrl.replace(/^https?:\/\//, "");
    const fullUrl = `http://${baseUrl}/api/orders/${orderId}`;
    console.log(`Fetching order from: ${fullUrl}`);

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      console.error("No token found in cookies");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const orderResponse = await fetch(fullUrl, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    const contentType = orderResponse.headers.get("content-type") || "";
    const responseBody = await orderResponse.text();
    let orderData: OrderResponse;

    if (contentType.includes("application/json")) {
      try {
        orderData = JSON.parse(responseBody);
      } catch (jsonError) {
        console.error(`Failed to parse JSON from /api/orders/${orderId}. Response:`, responseBody);
        throw new Error(`Invalid JSON response from /api/orders/${orderId}: ${responseBody}`);
      }
    } else {
      console.error(`Unexpected content-type from /api/orders/${orderId}: ${contentType}. Response:`, responseBody);
      throw new Error(`Expected JSON but received ${contentType} from /api/orders/${orderId}`);
    }

    if (!orderResponse.ok) {
      console.error(`Order fetch failed: ${orderResponse.status} ${orderResponse.statusText}`, orderData);
      // Since orderResponse.ok is false, orderData should be an ErrorResponse
      const errorMessage = "error" in orderData ? orderData.error : "Order not found";
      return NextResponse.json({ error: errorMessage }, { status: orderResponse.status });
    }

    // At this point, orderData should be a SuccessOrderResponse
    const successData = orderData as SuccessOrderResponse;
    const { total, userId, items } = successData.order;

    // Fetch customer details from User model
    const user = await User.findById(userId).select("name email");
    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // PayOnHub API request
    const url = "https://api.payonhub.com/v1/transactions";
    const publicKey = process.env.PAYONHUB_PUBLIC_KEY;
    const secretKey = process.env.PAYONHUB_SECRET_KEY;

    if (!publicKey || !secretKey) {
      throw new Error("PayOnHub credentials are missing");
    }

    const auth = "Basic " + Buffer.from(`${publicKey}:${secretKey}`).toString("base64");

    const payload = {
      amount: Math.round(total * 100),
      paymentMethod: "pix",
      referenceId: orderId,
      currency: "BRL",
      description: `Payment for order #${orderId}`,
      items: items.map((item: OrderItem) => ({
        name: item.name,
        title: item.name,
        quantity: item.quantity,
        unitPrice: Math.round(item.price * 100),
        description: item.name,
        tangible: true,
      })),
      customer: {
        name: user.name,
        email: user.email,
      },
      pix: {
        expiration: 3600,
      },
      postbackUrl: `http://${baseUrl}/api/webhooks/payonhub`,
      externalRef: orderId,
      ip: request.headers.get("x-forwarded-for") || "unknown",
    };

    console.log("PayOnHub request:", { url, payload, headers: { Authorization: "Basic [hidden]", "Content-Type": "application/json" } });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const pixData = await response.json();
    console.log("PayOnHub response:", pixData);

    if (!response.ok) {
      console.error(`PayOnHub fetch failed: ${response.status} ${response.statusText}`, pixData);
      return NextResponse.json({ error: pixData.error || "Failed to create PIX transaction", details: pixData }, { status: response.status });
    }

    return NextResponse.json({
      pixCode: pixData.pix?.qrcode,
      amount: total,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error creating PIX transaction:", {
      message: errorMessage,
      stack: errorStack,
      orderId,
    });
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 });
  }
}