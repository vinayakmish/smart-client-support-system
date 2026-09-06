import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { autoSeedIfEmpty } from "./seed.js";

let mongodInstance = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/support_system";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`Local/Configured MongoDB connection failed (${error.message}).`);

    // In-memory fallback for local development only (not Vercel serverless)
    if (!process.env.VERCEL) {
      console.log("Starting embedded In-Memory MongoDB server for instant setup...");
      try {
        if (!mongodInstance) {
          mongodInstance = await MongoMemoryServer.create();
        }
        const inMemoryUri = mongodInstance.getUri();
        const conn = await mongoose.connect(inMemoryUri);
        console.log(`Embedded In-Memory MongoDB Connected at ${inMemoryUri}`);
        await autoSeedIfEmpty();
        return true;
      } catch (memError) {
        console.error(`In-Memory MongoDB Error: ${memError.message}`);
        return false;
      }
    }
    return false;
  }
};

export default connectDB;
