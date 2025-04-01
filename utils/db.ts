import mongoose from "mongoose"

// Get the MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Define the type for the cached connection
interface Cached {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Global variable to cache the connection
const cached: Cached = (global as any).mongoose || { conn: null, promise: null }

// Set the cached connection on the global object
if (!(global as any).mongoose) {
  ;(global as any).mongoose = cached
}

export async function connectToDatabase() {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Successfully connected to MongoDB")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}

