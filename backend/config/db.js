import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { autoSeedIfEmpty } from "./seed.js";

let mongodInstance = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/support_system";

  try {
    // Attempt connecting to the configured URI (Atlas or local) with a 3s timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeedIfEmpty();
    return true;
  } catch (error) {
    console.warn(`Local/Configured MongoDB connection failed (${error.message}).`);
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
};

export default connectDB;
