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

  const maxRetries = 5; // Increased retries for VPN-related issues
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const connection = await mongoose.connect(MONGODB_URI, {
        dbName: "flor-de-lima",
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
        socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
        retryWrites: true, // Enable retryable writes
        retryReads: true, // Enable retryable reads
      });
      cachedConnection = connection;
      console.log("Connected to MongoDB");
      return connection;
    } catch (error: any) {
      retries++;
      console.error(`MongoDB connection attempt ${retries} failed:`, error.message);
      if (retries === maxRetries) {
        console.error("Connection failure reason:", error.reason);
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
}