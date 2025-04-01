import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"

export async function GET() {
  try {
    await connectToDatabase()

    // Get the User model directly from mongoose
    const User = mongoose.model("User")

    // Find the user
    const user = await User.findOne({ email: "ryanchamruiyang@gmail.com" })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    // Set subscription end date to 30 days from now
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    // Update to paid status directly
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          accountType: "paid",
          subscription: {
            plan: "pro",
            status: "active",
            trialEndsAt: endDate,
            currentPeriodEnds: endDate,
            customerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
            subscriptionId: `sub_${Math.random().toString(36).substring(2, 15)}`,
            paymentMethod: "stripe",
          },
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "User updated to paid status. Log out and log back in to see changes.",
    })
  } catch (error: any) {
    console.error("Fix user status error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 },
    )
  }
}

