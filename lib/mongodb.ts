import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const connection = await mongoose.connect(MONGODB_URI, {
        dbName: "flor-de-lima",
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        retryReads: true,
      });
      cachedConnection = connection;
      console.log("Connected to MongoDB");
      return connection;
    } catch (error: unknown) {
      retries++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`MongoDB connection attempt ${retries} failed:`, errorMessage);
      if (retries === maxRetries) {
        // Define a type for errors that may have a 'reason' property
        interface ErrorWithReason extends Error {
          reason?: unknown;
        }
        const errorReason = error instanceof Error && "reason" in error 
          ? (error as ErrorWithReason).reason 
          : "Unknown reason";
        console.error("Connection failure reason:", errorReason);
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${errorMessage}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}