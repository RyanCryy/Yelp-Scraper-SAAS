import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"

export async function GET() {
  try {
    // Test database connection
    console.log("Testing database connection...")

    // Get MongoDB URI (mask sensitive parts)
    const mongodbUri = process.env.MONGODB_URI || "Not configured"
    const maskedUri = mongodbUri !== "Not configured" ? mongodbUri.replace(/:([^@]+)@/, ":***@") : mongodbUri

    // Try to connect
    await connectToDatabase()

    // Get connection state
    const connectionState = mongoose.connection.readyState
    const connectionStateText =
      connectionState === 0
        ? "Disconnected"
        : connectionState === 1
          ? "Connected"
          : connectionState === 2
            ? "Connecting"
            : connectionState === 3
              ? "Disconnecting"
              : "Unknown"

    return NextResponse.json({
      success: true,
      message: "Database connection test",
      connectionState: connectionStateText,
      mongodbUri: maskedUri,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

